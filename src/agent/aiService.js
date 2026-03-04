import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { buildSystemPrompt } from './systemPrompt';

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

function tryExtractCards(str) {
  try {
    const parsed = JSON.parse(str);
    if (parsed.cards && Array.isArray(parsed.cards)) return parsed.cards;
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) return parsed;
    if (parsed.type) return [parsed];
  } catch {}
  return null;
}

/**
 * Robustly extract card array from AI response text.
 * Handles: {"cards":[...]}, bare arrays [{...},...], single card {type:...},
 * comma-separated objects {..},{..}, and objects with stray leading/trailing brackets.
 */
function parseCardsFromText(text) {
  // 1. Try direct parse
  const direct = tryExtractCards(text);
  if (direct) return direct;

  // 2. Slice from first [ or { (handles preamble text before JSON)
  const jsonStart = text.search(/[\[{]/);
  if (jsonStart < 0) return [{ type: 'agent-text', props: { text } }];

  const slice = text.slice(jsonStart);

  // 2a. Try slice as-is
  const asIs = tryExtractCards(slice);
  if (asIs) return asIs;

  // 2b. Normalise: strip one leading [ and/or one trailing ] then re-wrap.
  // Handles patterns like: {..},{..}  |  {..},{..}]  |  [{..},{..}]  (AI omits outer wrapper)
  let inner = slice;
  if (inner.startsWith('[')) inner = inner.slice(1);
  if (inner.endsWith(']')) inner = inner.slice(0, -1);

  const rewrapped = tryExtractCards(`[${inner}]`);
  if (rewrapped) return rewrapped;

  // 3. Fallback: render raw text as a bubble so the user sees something
  return [{ type: 'agent-text', props: { text } }];
}

/**
 * Call OpenAI via Vercel AI SDK and parse response into cards.
 */
export async function callAI(userMessage, conversationHistory, state) {
  let openai;
  try {
    openai = getOpenAI();
  } catch (e) {
    return { cards: [{ type: 'agent-text', props: { text: 'AI chat is unavailable in demo mode.' } }] };
  }

  const messages = [
    ...conversationHistory.slice(-8),
    { role: 'user', content: userMessage },
  ];

  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: buildSystemPrompt(state),
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Parse response — strip markdown fences (case-insensitive) and trim
    const cleaned = text.replace(/```(?:json|javascript)?\n?/gi, '').trim();

    const cards = parseCardsFromText(cleaned);
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
        const { text } = await generateText({
          model: openai('gpt-4o'),
          system: buildSystemPrompt(state),
          messages,
          temperature: 0.7,
          maxTokens: 2000,
        });
        const cleaned = text.replace(/```(?:json|javascript)?\n?/gi, '').trim();
        return { cards: parseCardsFromText(cleaned) };
      } catch {
        throw new Error('I\'m getting a lot of requests right now. Try again in a moment.');
      }
    }

    throw new Error('Something went wrong. Please try again.');
  }
}
