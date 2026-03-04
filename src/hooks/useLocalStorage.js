import { useEffect } from 'react';

const STORAGE_KEY = 'neev-app-state';

export function saveState(state) {
  try {
    // Don't persist ephemeral state
    const { toast, surfaceResponse, activeFlow, ...rest } = state;
    // Persist rmChat thread but not ephemeral keys
    const persistable = {
      ...rest,
      rmChat: state.rmChat ? {
        thread: state.rmChat.thread,
        lastOpenedAt: state.rmChat.lastOpenedAt,
      } : undefined,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    // Ignore quota errors
  }
}

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        surfaceResponse: { active: false, previousTab: null, hiddenThread: [], currentCards: [], quickReplies: [], turnCount: 0, context: null, loading: false, error: null },
        activeFlow: null,
        rmChat: {
          open: false, loading: false, error: null, entryContext: null,
          thread: parsed.rmChat?.thread || [],
          lastOpenedAt: parsed.rmChat?.lastOpenedAt || null,
        },
        toast: { message: '', visible: false },
      };
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Hook to auto-persist state changes to localStorage.
 */
export function useLocalStorage(state) {
  useEffect(() => {
    saveState(state);
  }, [state]);
}
