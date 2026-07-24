"use client";

import { useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "model";
  content: string;
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hello! I'm your EnglishBuddy Tutor. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, conversationId: conversationId || undefined })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: "model", content: data.reply }]);
        if (data.conversationId) setConversationId(data.conversationId);
      } else {
        setMessages(prev => [...prev, { role: "model", content: "Error: " + (data.error || "Something went wrong") }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", content: "Error: Network issue" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Tutor Chat</h1>
        <p className="text-gray-500">Ask me anything about English, placement, or programming.</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 \${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`p-2 rounded-full h-fit \${msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
              {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 \${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="p-2 rounded-full h-fit bg-purple-100 text-purple-600">
              <Bot size={20} />
            </div>
            <div className="max-w-[80%] rounded-2xl p-4 bg-gray-100 dark:bg-gray-800 rounded-tl-none flex items-center gap-2">
              <Loader2 className="animate-spin text-gray-500" size={20} />
              <span className="text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full py-4 pl-6 pr-16 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
