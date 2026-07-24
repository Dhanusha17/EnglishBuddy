import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { AIProvider, AIGenerationOptions, ChatMessage } from './types';
import { PromptBuilder } from './PromptBuilder';

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI;
  private defaultModel = 'gemini-2.0-flash-lite';

  constructor(apiKey?: string) {
    this.ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY || '' });
  }

  async generateText(prompt: string, options?: AIGenerationOptions): Promise<string> {
    return this.withRetry(async () => {
      const response = await this.ai.models.generateContent({
        model: this.defaultModel,
        contents: prompt,
        config: {
          systemInstruction: PromptBuilder.buildChatSystemInstruction(),
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 2048,
        },
      });
      return response.text ?? '';
    });
  }

  async chat(messages: ChatMessage[], options?: AIGenerationOptions): Promise<string> {
    return this.withRetry(async () => {
      const systemMessages = messages.filter((m) => m.role === 'system');
      const chatMessages = messages.filter((m) => m.role !== 'system');

      const systemInstruction =
        systemMessages.length > 0
          ? systemMessages.map((m) => m.content).join('\n')
          : PromptBuilder.buildChatSystemInstruction();

      const contents = chatMessages.map((m) => ({
        role: m.role as 'user' | 'model',
        parts: [{ text: m.content }],
      }));

      const response = await this.ai.models.generateContent({
        model: this.defaultModel,
        contents,
        config: {
          systemInstruction,
          temperature: options?.temperature ?? 0.8,
          maxOutputTokens: options?.maxTokens ?? 4096,
        },
      });

      return response.text ?? '';
    });
  }

  /**
   * Streaming chat - returns an async generator of text chunks.
   * The calling API route can use this to send Server-Sent Events.
   */
  async *chatStream(
    messages: ChatMessage[],
    options?: AIGenerationOptions
  ): AsyncGenerator<string> {
    const systemMessages = messages.filter((m) => m.role === 'system');
    const chatMessages = messages.filter((m) => m.role !== 'system');

    const systemInstruction =
      systemMessages.length > 0
        ? systemMessages.map((m) => m.content).join('\n')
        : PromptBuilder.buildChatSystemInstruction();

    const contents = chatMessages.map((m) => ({
      role: m.role as 'user' | 'model',
      parts: [{ text: m.content }],
    }));

    const stream = await this.ai.models.generateContentStream({
      model: this.defaultModel,
      contents,
      config: {
        systemInstruction,
        temperature: options?.temperature ?? 0.8,
        maxOutputTokens: options?.maxTokens ?? 4096,
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  }

  async generateStructuredResponse<T>(
    prompt: string,
    schema?: any,
    options?: AIGenerationOptions
  ): Promise<T> {
    return this.withRetry(async () => {
      const response = await this.ai.models.generateContent({
        model: this.defaultModel,
        contents: prompt,
        config: {
          temperature: options?.temperature ?? 0.3,
          maxOutputTokens: options?.maxTokens ?? 2048,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text ?? '{}';
      try {
        return JSON.parse(text) as T;
      } catch {
        const cleaned = text
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
        return JSON.parse(cleaned) as T;
      }
    });
  }

  /** Retry with exponential backoff on 429 rate limit errors */
  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err: any) {
        const isRateLimit = err?.message?.includes('429') || err?.status === 429 ||
          (err?.error?.code === 429);
        if (isRateLimit && attempt < maxRetries) {
          const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.warn(
            `[GeminiProvider] Rate limit hit. Retrying in ${delayMs / 1000}s... (attempt ${attempt}/${maxRetries})`
          );
          await new Promise((r) => setTimeout(r, delayMs));
          continue;
        }
        throw err;
      }
    }
    throw new Error('Max retries reached');
  }
}