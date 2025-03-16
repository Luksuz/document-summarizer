"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X } from "lucide-react"

interface FileUploaderProps {
  onFileChange: (file: File | null) => void
  acceptedFileTypes: string
  isProcessing?: boolean
}

export function FileUploader({ onFileChange, acceptedFileTypes, isProcessing = false }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
    onFileChange(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0] || null
    if (file && isValidFileType(file)) {
      handleFileSelect(file)
    }
  }

  const isValidFileType = (file: File) => {
    const fileTypes = acceptedFileTypes.split(",")
    const fileName = file.name.toLowerCase()
    return fileTypes.some((type) => fileName.endsWith(type.replace(".", "")))
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setSelectedFile(null)
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
        disabled={isProcessing}
      />

      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Drag and drop your file here or</p>
              <Button variant="outline" onClick={handleButtonClick} className="mt-2" disabled={isProcessing}>
                Browse Files
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Supported formats: DOCX, TXT</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={removeFile} aria-label="Remove file" disabled={isProcessing}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

