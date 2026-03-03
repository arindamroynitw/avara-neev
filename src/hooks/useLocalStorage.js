import { useEffect } from 'react';

const STORAGE_KEY = 'neev-app-state';

export function saveState(state) {
  try {
    // Don't persist conversation (ephemeral) or toast
    const { conversation, toast, ...persistable } = state;
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
        conversation: { open: false, thread: [], loading: false, error: null },
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
