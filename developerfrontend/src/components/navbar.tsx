'use client';

import { usePathname } from 'next/navigation';
import { LogOut, ChevronDown, Search as SearchIcon, Command } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const pageNames: Record<string, string> = {
  '/dashboard/organizations': 'Organizations',
  '/dashboard/users': 'Users',
  '/dashboard/onboarding': 'Onboarding',
  '/dashboard/test-stats': 'Test Stats',
  '/dashboard/registration-stats': 'Registration Stats',
  '/dashboard/class-stats': 'Class Stats',
  '/dashboard/revenue': 'Platform Revenue',
  '/dashboard/courses': 'Courses',
  '/dashboard/stripe-accounts': 'Stripe Accounts',
  '/dashboard/test-debugging': 'Test Debug',
  '/dashboard/user-lookup': 'User Lookup',
  '/dashboard/student-debug': 'Student Debug',
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageNames[pathname]) return pageNames[pathname];
  // Prefix match for sub-routes like /dashboard/organizations/[orgId]
  const match = Object.entries(pageNames).find(([path]) => pathname.startsWith(path));
  return match ? match[1] : 'Dashboard';
}

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '??';

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-[52px] shrink-0 items-center border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        {/* Left: Page context */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground/50 font-medium">Dashboard</span>
            <span className="text-muted-foreground/30">/</span>
            <span className="font-semibold text-foreground truncate">{pageTitle}</span>
          </div>
        </div>

        {/* Right: Search hint + Theme + User */}
        <div className="flex items-center gap-1.5">
          {/* Command palette hint */}
          <button
            type="button"
            className="hidden lg:flex items-center gap-2 h-8 rounded-lg border border-border/60 bg-muted/40 px-2.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground hover:border-border cursor-pointer"
          >
            <SearchIcon className="h-3.5 w-3.5" />
            <span className="text-xs">Search...</span>
            <div className="flex items-center gap-0.5 ml-4">
              <kbd className="inline-flex h-5 items-center rounded border border-border/60 bg-background px-1.5 text-[10px] font-medium text-muted-foreground/60">
                <Command className="h-2.5 w-2.5 mr-0.5" />K
              </kbd>
            </div>
          </button>

          <div className="hidden lg:block h-4 w-px bg-border/50 mx-1.5" />

          {/* Theme toggle */}
          <ThemeToggle />

          <div className="h-4 w-px bg-border/50 mx-0.5" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 transition-all hover:bg-accent group"
              >
                <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-[11px] font-bold text-primary-foreground shadow-sm shadow-primary/20">
                  {initials}
                  {/* Online dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[13px] font-medium leading-none text-foreground">
                    {user?.firstName}
                  </p>
                </div>
                <ChevronDown className="hidden lg:block h-3 w-3 text-muted-foreground/50 transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1">
              {/* User info header */}
              <div className="px-2 py-2">
                <p className="text-sm font-semibold text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator className="mx-1" />
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">
                    {user?.role === 'super_admin' ? 'Super Admin' : user?.role || 'Admin'}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator className="mx-1" />
              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
