"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface ProcessingPanelProps {
  text: string
  isProcessing: boolean
  processingStep: string
  error: string | null
  onProcess: () => void
}

export function ProcessingPanel({ text, isProcessing, processingStep, error, onProcess }: ProcessingPanelProps) {
  const hasText = text.trim().length > 0

  return (
    <div className="space-y-4">
      {hasText && (
        <Card>
          <CardContent className="pt-6">
            <div className="max-h-[200px] overflow-y-auto border rounded-md p-3 text-sm">
              <p className="whitespace-pre-wrap">
                {text.substring(0, 500)}
                {text.length > 500 ? "..." : ""}
              </p>
            </div>
            <div className="mt-2 text-xs text-right text-muted-foreground">{text.length} characters total</div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">{isProcessing && processingStep}</div>
            <Button onClick={onProcess} disabled={isProcessing || !hasText}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Analyze Text"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">{error}</div>}
    </div>
  )
}

