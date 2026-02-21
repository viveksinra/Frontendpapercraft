'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Users, UserPlus, LogOut, Menu, LayoutDashboard, Bug, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SuperAdminGuard } from '@/components/super-admin-guard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard/organizations', label: 'Organizations', icon: Building2 },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/onboarding', label: 'Onboarding', icon: UserPlus },
  { href: '/dashboard/test-debugging', label: 'Test Debug', icon: Bug },
  { href: '/dashboard/test-stats', label: 'Test Stats', icon: BarChart3 },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" />
          <h1 className="text-lg font-bold">PaperCraft Internal</h1>
        </div>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Separator />
      <div className="p-4">
        <div className="mb-2 px-3">
          <p className="truncate text-sm font-medium">{user?.firstName} {user?.lastName}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
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
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <SuperAdminGuard>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
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
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <SidebarContent pathname={pathname} onNavigate={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold">PaperCraft Internal</h1>
          </header>

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SuperAdminGuard>
  );
}
