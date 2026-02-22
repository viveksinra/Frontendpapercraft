'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Users, BookOpen } from 'lucide-react';
import { staggerContainer, staggerItem, scaleIn, fadeInUp } from '@/lib/animations';

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
    <motion.div
      className="flex flex-col gap-4 w-full"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItem}>
        <Card variant="glass">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-mid))]"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
            >
              <BookOpen className="h-6 w-6 text-white" />
            </motion.div>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="space-y-2" variants={staggerItem}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </motion.div>
                <motion.div className="space-y-2" variants={staggerItem}>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </motion.div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign In
              </Button>
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/sign-up"
                  className="text-primary font-medium underline-offset-4 hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="border-dashed">
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Login — Test Accounts</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 grid grid-cols-2 gap-3">
            {TEST_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              const isActive = email === account.email;
              return (
                <motion.button
                  key={account.role}
                  type="button"
                  onClick={() => fillCredentials(account)}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all cursor-pointer ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-border hover:bg-accent hover:border-accent-foreground/20'
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isActive ? 'bg-primary/15' : 'bg-muted'}`}>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{account.name}</span>
                  <span className="text-[11px] text-muted-foreground leading-tight">{account.description}</span>
                  <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {account.label}
                  </span>
                </motion.button>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
