"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles, Copy, Bookmark, MoreHorizontal } from "lucide-react"
import { useAIChat, ChatMessage } from "@/lib/ai/use-ai-chat"
import { motion, AnimatePresence } from "framer-motion"

interface AIChatWindowProps {
  agentName: string
  agentIcon: any
  colorClass: string
  welcomeMessage?: string
}

export function AIChatWindow({ agentName, agentIcon: AgentIcon, colorClass, welcomeMessage }: AIChatWindowProps) {
  const { messages, isTyping, sendMessage } = useAIChat()
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Override the first message if welcomeMessage is provided, otherwise keep default hook message
  const displayMessages = welcomeMessage && messages.length === 1 && messages[0].role === "ai"
    ? [{ ...messages[0], content: welcomeMessage }] 
    : messages

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] border-2 shadow-sm overflow-hidden bg-card">
      
      {/* Chat Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm ${colorClass}`}>
            <AgentIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold">{agentName}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Online & Ready
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar" ref={scrollRef}>
        <div className="space-y-6 max-w-3xl mx-auto">
          
          <AnimatePresence initial={false}>
            {displayMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-primary text-primary-foreground" : `${colorClass} text-white`}`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <AgentIcon className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-muted rounded-tl-sm border"
                  }`}>
                    {msg.content}
                  </div>
                  
                  {/* Action buttons for AI messages */}
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"><Copy className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"><Bookmark className="h-3 w-3" /></Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white ${colorClass}`}>
                <AgentIcon className="h-4 w-4" />
              </div>
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm border flex items-center gap-1.5 h-10 w-16">
                <span className="h-1.5 w-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 bg-muted-foreground/50 rounded-full animate-bounce"></span>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <Input 
            placeholder="Type your message here..."
            className="pr-12 h-12 bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <Button 
            size="icon" 
            className="absolute right-1.5 h-9 w-9 rounded-lg"
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2 font-medium">
          Powered by Google Gemini API Architecture
        </p>
      </div>

    </Card>
  )
}
