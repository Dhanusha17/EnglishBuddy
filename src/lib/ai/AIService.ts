import { AIProvider, ChatMessage, AIGenerationOptions } from './types';
import { GeminiProvider } from './GeminiProvider';

type ProviderName = 'Gemini';

class AIService {
  private _provider: AIProvider | null = null;
  private geminiProvider: GeminiProvider | null = null;
  private providerName: ProviderName = 'Gemini';

  constructor() {}

  private getProvider(): AIProvider {
    if (this._provider) return this._provider;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim().length === 0) {
      console.error('[AIService] ✗ GEMINI_API_KEY is not configured.');
      throw new Error('AI service is not configured (missing API key).');
    }

    try {
      const gemini = new GeminiProvider(apiKey);
      this._provider = gemini;
      this.geminiProvider = gemini;
      console.log('[AIService] ✓ GeminiProvider initialized successfully');
      return gemini;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[AIService] ✗ Failed to initialize GeminiProvider:', message);
      throw new Error(`Failed to initialize AI provider: ${message}`);
    }
  }

  async generateText(prompt: string, options?: AIGenerationOptions) {
    const provider = this.getProvider();
    try {
      return await provider.generateText(prompt, options);
    } catch (err) {
      console.error('[AIService] generateText error:', this.sanitizeError(err));
      throw new Error('AI service is temporarily unavailable. Please try again.');
    }
  }

  async chat(messages: ChatMessage[], options?: AIGenerationOptions) {
    const provider = this.getProvider();
    try {
      return await provider.chat(messages, options);
    } catch (err) {
      console.error('[AIService] chat error:', this.sanitizeError(err));
      throw new Error('AI chat service is temporarily unavailable. Please try again.');
    }
  }

  async checkHealth(): Promise<{ status: string; provider: string; model?: string; error?: string }> {
    try {
      const provider = this.getProvider();
      const isHealthy = provider.checkHealth ? await provider.checkHealth() : true;
      return {
        status: isHealthy ? 'healthy' : 'degraded',
        provider: this.providerName,
        model: 'gemini-2.0-flash-lite',
      };
    } catch (err) {
      return {
        status: 'unhealthy',
        provider: this.providerName,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  async generateStructuredResponse<T>(prompt: string, schema?: any, options?: AIGenerationOptions) {
    try {
      return await this.getProvider().generateStructuredResponse<T>(prompt, schema, options);
    } catch (err) {
      console.error('[AIService] generateStructuredResponse error:', this.sanitizeError(err));
      throw new Error('AI service is temporarily unavailable. Please try again.');
    }
  }

  async *chatStream(messages: ChatMessage[], options?: AIGenerationOptions): AsyncGenerator<string> {
    try {
      const provider = this.getProvider() as GeminiProvider;
      yield* provider.chatStream(messages, options);
    } catch (err) {
      console.error('[AIService] chatStream error:', this.sanitizeError(err));
      yield 'Our AI tutor is taking a short break. Please try again in a moment.';
    }
  }

  getHealthStatus(): {
    provider: ProviderName;
    isLive: boolean;
    status: 'ready' | 'degraded';
    message: string;
    timestamp: string;
  } {
    try {
      this.getProvider();
      return {
        provider: this.providerName,
        isLive: true,
        status: 'ready',
        message: 'Gemini AI provider is active and ready.',
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      return {
        provider: this.providerName,
        isLive: false,
        status: 'degraded',
        message: e instanceof Error ? e.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private sanitizeError(err: any): string {
    const message = err instanceof Error ? err.message : String(err);
    return message.replace(/[A-Za-z0-9_-]{30,}/g, '[REDACTED]');
  }

  isLive(): boolean {
    try {
      this.getProvider();
      return true;
    } catch {
      return false;
    }
  }
}

export const ai = new AIService();