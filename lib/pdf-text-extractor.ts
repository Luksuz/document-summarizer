export async function extractTextFromPdfFallback(file: File): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          // Import pdfjs dynamically
          const pdfjs = await import("pdfjs-dist")

          // Don't set the worker - this will use the default fallback mode
          // which is slower but doesn't require a separate worker file

          const arrayBuffer = event.target?.result as ArrayBuffer
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

          let fullText = ""

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items.map((item: any) => item.str).join(" ")

            fullText += pageText + "\n\n"
          }

          resolve(fullText.trim())
        } catch (error) {
          console.error("PDF extraction error:", error)
          reject(new Error("Failed to extract text from PDF. The file might be corrupted or password-protected."))
        }
      }

      reader.onerror = () => {
        reject(new Error("Failed to read the PDF file."))
      }

      reader.readAsArrayBuffer(file)
    })
  } catch (error) {
    console.error("Error in PDF extraction:", error)
    throw new Error("Failed to process the PDF file.")
  }
}

