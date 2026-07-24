import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/ai/AIService';

/**
 * GET /api/ai/health
 *
 * Returns current AI provider status.
 * Safe for client consumption — no API keys or internal errors are exposed.
 */
export const GET = async (req: NextRequest) => {
  const status = ai.getHealthStatus();

  // Test connectivity if Gemini is configured
  let connectivityStatus: 'ok' | 'error' | 'not_tested' = 'not_tested';

  if (ai.isLive()) {
    try {
      await ai.generateText('Reply with the single word: PONG', { maxTokens: 5 });
      connectivityStatus = 'ok';
    } catch {
      connectivityStatus = 'error';
    }
  }

  return NextResponse.json({
    provider: status.provider,
    status: status.status,
    message: status.message,
    connectivity: connectivityStatus,
    timestamp: status.timestamp,
  });
};
