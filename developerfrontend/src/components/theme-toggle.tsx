'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const modes = [
  { key: 'light', label: 'Light', Icon: Sun },
  { key: 'dark', label: 'Dark', Icon: Moon },
  { key: 'system', label: 'System', Icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex h-9 items-center gap-0.5 rounded-lg bg-muted/60 p-1">
        {modes.map(({ key, Icon }) => (
          <div
            key={key}
            className="flex h-7 w-8 items-center justify-center rounded-md"
          >
            <Icon className="h-3.5 w-3.5 text-muted-foreground/40" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex h-9 items-center gap-0.5 rounded-lg bg-muted/60 p-1">
      {modes.map(({ key, Icon, label }) => {
        const isActive = theme === key;
        const iconColor =
          key === 'light'
            ? 'text-amber-500'
            : key === 'dark'
              ? 'text-indigo-400'
              : 'text-muted-foreground';

        return (
          <button
            key={key}
            type="button"
            onClick={() => setTheme(key)}
            aria-label={`Switch to ${label} mode`}
            className={cn(
              'relative z-10 flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all duration-200',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon
              className={cn(
                'h-3.5 w-3.5 transition-colors duration-200',
                isActive ? iconColor : 'text-current'
              )}
            />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
