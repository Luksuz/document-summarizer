"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalysisResult } from "@/app/actions"

interface SummaryDisplayProps {
  analysis: AnalysisResult
}

export function SummaryDisplay({ analysis }: SummaryDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: analysis.summary }} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Document Type</h3>
            <p>{analysis.documentType}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Sentiment</h3>
            <p>{analysis.sentiment}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <ul className="list-disc pl-5">
            {analysis.categories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Key Points</h3>
          <ul className="list-disc pl-5">
            {analysis.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

