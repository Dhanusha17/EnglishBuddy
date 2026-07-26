import { AIProvider, ChatMessage, AIGenerationOptions } from './types';
import { GeminiProvider } from './GeminiProvider';
import { MockProvider } from './MockProvider';

type ProviderName = 'Gemini' | 'Mock';

class AIService {
  private _provider: AIProvider | null = null;
  private geminiProvider: GeminiProvider | null = null;
  private providerName: ProviderName = 'Mock';
  private initError: string | null = null;

  constructor() {
    // Eager initialization removed to optimize build time and memory.
  }

  private getProvider(): AIProvider {
    if (this._provider) return this._provider;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 0) {
      try {
        const gemini = new GeminiProvider(apiKey);
        this._provider = gemini;
        this.geminiProvider = gemini;
        this.providerName = 'Gemini';
        console.log('[AIService] ✓ GeminiProvider initialized successfully (model: gemini-2.0-flash-lite)');
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[AIService] ✗ Failed to initialize GeminiProvider:', message);
        this.initError = 'GeminiProvider initialization failed — falling back to MockProvider.';
        this._provider = new MockProvider();
        this.providerName = 'Mock';
      }
    } else {
      console.warn('[AIService] ⚠ GEMINI_API_KEY is not set. Using MockProvider. Set GEMINI_API_KEY in .env to enable real AI.');
      this._provider = new MockProvider();
      this.providerName = 'Mock';
    }

    return this._provider;
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
    // Eagerly initialize if not already done, just for health check
    const provider = this.getProvider();
    try {
      const isHealthy = provider.checkHealth ? await provider.checkHealth() : true;
      return {
        status: isHealthy ? 'healthy' : 'degraded',
        provider: this.providerName,
        model: this.providerName === 'Gemini' ? 'gemini-2.0-flash-lite' : undefined,
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

  /**
   * Streaming chat — yields text chunks for SSE.
   * Falls back to a single resolved value from MockProvider.
   */
  async *chatStream(messages: ChatMessage[], options?: AIGenerationOptions): AsyncGenerator<string> {
    try {
      if (this.geminiProvider) {
        yield* this.geminiProvider.chatStream(messages, options);
      } else {
        yield await this.getProvider().chat(messages, options);
      }
    } catch (err) {
      console.error('[AIService] chatStream error:', this.sanitizeError(err));
      yield 'Our AI tutor is taking a short break. Please try again in a moment.';
    }
  }

  /**
   * Health check data — safe for client exposure (no keys or internal details).
   */
  getHealthStatus(): {
    provider: ProviderName;
    isLive: boolean;
    status: 'ready' | 'degraded';
    message: string;
    timestamp: string;
  } {
    const isLive = this.providerName === 'Gemini';
    return {
      provider: this.providerName,
      isLive,
      status: this.initError ? 'degraded' : 'ready',
      message: this.initError ?? (isLive
        ? 'Gemini AI provider is active and ready.'
        : 'Running in mock mode. Configure GEMINI_API_KEY for real AI.'),
      timestamp: new Date().toISOString(),
    };
  }

  /** Sanitize errors so internal details (incl. keys) are never logged */
  private sanitizeError(err: any): string {
    const message = err instanceof Error ? err.message : String(err);
    // Remove anything that looks like an API key from log output
    return message.replace(/[A-Za-z0-9_-]{30,}/g, '[REDACTED]');
  }

  isLive(): boolean {
    return this.geminiProvider !== null;
  }
}

// Export singleton instance
export const ai = new AIService();