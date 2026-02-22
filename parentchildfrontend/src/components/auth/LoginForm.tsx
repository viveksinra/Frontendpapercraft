'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2, GraduationCap, Users } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  variant: 'student' | 'parent';
}

function getDashboardPath(role?: string) {
  if (role === 'parent') return '/parent/dashboard';
  return '/student/dashboard';
}

export function LoginForm({ variant }: LoginFormProps) {
  const { login, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isStudent = variant === 'student';
  const Icon = isStudent ? GraduationCap : Users;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Signed in successfully!');
      router.push(getDashboardPath(variant));
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200 disabled:opacity-50";

  return (
    <GlassCard className="p-8 animate-scale-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg shadow-primary/25 shine-effect">
            <Icon className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              {isStudent ? 'Student' : 'Parent'} Sign In
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isStudent
                ? 'Sign in to access your tests and results'
                : 'Sign in to monitor your child\'s progress'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={loading}
              className={inputClass}
            />
            {errors.email && (
              <p className="text-sm text-destructive animate-fade-in-up">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              disabled={loading}
              className={inputClass}
            />
            {errors.password && (
              <p className="text-sm text-destructive animate-fade-in-up">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-10 rounded-xl font-medium" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Sign in
          </Button>
        </form>

        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
          <p>
            Don&apos;t have an account?{' '}
            <Link
              href={isStudent ? '/auth/student/signup' : '/auth/parent/signup'}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign Up
            </Link>
          </p>
          {isStudent && (
            <p>
              Are you a parent?{' '}
              <Link href="/auth/parent/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Register as Parent
              </Link>
            </p>
          )}
          {!isStudent && (
            <p>
              Are you a student?{' '}
              <Link href="/auth/student/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Register as Student
              </Link>
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
