"use client";

import { useState } from "react";
import { Briefcase, Send, Loader2, User, Bot, Play } from "lucide-react";

type Message = {
  role: "user" | "model";
  content: string;
};

export default function InterviewCoachPage() {
  const [type, setType] = useState<"HR" | "TECHNICAL" | "BEHAVIORAL">("HR");
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Welcome to the Mock Interview. Let's begin. Could you start by introducing yourself?" }
  ]);
  const [input, setInput] = useState("");
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startInterview = () => {
    setIsInterviewing(true);
    setResult(null);
    setMessages([{ role: "model", content: `Welcome to the \${type} Mock Interview. Let's begin. Could you start by introducing yourself?` }]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");

    // Simple bot logic to ask next question. In a real scenario, this would hit a chat API.
    // For this prototype, we simulate a 3-turn interview then allow evaluation.
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "model", 
        content: prev.length < 5 ? "Interesting. Can you elaborate on that?" : "Thank you. That concludes the interview. Click 'Evaluate' to see your feedback." 
      }]);
    }, 1000);
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, transcript: messages })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setIsInterviewing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-teal-100 rounded-full mb-4">
          <Briefcase className="text-teal-600 w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Coach</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Practice your interview skills with our AI and get instant feedback on confidence, clarity, and relevance.
        </p>
      </div>

      {!isInterviewing && !result ? (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Choose Interview Type</h2>
          <div className="flex flex-col gap-3 mb-8">
            {["HR", "TECHNICAL", "BEHAVIORAL"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t as any)}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-colors \${type === t ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-teal-200'}`}
              >
                {t} Interview
              </button>
            ))}
          </div>
          <button
            onClick={startInterview}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex justify-center items-center gap-2"
          >
            <Play fill="currentColor" size={18} /> Start Interview
          </button>
        </div>
      ) : isInterviewing ? (
        <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">{type} Interview</h3>
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || messages.length < 3}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isEvaluating ? <Loader2 className="animate-spin" size={16} /> : "End & Evaluate"}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 \${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`p-2 rounded-full h-fit \${msg.role === "user" ? "bg-teal-100 text-teal-600" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                  {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 \${msg.role === "user" ? "bg-teal-600 text-white rounded-tr-none" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={isEvaluating}
              className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isEvaluating}
              className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm animate-in zoom-in-95 duration-500">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">Interview Feedback</h2>
          <div className="grid grid-cols-3 gap-6 mb-8 text-center">
            <div className="p-4 bg-teal-50 dark:bg-teal-900/10 rounded-xl border border-teal-100 dark:border-teal-900">
              <div className="text-4xl font-black text-teal-600">{result.confidenceScore}</div>
              <div className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Confidence</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900">
              <div className="text-4xl font-black text-blue-600">{result.clarityScore}</div>
              <div className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Clarity</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900">
              <div className="text-4xl font-black text-purple-600">{result.relevanceScore}</div>
              <div className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Relevance</div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Overall Feedback</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.overallFeedback}</p>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => { setResult(null); setMessages([]); }}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 font-medium"
            >
              Start New Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
