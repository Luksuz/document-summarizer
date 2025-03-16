"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUploader } from "./file-uploader"
import { SummaryDisplay } from "./summary-display"
import { extractTextFromFile } from "@/lib/document-parser"
import { analyzeTextAction } from "@/app/actions"
import { Loader2 } from "lucide-react"
import type { AnalysisResult } from "@/app/actions"

export function DocumentUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
    setExtractedText("")
    setAnalysis(null)
    setError(null)
  }

  const processFile = async () => {
    if (!file) return

    try {
      setIsProcessing(true)
      setError(null)

      // Extract text from the file
      setProcessingStep("Extracting text from document...")
      let text
      try {
        text = await extractTextFromFile(file)
      } catch (extractError) {
        console.error("Error extracting text:", extractError)
        setError(
          extractError instanceof Error
            ? `Text extraction failed: ${extractError.message}`
            : "Failed to extract text from the document",
        )
        setIsProcessing(false)
        return
      }

      setExtractedText(text)

      // Generate analysis using server action
      setProcessingStep("Analyzing document with AI...")
      try {
        const result = await analyzeTextAction(text)
        setAnalysis(result)
      } catch (analysisError) {
        console.error("Error analyzing text:", analysisError)
        setError(
          analysisError instanceof Error
            ? `Analysis failed: ${analysisError.message}`
            : "Failed to analyze document",
        )
        // We still keep the extracted text even if analysis fails
      }
    } catch (err) {
      console.error("General error processing file:", err)
      setError(err instanceof Error ? err.message : "An error occurred while processing the file")
    } finally {
      setIsProcessing(false)
      setProcessingStep("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <FileUploader
            onFileChange={handleFileChange}
            acceptedFileTypes=".docx,.txt"
            isProcessing={isProcessing}
          />
          {file && (
            <div className="mt-4 flex justify-center">
              <Button onClick={processFile} disabled={isProcessing} className="w-full max-w-xs">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {processingStep || "Processing..."}
                  </>
                ) : (
                  "Extract & Analyze"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">{error}</div>}

      {analysis && <SummaryDisplay analysis={analysis} />}
    </div>
  )
}

