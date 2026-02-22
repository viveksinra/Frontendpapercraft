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
import { Loader2, Users } from 'lucide-react';

const parentSignupSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

type ParentSignupValues = z.infer<typeof parentSignupSchema>;

export function ParentSignupForm() {
  const { registerParent } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentSignupValues>({
    resolver: zodResolver(parentSignupSchema as any),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: ParentSignupValues) => {
    setLoading(true);
    try {
      await registerParent(data.email, data.password, data.name);
      toast.success('Account created successfully!');
      router.push('/parent/link-child');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account.');
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto shadow-lg shadow-accent/25 shine-effect">
            <Users className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">Parent Sign Up</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create your parent account to monitor your child&apos;s progress
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
            <input id="name" placeholder="Enter your full name" {...register('name')} disabled={loading} className={inputClass} />
            {errors.name && <p className="text-sm text-destructive animate-fade-in-up">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input id="email" type="email" placeholder="you@example.com" {...register('email')} disabled={loading} className={inputClass} />
            {errors.email && <p className="text-sm text-destructive animate-fade-in-up">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <input id="password" type="password" placeholder="Create a password" {...register('password')} disabled={loading} className={inputClass} />
            {errors.password && <p className="text-sm text-destructive animate-fade-in-up">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-10 rounded-xl font-medium" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Create Parent Account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/parent/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </GlassCard>
  );
}
