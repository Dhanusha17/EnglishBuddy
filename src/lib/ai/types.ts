export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface AIGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  responseSchema?: any; // Zod schema or JSON schema depending on provider
}

export interface AIProvider {
  generateText(prompt: string, options?: AIGenerationOptions): Promise<string>;
  chat(messages: ChatMessage[], options?: AIGenerationOptions): Promise<string>;
  generateStructuredResponse<T>(prompt: string, schema: any, options?: AIGenerationOptions): Promise<T>;
}