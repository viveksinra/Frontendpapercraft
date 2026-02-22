'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, GraduationCap, Users } from 'lucide-react';
import { staggerContainer, staggerItem, scaleIn } from '@/lib/animations';

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

  return (
    <motion.div
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
              <Icon className="h-6 w-6 text-white" />
            </motion.div>
            <CardTitle className="text-2xl">
              {isStudent ? 'Student' : 'Parent'} Sign In
            </CardTitle>
            <CardDescription>
              {isStudent
                ? 'Sign in to access your tests and results'
                : 'Sign in to monitor your child\'s progress'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Email */}
                <motion.div className="space-y-2" variants={staggerItem}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </motion.div>

                {/* Password */}
                <motion.div className="space-y-2" variants={staggerItem}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                    disabled={loading}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </motion.div>
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <motion.div className="w-full" variants={staggerItem}>
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-1 text-sm text-muted-foreground"
                variants={staggerItem}
              >
                <p>
                  Don&apos;t have an account?{' '}
                  <Link
                    href={isStudent ? '/auth/student/signup' : '/auth/parent/signup'}
                    className="text-primary font-medium underline-offset-4 hover:underline transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
                {isStudent && (
                  <p>
                    Are you a parent?{' '}
                    <Link
                      href="/auth/parent/signup"
                      className="text-primary font-medium underline-offset-4 hover:underline transition-colors"
                    >
                      Register as Parent
                    </Link>
                  </p>
                )}
                {!isStudent && (
                  <p>
                    Are you a student?{' '}
                    <Link
                      href="/auth/student/signup"
                      className="text-primary font-medium underline-offset-4 hover:underline transition-colors"
                    >
                      Register as Student
                    </Link>
                  </p>
                )}
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
