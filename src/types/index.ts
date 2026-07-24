// Generic types for the backend

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// AI Service Interfaces
export interface AiMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AiServiceAbstract {
  chat(messages: AiMessage[]): Promise<string>
  analyzeGrammar(text: string): Promise<any>
}
