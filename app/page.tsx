import { DocumentAnalyzer } from "@/components/document-analyzer"

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Document Analyzer</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Extract, summarize, classify, and store text from various sources
      </p>
      <DocumentAnalyzer />
    </div>
  )
}

