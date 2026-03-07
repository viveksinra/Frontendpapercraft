'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { X, Zap, Sun, Menu, Moon, Sparkles, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-accent py-2 text-center text-sm text-primary-foreground transition-transform duration-300',
          scrolled ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <Link href="/auth/jwt/sign-up" className="inline-flex items-center gap-2 hover:underline">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Build better assessments with AI-powered paper generation</span>
          <span className="sm:hidden">AI-Powered Assessments</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <header
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'top-0' : 'top-8 sm:top-8',
          scrolled
            ? 'bg-background/80 backdrop-blur-2xl border-b border-border shadow-lg shadow-black/5'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="h-16 sm:h-18 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-primary/25">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
              </div>
              <span className="font-bold text-lg sm:text-xl text-foreground tracking-tight">
                Paper<span className="text-gradient-static">Craft</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-xl hover:bg-secondary/80"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}

              <Button variant="ghost" size="sm" className="hidden sm:inline-flex rounded-xl font-medium" asChild>
                <Link href="/auth/jwt/sign-in">Log in</Link>
              </Button>

              <Button
                size="sm"
                className="hidden sm:inline-flex rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/25 font-medium group"
                asChild
              >
                <Link href="/auth/jwt/sign-up">
                  <Zap className="w-4 h-4 mr-1.5 group-hover:rotate-12 transition-transform" />
                  Get Started Free
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          'fixed inset-x-0 z-40 lg:hidden transition-all duration-300 ease-out',
          scrolled ? 'top-16' : 'top-24',
          mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <div className="mx-4 p-4 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border shadow-2xl">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors flex items-center justify-between"
              >
                {item.label}
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link
              href="/auth/jwt/sign-in"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
            >
              Log in
            </Link>
            <Button className="mt-2 rounded-xl bg-gradient-to-r from-primary to-accent h-12 font-medium" asChild>
              <Link href="/auth/jwt/sign-up" onClick={() => setMobileOpen(false)}>
                <Zap className="w-4 h-4 mr-2" />
                Get Started Free
              </Link>
            </Button>
          </nav>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
