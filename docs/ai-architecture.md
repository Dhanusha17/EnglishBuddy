# AI Architecture Overview – EnglishBuddy

## Directory Structure

```
src/lib/ai/
├── types.ts            # Core interfaces (AIProvider, ChatMessage, AIGenerationOptions)
├── AIService.ts        # Singleton service consumed by all API routes
├── GeminiProvider.ts   # Production Gemini 2.5 Flash provider (streaming supported)
├── MockProvider.ts     # Fallback provider when GEMINI_API_KEY is absent
├── PromptBuilder.ts    # Centralized versioned prompt templates for all coaches
└── ResponseFormatter.ts # Typed response interfaces + safe JSON parser + fallbacks

src/app/api/ai/
├── chat/route.ts          # Multi-turn chat with SSE streaming support
├── grammar/route.ts       # Grammar check + rewrite with tone control
├── writing/route.ts       # Writing coach (essays, emails, cover letters)
├── speaking/route.ts      # Speaking transcript analysis (6-dimension scoring)
├── reading/route.ts       # Reading assistant (summary, level, comprehension)
├── vocabulary/route.ts    # Vocabulary deep-dive (definition, idioms, quiz)
├── interview/route.ts     # Interview coach with STAR method analysis
├── gd-coach/route.ts      # Group discussion evaluation and coaching
├── study-planner/route.ts # Personalized weekly study plan generation
└── recommendations/route.ts # User-profile-based learning recommendations
```

## Provider Pattern

The AI layer follows the **Strategy Pattern**:

```
Frontend → API Route → AIService (singleton)
                            ↓
                     GeminiProvider (live)
                           OR
                     MockProvider (fallback)
```

- **AIService** is the only class consumed by API routes.
- **Swapping providers** requires only changing the `constructor()` of `AIService`.
- **Streaming** is supported via `ai.chatStream()` which yields text chunks.

## Prompt Management

All prompts live in `PromptBuilder.ts`. Each method:
- Embeds a persona system instruction at the top.
- Specifies the exact JSON schema for the response.
- Is versioned with `PROMPT_VERSION` at the top of the file.

To update a prompt, edit `PromptBuilder.ts` and increment the version.

## Environment Setup

Add to `.env`:
```env
GEMINI_API_KEY="your_key_from_aistudio.google.com"
```

Get your key at: **https://aistudio.google.com/app/apikey**

Without this key, the app runs with `MockProvider` (no real AI calls).

## Streaming Chat (SSE)

Send `{ ..., "stream": true }` in the POST body to `/api/ai/chat`.

The server responds with `text/event-stream`:
```
data: {"chunk": "Hello"}
data: {"chunk": ", how"}
data: {"chunk": " can I help?"}
data: [DONE]
```

## Safety & Reliability

- All inputs are validated via **Zod** before reaching the AI.
- Structured responses use `responseMimeType: 'application/json'` to enforce JSON output.
- `ResponseFormatter.parseJSON()` safely strips markdown fences and parses the response.
- Fallback messages are shown to users when AI calls fail — internal errors are never exposed.
- `temperature` is set low (0.3) for structured outputs and higher (0.8) for conversational chat.

## Adding a New Coach

1. Add a prompt template to `PromptBuilder.ts`.
2. Add a typed response interface to `ResponseFormatter.ts`.
3. Create a new API route under `src/app/api/ai/`.
4. Call `ai.generateStructuredResponse<YourType>(prompt)`.

Done. No changes to `AIService`, `GeminiProvider`, or the frontend architecture needed.
