import { createClient } from '@supabase/supabase-js';

let supabase = null;

function getClient() {
  if (!supabase) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    supabase = createClient(url, key);
  }
  return supabase;
}

export function logAICall({ mode, userMessage, historyLength, productContext, lifecycle, cards, durationMs, error, retried, state }) {
  try {
    const client = getClient();
    if (!client) return;

    const payload = {
      mode,
      user_message: userMessage,
      history_length: historyLength,
      product_context: productContext || null,
      lifecycle: lifecycle || null,
      response_cards: cards || null,
      card_types: cards?.map(c => c.type) || [],
      card_count: cards?.length || 0,
      duration_ms: durationMs,
      error: error || null,
      retried,
    };
    console.log('[logger] inserting:', payload);
    client.from('ai_logs').insert(payload).then(({ error: e }) => {
      if (e) console.error('[logger] insert failed:', e);
      else console.log('[logger] insert success');
    });
  } catch (e) {
    console.error('[logger] exception:', e);
  }
}
