'use client';

import { createContext, useContext } from 'react';

export type TickerItem = { title: string; href: string };

const FALLBACK: TickerItem[] = [
  { title: 'Latest news from NTT Desk', href: '/' },
];

const TickerContext = createContext<TickerItem[]>(FALLBACK);

export function TickerProvider({
  items,
  children,
}: {
  items: TickerItem[];
  children: React.ReactNode;
}) {
  return (
    <TickerContext.Provider value={items.length > 0 ? items : FALLBACK}>
      {children}
    </TickerContext.Provider>
  );
}

export function useTickerItems() {
  return useContext(TickerContext);
}
