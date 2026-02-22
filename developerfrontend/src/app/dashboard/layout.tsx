'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Users, UserPlus, LogOut, Menu, LayoutDashboard, Bug, BarChart3, Search, UserSearch, ClipboardList, GraduationCap, TrendingUp, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SuperAdminGuard } from '@/components/super-admin-guard';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '??';

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">PaperCraft</h1>
            <p className="text-[10px] text-muted-foreground">Internal Dashboard</p>
          </div>
        </div>
      </div>
      <Separator className="bg-sidebar-border" />

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
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
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'border-l-2 border-primary bg-primary/8 text-foreground'
                        : 'border-l-2 border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User section */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-3 rounded-md bg-sidebar-accent/50 px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => {
              logout();
              onNavigate?.();
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
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
        <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
          <SidebarContent pathname={pathname} />
        </aside>

        {/* Mobile header + sheet */}
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-sidebar">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <SidebarContent pathname={pathname} onNavigate={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold">PaperCraft Internal</h1>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-muted/30 p-6 lg:p-8">
            <div className="mx-auto max-w-7xl animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SuperAdminGuard>
  );
}
