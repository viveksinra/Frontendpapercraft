'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield, Sparkles } from 'lucide-react';

const IS_DEV = process.env.NODE_ENV === 'development';

const TEST_ACCOUNTS = IS_DEV
  ? [
      {
        label: 'Developer',
        name: 'Vivek Kumar',
        email: 'vivek@chelmsford11plus.com',
        password: 'Test@1234',
        icon: Shield,
        description: 'Developer — full access, platform admin',
      },
    ]
  : [];

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Signed in successfully.');
      router.push('/dashboard/organizations');
    } catch (err: any) {
      toast.error(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (account: typeof TEST_ACCOUNTS[number]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Brand header */}
      <div className="text-center space-y-3 mb-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PaperCraft</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Admin Console</p>
        </div>
      </div>

      {/* Sign-in card */}
      <Card className="shadow-xl shadow-black/5 border-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px]">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@papercraft.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                className="h-10"
              />
            </div>
            <Button type="submit" className="w-full h-10 font-semibold shadow-md shadow-primary/25" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick login — development only */}
      {TEST_ACCOUNTS.length > 0 && (
        <Card className="border-dashed bg-card/50 backdrop-blur-sm">
          <div className="px-4 pt-3.5 pb-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Login — Test Accounts
            </p>
          </div>
          <CardContent className="px-4 pb-4 pt-2">
            {TEST_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              const isActive = email === account.email;
              return (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillCredentials(account)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                      : 'border-border hover:bg-accent hover:border-accent-foreground/20'
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-primary/15' : 'bg-muted'}`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{account.name}</span>
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        {account.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{account.description}</p>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
