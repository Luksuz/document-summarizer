export interface DocumentData {
  id: string
  originalText: string
  summary: string
  documentType: string
  categories: string[]
  keyPoints: string[]
  sentiment: string
  timestamp: string
}

// Generate a unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Save document to localStorage
export function saveToDatabase(data: Omit<DocumentData, "id">): DocumentData {
  try {
    // Get existing documents
    const existingDocs = getAllDocuments()

    // Create new document with ID
    const newDoc: DocumentData = {
      ...data,
      id: generateId(),
    }

    // Add to existing documents
    existingDocs.push(newDoc)

    // Save back to localStorage
    localStorage.setItem("documentAnalyzer", JSON.stringify(existingDocs))

    return newDoc
  } catch (error) {
    console.error("Error saving to database:", error)
    throw new Error("Failed to save document to database")
  }
}

// Get all documents from localStorage
function getAllDocuments(): DocumentData[] {
  try {
    const data = localStorage.getItem("documentAnalyzer")
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error retrieving from database:", error)
    return []
  }
}

// Search documents by text or categories
export function searchDocuments(searchTerm: string, categories: string[] = []): DocumentData[] {
  try {
    const allDocs = getAllDocuments()

    if (!searchTerm && categories.length === 0) {
      return allDocs
    }

    return allDocs.filter((doc) => {
      // Filter by search term
      const matchesSearchTerm =
        !searchTerm ||
        doc.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.keyPoints.some((point) => point.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filter by categories
      const matchesCategories =
        categories.length === 0 || categories.some((category) => doc.categories.includes(category))

      return matchesSearchTerm && matchesCategories
    })
  } catch (error) {
    console.error("Error searching documents:", error)
    return []
  }
}

// Delete a document by ID
export function deleteDocument(id: string): boolean {
  try {
    const allDocs = getAllDocuments()
    const filteredDocs = allDocs.filter((doc) => doc.id !== id)

    localStorage.setItem("documentAnalyzer", JSON.stringify(filteredDocs))
    return true
  } catch (error) {
    console.error("Error deleting document:", error)
    return false
  }
}

