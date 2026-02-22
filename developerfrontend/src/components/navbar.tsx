'use client';

import { LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '??';

  const greeting = user?.firstName ? `Welcome back, ${user.firstName}` : 'Welcome back';

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      {/* Left: greeting */}
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">
          {greeting}
        </p>
      </div>

      {/* Right: theme toggle + user menu */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="h-6 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-2 ring-primary/20">
                {initials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-tight">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] leading-tight text-muted-foreground">
                  {user?.role === 'super_admin' ? 'Super Admin' : user?.role || 'Admin'}
                </p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 sm:hidden">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
