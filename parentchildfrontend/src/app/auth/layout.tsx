'use client';

import { BookOpen, GraduationCap, Star, PenLine } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
      {/* Aurora background */}
      <div className="absolute inset-0 aurora-bg opacity-30 dark:opacity-20" />

      {/* Floating decorative orbs */}
      <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-primary/10 blur-3xl float-animation" />
      <div className="absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full bg-accent/10 blur-3xl float-animation stagger-3" />
      <div className="absolute top-[60%] left-[60%] w-32 h-32 rounded-full bg-primary/5 blur-2xl float-animation stagger-5" />

      {/* Floating icons */}
      <div className="absolute top-[18%] right-[18%] float-animation stagger-2 hidden sm:block">
        <div className="w-10 h-10 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/10 flex items-center justify-center rotate-12">
          <GraduationCap className="w-5 h-5 text-primary/40" />
        </div>
      </div>
      <div className="absolute bottom-[25%] left-[15%] float-animation stagger-4 hidden sm:block">
        <div className="w-10 h-10 rounded-xl bg-accent/10 backdrop-blur-sm border border-accent/10 flex items-center justify-center -rotate-12">
          <BookOpen className="w-5 h-5 text-accent/40" />
        </div>
      </div>
      <div className="absolute top-[40%] left-[8%] float-animation stagger-6 hidden sm:block">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/10 flex items-center justify-center rotate-6">
          <Star className="w-4 h-4 text-yellow-500/40" />
        </div>
      </div>
      <div className="absolute bottom-[35%] right-[8%] float-animation stagger-1 hidden sm:block">
        <div className="w-8 h-8 rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/10 flex items-center justify-center -rotate-6">
          <PenLine className="w-4 h-4 text-primary/40" />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm relative z-10">
        {children}
      </div>
    </div>
  );
}
