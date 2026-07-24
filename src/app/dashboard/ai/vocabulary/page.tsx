"use client";

import { useState } from "react";
import { BookOpen, Loader2, Volume2, Search } from "lucide-react";

export default function VocabularyBuilderPage() {
  const [word, setWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;
    
    setError("");
    setIsLoading(true);
    setResult(null);
    
    try {
      const res = await fetch("/api/ai/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const playPronunciation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-full mb-4">
          <BookOpen className="text-purple-600 w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vocabulary Builder</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Enter any word to instantly learn its meaning, synonyms, pronunciation, and how to use it in a sentence.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="e.g., Ubiquitous"
          disabled={isLoading}
          className="w-full text-lg bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-6 pr-16 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 shadow-sm transition-colors"
        />
        <button
          type="submit"
          disabled={!word.trim() || isLoading}
          className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {result && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white capitalize">{word}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-purple-600 font-medium">{result.pronunciation}</span>
                <button onClick={playPronunciation} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Volume2 size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold capitalize">
              {result.difficulty}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Meaning</h3>
              <p className="text-lg text-gray-800 dark:text-gray-200">{result.meaning}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Example</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl italic text-gray-700 dark:text-gray-300 border-l-4 border-purple-500">
                "{result.example}"
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Synonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {result.synonyms?.map((s: string) => (
                    <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Antonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {result.antonyms?.map((a: string) => (
                    <span key={a} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
