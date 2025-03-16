export async function extractTextFromPdfAlternative(file: File): Promise<string> {
  try {
    // Use a text-based approach for PDF extraction
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer

          // Try to use pdf-parse which has a simpler API
          const pdfParse = await import("pdf-parse/lib/pdf-parse.js")
          const data = await pdfParse.default(new Uint8Array(arrayBuffer))

          resolve(data.text || "")
        } catch (parseError) {
          console.error("PDF parse error:", parseError)
          reject(new Error("Could not parse the PDF content."))
        }
      }

      reader.onerror = () => reject(new Error("Failed to read the file."))
      reader.readAsArrayBuffer(file)
    })

    return text.trim()
  } catch (error) {
    console.error("Alternative PDF extraction failed:", error)
    throw new Error("Failed to extract text from PDF using alternative method.")
  }
}

