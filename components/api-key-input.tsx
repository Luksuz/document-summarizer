"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface ApiKeyInputProps {
  apiKey: string
  setApiKey: (key: string) => void
}

export function ApiKeyInput({ apiKey, setApiKey }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false)

  const toggleShowKey = () => {
    setShowKey(!showKey)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">OpenAI API Key</CardTitle>
        <CardDescription>Enter your OpenAI API key to enable text analysis and summarization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={toggleShowKey}
              className="absolute right-0 top-0 h-full px-3"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

