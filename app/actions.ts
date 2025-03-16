"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface AnalysisResult {
  summary: string
  documentType: string
  categories: string[]
  keyPoints: string[]
  sentiment: string
}

export async function analyzeTextAction(text: string): Promise<AnalysisResult> {
  if (!text.trim()) {
    throw new Error("No text provided for analysis")
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured in server environment")
  }

  try {
    // Truncate text if it's too long (OpenAI has token limits)
    const truncatedText = text.length > 15000 ? text.substring(0, 15000) + "..." : text

    const prompt = `
    Analyze the following text and provide:
    1. A comprehensive summary in markdown format
    2. The document type (e.g., chat history, blog post, news article, technical document, etc.)
    3. A list of 3-5 relevant categories that this text belongs to
    4. 3-5 key points from the text
    5. The overall sentiment of the text (positive, negative, neutral, or mixed)

    Text to analyze:
    ${truncatedText}
    `

    const { text: analysisText } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are an expert text analyzer. Your task is to analyze text documents and provide structured information about them. Format your response as JSON with the following fields: summary, documentType, categories (array), keyPoints (array), and sentiment.",
      temperature: 0.3,
      maxTokens: 2000,
    })

    // Parse the JSON response
    try {
      // First try to parse the entire response as JSON
      const parsedResponse = JSON.parse(analysisText)
      return parsedResponse
    } catch (parseError) {
      // If that fails, try to extract JSON from the response text
      const jsonMatch =
        analysisText.match(/```json\s*([\s\S]*?)\s*```/) ||
        analysisText.match(/{[\s\S]*}/) ||
        analysisText.match(/{[\s\S]*}/)

      if (jsonMatch) {
        const jsonString = jsonMatch[1] || jsonMatch[0]
        return JSON.parse(jsonString)
      }

      // If all else fails, create a structured response from the text
      return {
        summary: "Failed to parse AI response. Please try again.",
        documentType: "Unknown",
        categories: ["Unclassified"],
        keyPoints: ["Error in processing"],
        sentiment: "Unknown",
      }
    }
  } catch (error) {
    console.error("Error generating analysis:", error)
    throw new Error("Failed to analyze text. Please check your API key and try again.")
  }
}

export async function saveToStorageAction(data: any): Promise<{ id: string }> {
  // Generate a unique ID
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2)

  // In a real app, you would save to a database here
  // For this demo, we'll just return the ID
  return { id }
}

