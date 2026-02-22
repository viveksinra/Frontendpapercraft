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

const modes = [
  { key: 'light', label: 'Light', Icon: Sun, color: 'text-amber-500' },
  { key: 'dark', label: 'Dark', Icon: Moon, color: 'text-indigo-400' },
  { key: 'system', label: 'System', Icon: Monitor, color: 'text-muted-foreground' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = modes.find((m) => m.key === theme) ?? modes[2];
  const CurrentIcon = mounted
    ? current.Icon
    : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <CurrentIcon
            className={`h-[18px] w-[18px] ${mounted ? current.color : 'text-muted-foreground/40'}`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {modes.map(({ key, label, Icon, color }) => {
          const isActive = theme === key;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => setTheme(key)}
            >
              <Icon className={`mr-2 h-4 w-4 ${color}`} />
              {label}
              {isActive && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
