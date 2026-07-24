/**
 * ResponseFormatter - Normalizes and formats AI responses for the frontend.
 * Handles markdown stripping, error fallbacks, and structured type coercion.
 */

export interface GrammarCheckResponse {
  isCorrect: boolean;
  correctedText: string;
  score: number;
  explanations: { original: string; correction: string; rule: string }[];
  tipOfTheDay: string;
}

export interface WritingReviewResponse {
  overallScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  corrections: { original: string; suggestion: string; reason: string }[];
  vocabularyEnhancements: { word: string; betterAlternative: string }[];
  improvedVersion: string;
}

export interface SpeakingAnalysisResponse {
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  clarityScore: number;
  confidenceScore: number;
  feedback: string;
  grammarFixes: string[];
  vocabularySuggestions: string[];
  actionableSteps: string[];
  encouragement: string;
}

export interface ReadingAnalysisResponse {
  summary: string;
  readingLevel: string;
  mainThemes: string[];
  difficultWords: { word: string; meaning: string; exampleSentence: string }[];
  comprehensionQuestions: { question: string; answer: string }[];
  keyTakeaways: string[];
}

export interface VocabularyResponse {
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  synonyms: string[];
  antonyms: string[];
  examples: string[];
  idioms: string[];
  phrasalVerbs: string[];
  quiz: { question: string; options: string[]; correctAnswer: string }[];
}

export interface InterviewFeedbackResponse {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  starMethodAnalysis: { situation: string; task: string; action: string; result: string };
  suggestedAnswer: string;
  communicationTips: string[];
  keyImprovements: string[];
}

export interface GDCoachResponse {
  overallScore: number;
  feedback: string;
  strongPoints: string[];
  weakPoints: string[];
  counterarguments: string[];
  betterOpening: string;
  closingStatement: string;
  tips: string[];
}

export interface StudyPlanResponse {
  weeklyGoal: string;
  dailyPlan: { day: string; focus: string; tasks: string[]; durationMinutes: number }[];
  focusAreas: string[];
  milestones: string[];
  motivationalMessage: string;
}

export interface RecommendationsResponse {
  recommendations: {
    type: 'LESSON' | 'PRACTICE' | 'TEST' | 'VOCABULARY' | 'INTERVIEW';
    title: string;
    reason: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
}

export class ResponseFormatter {
  /**
   * Safely parse a JSON string, stripping markdown code fences if present.
   */
  static parseJSON<T>(raw: string, fallback: T): T {
    try {
      // Strip common LLM markdown wrappers like ```json ... ```
      const cleaned = raw
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      return JSON.parse(cleaned) as T;
    } catch {
      console.error('[ResponseFormatter] Failed to parse JSON:', raw.substring(0, 200));
      return fallback;
    }
  }

  static grammarFallback(): GrammarCheckResponse {
    return {
      isCorrect: true,
      correctedText: '',
      score: 0,
      explanations: [],
      tipOfTheDay: 'Keep practicing your English every day!'
    };
  }

  static writingFallback(): WritingReviewResponse {
    return {
      overallScore: 0,
      overallFeedback: 'Unable to analyze right now. Please try again.',
      strengths: [],
      improvements: [],
      corrections: [],
      vocabularyEnhancements: [],
      improvedVersion: ''
    };
  }

  static speakingFallback(): SpeakingAnalysisResponse {
    return {
      overallScore: 0,
      grammarScore: 0,
      vocabularyScore: 0,
      fluencyScore: 0,
      clarityScore: 0,
      confidenceScore: 0,
      feedback: 'Unable to analyze transcript right now. Please try again.',
      grammarFixes: [],
      vocabularySuggestions: [],
      actionableSteps: [],
      encouragement: 'Keep speaking and practicing!'
    };
  }

  static genericErrorMessage(): string {
    return 'Our AI tutor is taking a short break. Please try again in a moment.';
  }
}
