"use client"

import { useEffect } from "react"
import { initPdfWorker } from "@/lib/pdf-extractor"

export function PdfInitializer() {
  useEffect(() => {
    // Initialize the PDF.js worker when the component mounts
    initPdfWorker()
  }, [])

  // This component doesn't render anything
  return null
}

