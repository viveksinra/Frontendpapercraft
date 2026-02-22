'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Users, UserPlus, LogOut, Menu, Bug, BarChart3, Search, UserSearch, ClipboardList, GraduationCap, TrendingUp, CreditCard, Sparkles, PlayCircle } from 'lucide-react';
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
  return (
    <div className="flex h-full flex-col text-sidebar-foreground">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-sidebar-accent-foreground">PaperCraft</h1>
            <p className="text-[11px] text-sidebar-muted leading-none">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto px-3 pt-5 pb-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-sidebar-muted">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary/15 text-white shadow-sm'
                        : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <Icon className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-sidebar-muted group-hover:text-sidebar-accent-foreground'
                    )} />
                    {item.label}
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar footer - version */}
      <div className="mx-4 h-px bg-sidebar-border" />
      <div className="px-5 py-4">
        <p className="text-[10px] text-sidebar-muted">v1.0.0</p>
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
        <aside className="hidden w-[260px] shrink-0 border-r border-sidebar-border bg-sidebar md:block">
          <div className="sticky top-0 h-screen overflow-hidden">
            <SidebarNav pathname={pathname} />
          </div>
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Mobile header */}
          <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-xl px-4 md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0 bg-sidebar border-sidebar-border">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <SidebarNav pathname={pathname} onNavigate={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold">PaperCraft</span>
            </div>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>

          {/* Desktop navbar */}
          <div className="hidden md:block">
            <Navbar />
          </div>

          <main className="flex-1 overflow-auto bg-muted/40 p-5 lg:p-8">
            <div className="mx-auto max-w-7xl animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SuperAdminGuard>
  );
}
