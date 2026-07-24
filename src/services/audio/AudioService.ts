import { ISpeechToTextService } from './ISpeechToTextService';
import { GeminiSpeechToTextProvider } from './GeminiSpeechToTextProvider';

export class AudioService {
  private sttProvider: ISpeechToTextService;

  constructor(sttProvider?: ISpeechToTextService) {
    this.sttProvider = sttProvider || new GeminiSpeechToTextProvider();
  }

  async processAudioUpload(audioBuffer: Buffer, mimeType: string) {
    const metadata = await this.sttProvider.extractMetadata(audioBuffer, mimeType);
    return {
      size: metadata.sizeBytes,
      duration: metadata.durationSeconds,
      mimeType: metadata.mimeType,
    };
  }

  async transcribe(audioBuffer: Buffer, mimeType: string, prompt?: string) {
    return await this.sttProvider.transcribeAudio(audioBuffer, mimeType, { prompt });
  }
}

export const audioService = new AudioService();
