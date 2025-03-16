"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import type { DocumentData } from "@/lib/document-storage"

interface ResultsPanelProps {
  results: DocumentData
  onSearchClick: () => void
}

export function ResultsPanel({ results, onSearchClick }: ResultsPanelProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("summary")

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: `The ${label} has been copied to your clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Analysis Results</CardTitle>
          <Button variant="outline" size="sm" onClick={onSearchClick}>
            <Search className="h-4 w-4 mr-2" />
            Search Database
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-primary/10">
            {results.documentType}
          </Badge>
          {results.categories.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-4">
          <TabsContent value="summary" className="mt-0">
            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
              <ReactMarkdown>{results.summary}</ReactMarkdown>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => copyToClipboard(results.summary, "summary")}
            >
              <Copy className="h-3.5 w-3.5 mr-2" />
              Copy Summary
            </Button>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Document Type</h3>
                <p>{results.documentType}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {results.categories.map((category, index) => (
                    <Badge key={index} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Key Points</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {results.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Sentiment</h3>
                <p>{results.sentiment}</p>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="text-xs text-muted-foreground">
        Analyzed and saved on {new Date(results.timestamp).toLocaleString()}
      </CardFooter>
    </Card>
  )
}

