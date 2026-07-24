import { AIProvider, AIGenerationOptions, ChatMessage } from './types';

export class MockProvider implements AIProvider {
  async generateText(prompt: string, options?: AIGenerationOptions): Promise<string> {
    console.log('[MockProvider] Generating text for prompt:', prompt.substring(0, 50) + '...');
    return 'This is a mock response because GEMINI_API_KEY is not configured or mock mode is active.';
  }

  async chat(messages: ChatMessage[], options?: AIGenerationOptions): Promise<string> {
    console.log('[MockProvider] Chatting with', messages.length, 'messages');
    return 'This is a mock chat response.';
  }

  async generateStructuredResponse<T>(prompt: string, schema: any, options?: AIGenerationOptions): Promise<T> {
    console.log('[MockProvider] Generating structured response');
    // We just return an empty object cast to T for mock purposes.
    // In a real mock environment, this should return a default mock object matching the schema.
    return {} as T;
  }
}