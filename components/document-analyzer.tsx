"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { FileUploader } from "./file-uploader"
import { TextInput } from "./text-input"
import { ProcessingPanel } from "./processing-panel"
import { ResultsPanel } from "./results-panel"
import { SearchPanel } from "./search-panel"
import { ApiKeyInput } from "./api-key-input"
import { extractTextFromFile } from "@/lib/document-parser"
import { analyzeTextAction, saveToStorageAction, type AnalysisResult } from "@/app/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { DocumentUploader } from "@/components/document-uploader"

// Define the document data interface
export interface DocumentData extends AnalysisResult {
  id: string
  originalText: string
  timestamp: string
}

export function DocumentAnalyzer() {
  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-1 mb-8">
        <TabsTrigger value="upload">Upload Document</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <DocumentUploader />
      </TabsContent>
    </Tabs>
  )
}

