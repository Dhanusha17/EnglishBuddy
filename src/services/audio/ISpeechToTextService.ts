export interface TranscriptionOptions {
  language?: string;
  prompt?: string;
}

export interface AudioMetadata {
  durationSeconds?: number;
  sampleRate?: number;
  channels?: number;
  mimeType: string;
  sizeBytes: number;
}

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  language?: string;
  durationSeconds?: number;
  words?: Array<{ word: string; start: number; end: number }>;
}

export interface ISpeechToTextService {
  /**
   * Transcribes an audio file buffer into text.
   */
  transcribeAudio(
    audioBuffer: Buffer,
    mimeType: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult>;

  /**
   * Extracts duration and audio metadata from an audio file buffer.
   */
  extractMetadata(audioBuffer: Buffer, mimeType: string): Promise<AudioMetadata>;
}
