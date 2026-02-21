'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { LogOut, User, LayoutDashboard, Home } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { signOut } from 'src/auth/context/jwt/action';

export function AccountDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, router]);

  const isDashboard = pathname.includes('/dashboard');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-primary/20 transition-all hover:ring-primary/40 focus:outline-none">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={isDashboard ? '/' : paths.dashboard.root}>
            {isDashboard ? <Home className="mr-2 h-4 w-4" /> : <LayoutDashboard className="mr-2 h-4 w-4" />}
            {isDashboard ? 'Home' : 'Dashboard'}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="#">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
