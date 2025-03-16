"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface TextInputProps {
  onTextChange: (text: string) => void
}

export function TextInput({ onTextChange }: TextInputProps) {
  const [text, setText] = useState("")

  useEffect(() => {
    onTextChange(text)
  }, [text, onTextChange])

  return (
    <Card>
      <CardContent className="pt-6">
        <Textarea
          placeholder="Paste your text here... (chat logs, blog posts, articles, etc.)"
          className="min-h-[200px] resize-y"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-2 text-xs text-right text-muted-foreground">{text.length} characters</div>
      </CardContent>
    </Card>
  )
}

