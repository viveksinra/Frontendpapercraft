'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';

const TEST_ACCOUNTS = [
  {
    label: 'Developer',
    name: 'Vivek Kumar',
    email: 'vivek@chelmsford11plus.com',
    password: 'Test@1234',
    icon: Shield,
    description: 'Developer — full access, platform admin',
  },
];

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
    <div className="flex flex-col gap-4 w-full">
      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">PaperCraft Internal</CardTitle>
          <CardDescription>Sign in to the super-admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@papercraft.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Login — Test Accounts</span>
            <span className="text-[10px] text-muted-foreground">(password: Test@1234)</span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 grid grid-cols-2 gap-2">
          {TEST_ACCOUNTS.map((account) => {
            const Icon = account.icon;
            const isActive = email === account.email;
            return (
              <button
                key={account.email}
                type="button"
                onClick={() => fillCredentials(account)}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all hover:bg-accent hover:border-accent-foreground/20 cursor-pointer ${isActive ? 'border-primary bg-primary/5 shadow-sm' : 'border-border'}`}
              >
                <div className="flex-shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium truncate">{account.name}</span>
                    <span className="flex-shrink-0 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                      {account.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{account.description}</p>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
