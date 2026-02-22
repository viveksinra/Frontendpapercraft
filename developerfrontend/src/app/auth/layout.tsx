'use client';

import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/3" />
      <div className="absolute top-[-30%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/3 blur-3xl" />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {children}
      </div>
    </div>
  );
}
