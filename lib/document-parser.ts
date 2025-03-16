import { extractTextFromPdf } from "./pdf-extractor"

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split(".").pop()?.toLowerCase()

  if (fileType === "pdf") {
    return extractTextFromPdf(file)
  } else if (fileType === "docx") {
    return extractTextFromDocx(file)
  } else if (fileType === "txt") {
    return extractTextFromTxt(file)
  } else {
    throw new Error("Unsupported file format. Please upload a PDF, DOCX, or TXT file.")
  }
}

async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const mammoth = await import("mammoth")
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value.trim()
  } catch (error) {
    console.error("Error extracting text from DOCX:", error)
    throw new Error("Failed to extract text from DOCX file.")
  }
}

async function extractTextFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        resolve(text.trim())
      } catch (error) {
        reject(new Error("Failed to read the text file."))
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read the text file."))
    }

    reader.readAsText(file)
  })
}

