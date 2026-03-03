import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { reducer, initialState } from './reducer';
import { loadState, useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const stored = loadState();
    return stored || init;
  });

  // Auto-persist state changes to localStorage
  useLocalStorage(state);

  const showToast = useCallback((message, duration = 2500) => {
    dispatch({ type: 'SHOW_TOAST', payload: message });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), duration);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
