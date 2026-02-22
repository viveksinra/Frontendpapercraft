'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  User,
  ShoppingBag,
  Receipt,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, type SidebarItem } from '@/components/layouts/Sidebar';
import { MobileBottomNav, type MobileNavItem } from '@/components/layouts/MobileBottomNav';
import { Header } from '@/components/layouts/Header';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
  { label: 'Children', href: '/children', icon: Users },
  { label: 'Store', href: '/store', icon: ShoppingBag },
  { label: 'My Purchases', href: '/purchases', icon: Receipt },
  { label: 'Profile', href: '/profile', icon: User },
];

const mobileNavItems: MobileNavItem[] = [
  { label: 'Home', href: '/parent/dashboard', icon: LayoutDashboard },
  { label: 'Children', href: '/children', icon: Users },
  { label: 'Store', href: '/store', icon: ShoppingBag },
  { label: 'Profile', href: '/profile', icon: User },
];

export function ParentLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const userName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Parent';

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar
        items={sidebarItems}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile sidebar drawer */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="px-4 pt-4">
            <SheetTitle>PaperCraft</SheetTitle>
          </SheetHeader>
          <nav className="mt-4 flex flex-col gap-1 px-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSheetOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          userName={userName}
          userRole="parent"
          onMenuToggle={() => setMobileSheetOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 pb-20 md:pb-6">
            {children}
          </div>
        </main>

        {/* Mobile bottom navigation */}
        <MobileBottomNav items={mobileNavItems} />
      </div>
    </div>
  );
}
