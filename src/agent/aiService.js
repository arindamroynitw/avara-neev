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

/**
 * Robustly extract card array from AI response text.
 * Handles: {"cards":[...]}, bare arrays [{...},...], single card {type:...},
 * and text with JSON embedded after a preamble.
 */
function parseCardsFromText(text) {
  // 1. Try direct parse
  try {
    const parsed = JSON.parse(text);
    if (parsed.cards && Array.isArray(parsed.cards)) return parsed.cards;
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) return parsed;
    if (parsed.type) return [parsed];
  } catch {
    // Not valid JSON as-is — try to extract JSON from the text
  }

  // 2. Try to find a JSON object or array in the text (handles preamble/suffix)
  const jsonStart = text.search(/[\[{]/);
  if (jsonStart > 0) {
    try {
      const extracted = JSON.parse(text.slice(jsonStart));
      if (extracted.cards && Array.isArray(extracted.cards)) return extracted.cards;
      if (Array.isArray(extracted) && extracted.length > 0 && extracted[0].type) return extracted;
      if (extracted.type) return [extracted];
    } catch {
      // Still not valid
    }
  }

  // 3. Fallback: wrap raw text as agent-text bubble
  return [{ type: 'agent-text', props: { text } }];
}

/**
 * Call OpenAI via Vercel AI SDK and parse response into cards.
 */
export async function callAI(userMessage, conversationHistory, state) {
  const openai = getOpenAI();

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
    if (error.message?.includes('VITE_OPENAI_API_KEY')) {
      throw error;
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
