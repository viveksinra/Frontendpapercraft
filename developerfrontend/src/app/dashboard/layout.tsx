'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2, Users, UserPlus, Menu, Bug, BarChart3, Search, UserSearch,
  ClipboardList, GraduationCap, TrendingUp, CreditCard, Sparkles, PlayCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SuperAdminGuard } from '@/components/super-admin-guard';
import { Navbar } from '@/components/navbar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Management',
    items: [
      { href: '/dashboard/organizations', label: 'Organizations', icon: Building2 },
      { href: '/dashboard/users', label: 'Users', icon: Users },
      { href: '/dashboard/onboarding', label: 'Onboarding', icon: UserPlus },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { href: '/dashboard/test-stats', label: 'Test Stats', icon: BarChart3 },
      { href: '/dashboard/registration-stats', label: 'Registration Stats', icon: ClipboardList },
      { href: '/dashboard/class-stats', label: 'Class Stats', icon: GraduationCap },
      { href: '/dashboard/revenue', label: 'Platform Revenue', icon: TrendingUp },
      { href: '/dashboard/courses', label: 'Courses', icon: PlayCircle },
      { href: '/dashboard/stripe-accounts', label: 'Stripe Accounts', icon: CreditCard },
    ],
  },
  {
    label: 'Debugging',
    items: [
      { href: '/dashboard/test-debugging', label: 'Test Debug', icon: Bug },
      { href: '/dashboard/user-lookup', label: 'User Lookup', icon: Search },
      { href: '/dashboard/student-debug', label: 'Student Debug', icon: UserSearch },
    ],
  },
];

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '??';

  return (
    <div className="flex h-full flex-col">
      {/* Logo lockup */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="leading-none">
            <p className="text-[14px] font-bold tracking-tight text-sidebar-accent-foreground">
              PaperCraft
            </p>
            <p className="text-[10px] font-medium text-sidebar-muted mt-0.5">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="mx-3 h-px bg-sidebar-border/60" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 pt-4 pb-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-sidebar-muted/60">
              {group.label}
            </p>
            <div className="space-y-px">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'group relative flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium transition-all duration-150',
                      isActive
                        ? 'text-sidebar-accent-foreground bg-sidebar-accent'
                        : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-0.5'
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r-full bg-primary shadow-sm shadow-primary/50" />
                    )}
                    <Icon className={cn(
                      'h-[15px] w-[15px] shrink-0 transition-colors duration-150',
                      isActive ? 'text-primary' : 'text-sidebar-muted/70 group-hover:text-sidebar-foreground'
                    )} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mx-3 h-px bg-sidebar-border/60" />
      <div className="p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary text-[10px] font-bold text-white">
            {initials}
            <div className="absolute -bottom-px -right-px h-2 w-2 rounded-full border-[1.5px] border-sidebar bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-sidebar-foreground">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <SuperAdminGuard>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-[240px] shrink-0 border-r border-sidebar-border/50 bg-sidebar md:block">
          <div className="sticky top-0 h-screen overflow-hidden">
            <SidebarNav pathname={pathname} />
          </div>
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Mobile header */}
          <header className="flex h-[52px] items-center gap-3 border-b border-border/50 bg-background/70 backdrop-blur-xl px-4 md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-4.5 w-4.5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0 bg-sidebar border-sidebar-border/50">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <SidebarNav pathname={pathname} onNavigate={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight">PaperCraft</span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle />
            </div>
          </header>

          {/* Desktop navbar */}
          <div className="hidden md:block">
            <Navbar />
          </div>

          {/* Content */}
          <main className="flex-1 overflow-auto bg-muted/30 p-4 lg:p-6">
            <div className="mx-auto max-w-7xl animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SuperAdminGuard>
  );
}
