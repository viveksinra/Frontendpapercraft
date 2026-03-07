'use client';

import { X, LogOut } from 'lucide-react';
import { useEffect, useCallback } from 'react';

import { useRouter, usePathname } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

import { useAuthContext } from 'src/auth/hooks';
import { signOut } from 'src/auth/context/jwt/action';

import { NavSectionVertical } from '../components/nav-section-vertical';

export function NavMobile({ data, open, onClose, checkPermissions }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, checkUserSession } = useAuthContext();

  // Close on navigation
  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, router]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 pt-5 pb-2">
            <Logo />
            <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <Scrollbar fillContent className="flex-1">
            <NavSectionVertical data={data} checkPermissions={checkPermissions} />
          </Scrollbar>

          {/* User info */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
