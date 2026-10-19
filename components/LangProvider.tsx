'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useState } from 'react';
import { DICT, LANG_COOKIE, type Dict, type Lang } from '@/lib/i18n';

const LangContext = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void } | null>(null);

// Holds the language for client components. The layout passes the one it read
// from the cookie; switching writes the cookie and refreshes, so server
// components re-render in the new language too.
export function LangProvider({ initial, children }: { initial: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState(initial);
  const router = useRouter();

  const setLang = useCallback(
    (next: Lang) => {
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = next;
      setLangState(next);
      router.refresh();
    },
    [router],
  );

  return <LangContext.Provider value={{ lang, t: DICT[lang], setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
