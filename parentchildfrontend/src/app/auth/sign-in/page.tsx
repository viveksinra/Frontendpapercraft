'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2, User, Users, BookOpen } from 'lucide-react';

const TEST_ACCOUNTS = [
  {
    label: 'Parent',
    name: 'Emma Johnson',
    email: 'emma@chelmsford11plus.com',
    password: 'Test@1234',
    role: 'parent',
    icon: Users,
    description: 'Monitor child progress & view paper sets',
  },
  {
    label: 'Student',
    name: 'Oliver Brown',
    email: 'oliver@chelmsford11plus.com',
    password: 'Test@1234',
    role: 'student',
    icon: User,
    description: 'Take practice papers & view results',
  },
];

function getDashboardPath(role?: string) {
  if (role === 'parent') return '/parent/dashboard';
  return '/student/dashboard';
}

export default function SignInPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success('Signed in successfully!');
      router.push(getDashboardPath(loggedInUser?.role));
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (account: typeof TEST_ACCOUNTS[number]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-8 animate-scale-in">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg shadow-primary/25 shine-effect">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">Welcome back</h1>
              <p className="text-sm text-muted-foreground mt-1">Sign in to PaperCraft</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200 disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200 disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-10 rounded-xl font-medium"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign in
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </GlassCard>

      {/* Test accounts */}
      <GlassCard className="p-4 animate-fade-in-up stagger-2">
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Login — Test Accounts</p>
          <div className="grid grid-cols-2 gap-3">
            {TEST_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              const isActive = email === account.email;
              return (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => fillCredentials(account)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'border-primary/30 bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border/50 hover:border-primary/20 hover:bg-primary/5 hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-gradient-to-br from-primary to-accent' : 'bg-muted'}`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                  </div>
                  <span className="text-sm font-medium">{account.name}</span>
                  <span className="text-[11px] text-muted-foreground leading-tight">{account.description}</span>
                  <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {account.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
