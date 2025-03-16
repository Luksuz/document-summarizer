export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (!fileType) {
    throw new Error('Unable to determine file type');
  }
  
  try {
    switch (fileType) {
      case 'txt':
        return await extractTextFromTxt(file);
      case 'docx':
        return await extractTextFromDocx(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}. Only TXT and DOCX files are supported.`);
    }
  } catch (error) {
    console.error(`Error extracting text from ${fileType} file:`, error);
    throw error;
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

