import { GoogleGenAI } from '@google/genai';
import { ISpeechToTextService, TranscriptionOptions, TranscriptionResult, AudioMetadata } from './ISpeechToTextService';

export class GeminiSpeechToTextProvider implements ISpeechToTextService {
  private ai: GoogleGenAI;
  private defaultModel = 'gemini-2.0-flash-lite';

  constructor(apiKey?: string) {
    this.ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY || '' });
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    mimeType: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    try {
      const base64Audio = audioBuffer.toString('base64');
      const prompt = options?.prompt 
        ? `Transcribe the provided audio accurately into text. Focus: ${options.prompt}`
        : 'Transcribe the provided spoken audio recording into text with high precision.';

      const response = await this.ai.models.generateContent({
        model: this.defaultModel,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: base64Audio,
                  mimeType: mimeType || 'audio/webm',
                },
              },
              { text: prompt },
            ],
          },
        ],
      });

      const text = response.text || '';
      const metadata = await this.extractMetadata(audioBuffer, mimeType);

      return {
        text: text.trim(),
        confidence: 0.95,
        language: options?.language || 'en',
        durationSeconds: metadata.durationSeconds,
      };
    } catch (error: any) {
      console.error('GeminiSpeechToTextProvider error:', error);
      throw new Error(`Speech-to-text transcription failed: ${error.message || error}`);
    }
  }

  async extractMetadata(audioBuffer: Buffer, mimeType: string): Promise<AudioMetadata> {
    // Basic estimation of audio duration based on bitrates if exact header metadata parsing isn't present
    // For standard webm/mp3, estimating average bitrates (e.g. 128kbps = 16KB/sec)
    const sizeBytes = audioBuffer.byteLength;
    let estimatedDurationSeconds = Math.round(sizeBytes / (16 * 1024));
    if (estimatedDurationSeconds < 1) estimatedDurationSeconds = 1;

    return {
      durationSeconds: estimatedDurationSeconds,
      mimeType,
      sizeBytes,
    };
  }
}
