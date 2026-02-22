'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    // @ts-expect-error -- next-themes ThemeProvider types don't match React 19's stricter JSX types
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
