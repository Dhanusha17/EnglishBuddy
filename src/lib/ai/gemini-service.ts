/**
 * GeminiService
 * 
 * A placeholder service designed to mimic the architecture of the real Google Gemini API.
 * This class abstracts the API calls so they can be easily replaced later.
 */

export class GeminiService {
  /**
   * Generates a conversational response from the AI.
   */
  static async generateText(prompt: string, context?: any[]): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const lowerPrompt = prompt.toLowerCase()
    
    // Placeholder logic based on prompt keywords
    if (lowerPrompt.includes("grammar")) {
      return "That's a great question about grammar. The rule here is that subject and verb must agree in number. For example, 'He runs' (singular) vs 'They run' (plural)."
    }
    
    if (lowerPrompt.includes("interview") || lowerPrompt.includes("hr")) {
      return "When answering HR questions, always use the STAR method: Situation, Task, Action, Result. This structures your answer and provides concrete evidence of your skills."
    }

    if (lowerPrompt.includes("vocabulary") || lowerPrompt.includes("meaning")) {
      return "The word you're asking about is very useful in professional contexts. A good synonym would be 'Proficient' or 'Capable'. Try using it in a sentence like: 'I am highly proficient in React.'"
    }

    // Default response
    return `This is a simulated AI response to: "${prompt}". In the future, this will be powered by the real Google Gemini API. How else can I help you improve your English today?`
  }

  /**
   * Specialized method for evaluating speaking exercises
   */
  static async evaluateSpeaking(audioData: Blob): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      score: 85,
      fluency: 90,
      pronunciation: 80,
      grammar: 85,
      feedback: "Great job! Your fluency is excellent. Try to work a bit on pronouncing the 'th' sound more clearly."
    }
  }

  /**
   * Specialized method for evaluating writing exercises
   */
  static async evaluateWriting(text: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
      score: 92,
      grammar: 95,
      vocabulary: 88,
      suggestions: [
        { original: "good", suggestion: "excellent", reason: "More professional tone." },
        { original: "I think", suggestion: "In my opinion", reason: "Better transition phrase." }
      ]
    }
  }
}
