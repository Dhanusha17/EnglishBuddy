import { useState, useCallback } from "react"
import { GeminiService } from "./gemini-service"

export interface ChatMessage {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: Date
}

/**
 * Hook to manage chat state and interactions with the GeminiService.
 */
export function useAIChat(initialContext?: any) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I am your AI English Mentor. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      // In a real app, we would pass the message history as context
      const response = await GeminiService.generateText(content)
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error("Failed to generate response:", error)
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }, [])

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "ai",
        content: "Chat cleared. What would you like to discuss next?",
        timestamp: new Date()
      }
    ])
  }, [])

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat
  }
}
