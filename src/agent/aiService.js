import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { buildSystemPrompt } from './systemPrompt';
import { logAICall } from './logger';

let openaiInstance = null;

function getOpenAI() {
  if (!openaiInstance) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-api-key-here') {
      throw new Error('Set VITE_OPENAI_API_KEY in .env to enable AI chat');
    }
    openaiInstance = createOpenAI({
      apiKey,
      compatibility: 'strict',
      dangerouslyAllowBrowser: true,
    });
  }
  return openaiInstance;
}

/**
 * Robustly extract card array from AI response text.
 * Handles: {"cards":[...]}, bare arrays [{...},...], single card {type:...},
 * and text with JSON embedded after a preamble.
 */
function tryExtractCards(parsed) {
  if (parsed.cards && Array.isArray(parsed.cards)) return parsed.cards;
  if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) return parsed;
  if (parsed.type) return [parsed];
  return null;
}

function parseCardsFromText(text) {
  // 1. Try direct parse
  try {
    const result = tryExtractCards(JSON.parse(text));
    if (result) return result;
  } catch { }

  // 2. Find JSON by matching first open brace/bracket to last matching close
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  const jsonStart = (firstBrace >= 0 && (firstBracket < 0 || firstBrace < firstBracket))
    ? firstBrace : firstBracket;

  if (jsonStart >= 0) {
    const openChar = text[jsonStart];
    const closeChar = openChar === '{' ? '}' : ']';
    const lastClose = text.lastIndexOf(closeChar);

    // Try first-to-last matching brace (handles trailing text)
    if (lastClose > jsonStart) {
      try {
        const result = tryExtractCards(JSON.parse(text.slice(jsonStart, lastClose + 1)));
        if (result) return result;
      } catch { }
    }

    // Fallback: from jsonStart to end
    if (jsonStart > 0) {
      try {
        const result = tryExtractCards(JSON.parse(text.slice(jsonStart)));
        if (result) return result;
      } catch { }
    }
  }

  // 3. Repair: comma-separated objects without array wrapper — wrap in []
  if (text.includes('"type"')) {
    try {
      const result = tryExtractCards(JSON.parse(`[${text}]`));
      if (result) return result;
    } catch { }

    // 4. Repair: missing closing } on last card before ]}
    // Model sometimes drops the closing brace of the last card object
    if (text.endsWith(']}')) {
      for (let extra = 1; extra <= 2; extra++) {
        try {
          const repaired = text.slice(0, -2) + '}'.repeat(extra) + ']}';
          const result = tryExtractCards(JSON.parse(repaired));
          if (result) return result;
        } catch { }
      }
    }
  }

  // 5. Fallback: wrap raw text as agent-text bubble with default quick-replies
  return [
    { type: 'agent-text', props: { text } },
    { type: 'quick-replies', props: { chips: [
      { label: 'What can you help with?', input: 'What can you help me with?' },
      { label: 'Show me my idle cash', input: 'What is my idle cash?' },
    ] } },
  ];
}

/**
 * Call OpenAI via Vercel AI SDK and parse response into cards.
 */
export async function callAI(userMessage, conversationHistory, state, mode = 'surface') {
  let openai;
  try {
    openai = getOpenAI();
  } catch (e) {
    return { cards: [{ type: 'agent-text', props: { text: 'AI chat is unavailable in demo mode.' } }] };
  }

  const historySlice = mode === 'rm-chat' ? -12 : -10;
  const messages = [
    ...conversationHistory.slice(historySlice),
    { role: 'user', content: userMessage },
  ];

  const temperature = mode === 'rm-chat' ? 0.75 : 0.7;
  const maxTokens = mode === 'rm-chat' ? 3000 : 5000;
  const productContext = state?.surfaceResponse?.context?.product || state?.rmChat?.entryContext?.product || null;
  const logCtx = { mode, userMessage, historyLength: messages.length, productContext, lifecycle: state?.lifecycle, state };

  try {
    const startTime = Date.now();
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: buildSystemPrompt(state, mode),
      messages,
      temperature,
      maxTokens,
      responseFormat: { type: 'json' },
    });

    // Parse response — strip markdown fences (case-insensitive) and trim
    const cleaned = text.replace(/```[\w]*\s*/gi, '').trim();

    const cards = parseCardsFromText(cleaned);
    logAICall({ ...logCtx, cards, durationMs: Date.now() - startTime, error: null, retried: false });
    return { cards };
  } catch (error) {
    if (error.message?.includes('VITE_OPENAI_API_KEY') || error.message?.includes('Set VITE_OPENAI_API_KEY')) {
      return { cards: [{ type: 'agent-text', props: { text: 'AI chat is unavailable in demo mode. Set VITE_OPENAI_API_KEY to enable it.' } }] };
    }

    // Retry once on rate limit or server error
    const status = error.status || error.statusCode;
    if (status === 429 || (status >= 500 && status < 600)) {
      await new Promise(r => setTimeout(r, 2000));
      try {
        const retryStart = Date.now();
        const { text } = await generateText({
          model: openai('gpt-4o'),
          system: buildSystemPrompt(state, mode),
          messages,
          temperature,
          maxTokens,
          responseFormat: { type: 'json' },
        });
        const cleaned = text.replace(/```[\w]*\s*/gi, '').trim();
        const cards = parseCardsFromText(cleaned);
        logAICall({ ...logCtx, cards, durationMs: Date.now() - retryStart, error: null, retried: true });
        return { cards };
      } catch (retryError) {
        logAICall({ ...logCtx, cards: null, durationMs: null, error: retryError.message || 'Retry failed', retried: true });
        throw new Error('I\'m getting a lot of requests right now. Try again in a moment.');
      }
    }

    logAICall({ ...logCtx, cards: null, durationMs: null, error: error.message || 'Unknown error', retried: false });
    throw new Error('Something went wrong. Please try again.');
  }
}
