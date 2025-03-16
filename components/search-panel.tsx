"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { DocumentData } from "./document-analyzer"

interface SearchPanelProps {
  onBackClick: () => void
}

export function SearchPanel({ onBackClick }: SearchPanelProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<DocumentData[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])

  useEffect(() => {
    // Get all documents from localStorage
    const allDocs = getAllDocuments()
    const categories = new Set<string>()

    allDocs.forEach((doc) => {
      doc.categories.forEach((category) => {
        categories.add(category)
      })
    })

    setAllCategories(Array.from(categories))

    // Initial search
    handleSearch()
  }, [])

  const getAllDocuments = (): DocumentData[] => {
    try {
      const data = localStorage.getItem("documentAnalyzer")
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error retrieving from localStorage:", error)
      return []
    }
  }

  const handleSearch = () => {
    const allDocs = getAllDocuments()

    const results = allDocs.filter((doc) => {
      // Filter by search term
      const matchesSearchTerm =
        !searchTerm ||
        doc.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.keyPoints.some((point) => point.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filter by categories
      const matchesCategories =
        selectedCategories.length === 0 || selectedCategories.some((category) => doc.categories.includes(category))

      return matchesSearchTerm && matchesCategories
    })

    setSearchResults(results)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleDelete = (id: string) => {
    try {
      const allDocs = getAllDocuments()
      const filteredDocs = allDocs.filter((doc) => doc.id !== id)

      localStorage.setItem("documentAnalyzer", JSON.stringify(filteredDocs))
      setSearchResults((prev) => prev.filter((doc) => doc.id !== id))

      toast({
        title: "Document deleted",
        description: "The document has been removed from the database",
      })
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete the document",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Search Documents</CardTitle>
            <Button variant="ghost" size="sm" onClick={onBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Search by content or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {allCategories.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Filter by category:</p>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium mb-1">{doc.documentType}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {doc.categories.map((category, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{formatDate(doc.timestamp)}</p>
                    <p className="text-sm mb-2">{truncateText(doc.summary, 150)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No documents found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

