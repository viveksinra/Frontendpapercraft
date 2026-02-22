'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const modes = [
  { key: 'light', label: 'Light', Icon: Sun, iconClass: 'text-amber-500' },
  { key: 'dark', label: 'Dark', Icon: Moon, iconClass: 'text-indigo-400' },
  { key: 'system', label: 'System', Icon: Monitor, iconClass: 'text-muted-foreground' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = modes.find((m) => m.key === theme) ?? modes[2];
  const CurrentIcon = mounted ? current.Icon : Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
        >
          <CurrentIcon
            className={cn(
              'h-4 w-4 transition-all duration-300',
              mounted ? current.iconClass : 'text-muted-foreground/40'
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 p-1">
        <div className="px-2 py-1.5 mb-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Theme
          </p>
        </div>
        {modes.map(({ key, label, Icon, iconClass }) => {
          const isActive = theme === key;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => setTheme(key)}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] cursor-pointer transition-colors',
                isActive && 'bg-accent'
              )}
            >
              <div className={cn(
                'flex h-5 w-5 items-center justify-center rounded-md transition-colors',
                isActive ? 'bg-primary/10' : 'bg-transparent'
              )}>
                <Icon className={cn('h-3.5 w-3.5', isActive ? iconClass : 'text-muted-foreground')} />
              </div>
              <span className={cn(isActive ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                {label}
              </span>
              {isActive && (
                <Check className="ml-auto h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
