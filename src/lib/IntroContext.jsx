import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const IntroContext = createContext({ introVisible: false, hideIntro: () => {} });

const INTRO_KEY = 'chsai_intro_seen';

/**
 * Tracks whether the full-screen neural-net intro splash is currently
 * showing. While it is, the global navbar is hidden so the intro stays
 * clean and full-screen (it only plays once per session).
 */
export function IntroProvider({ children }) {
  const [introVisible, setIntroVisible] = useState(() => {
    try {
      const seen = sessionStorage.getItem(INTRO_KEY) === '1';
      const p = window.location.pathname.toLowerCase();
      const onHome = p === '/' || p === '/home';
      return !seen && onHome;
    } catch {
      return false;
    }
  });

  const hideIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      // ignore
    }
    setIntroVisible(false);
  }, []);

  const value = useMemo(() => ({ introVisible, hideIntro }), [introVisible, hideIntro]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
