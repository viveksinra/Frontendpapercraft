'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title?: string;
  userName: string;
  userRole: string;
  onMenuToggle: () => void;
  extras?: ReactNode;
}

export function Header({ title, userName, userRole, onMenuToggle, extras }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const profilePath = userRole === 'student' ? '/student/profile' : '/parent/profile';
  const settingsPath = userRole === 'student' ? '/student/settings' : '/parent/settings';

  const handleLogout = () => {
    logout();
    router.push('/auth/sign-in');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="hidden text-lg font-bold tracking-tight md:hidden">
            PaperCraft
          </Link>

          {title && (
            <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {extras}

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {userName}
                <p className="text-xs font-normal text-muted-foreground capitalize">
                  {userRole}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={profilePath}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={settingsPath}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
