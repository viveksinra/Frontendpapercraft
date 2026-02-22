'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, GraduationCap, Users, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem, scaleIn } from '@/lib/animations';

export default function SignUpPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organizationCode: '',
    role: '' as 'student' | 'parent' | '',
    studentCode: '',
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.organizationCode || !form.role) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (form.role === 'parent' && !form.studentCode) {
      toast.error('Please enter the student code to link your account.');
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        organizationCode: form.organizationCode,
        role: form.role as 'student' | 'parent',
        ...(form.role === 'parent' && form.studentCode ? { studentCode: form.studentCode } : {}),
      });
      toast.success('Account created successfully!');
      router.push(form.role === 'parent' ? '/parent/dashboard' : '/student/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account.');
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
              <BookOpen className="h-6 w-6 text-white" />
            </motion.div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Sign up to get started with PaperCraft</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Role Selector */}
                <motion.div className="space-y-2" variants={staggerItem}>
                  <Label>I am a...</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { role: 'student' as const, icon: GraduationCap, label: 'Student' },
                      { role: 'parent' as const, icon: Users, label: 'Parent' },
                    ].map(({ role, icon: Icon, label }) => (
                      <motion.button
                        key={role}
                        type="button"
                        onClick={() => updateField('role', role)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all',
                          form.role === role
                            ? 'border-primary bg-primary/5 text-primary shadow-md shadow-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                        disabled={loading}
                      >
                        <motion.div
                          animate={form.role === role ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="h-6 w-6" />
                        </motion.div>
                        <span className="text-sm font-medium">{label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Name fields */}
                <motion.div className="grid grid-cols-2 gap-4" variants={staggerItem}>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div className="space-y-2" variants={staggerItem}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    disabled={loading}
                    required
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={staggerItem}>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    disabled={loading}
                    required
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={staggerItem}>
                  <Label htmlFor="organizationCode">Organization Code</Label>
                  <Input
                    id="organizationCode"
                    placeholder="Enter your institute code"
                    value={form.organizationCode}
                    onChange={(e) => updateField('organizationCode', e.target.value)}
                    disabled={loading}
                    required
                  />
                </motion.div>

                <AnimatePresence>
                  {form.role === 'parent' && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Label htmlFor="studentCode">Student Code</Label>
                      <Input
                        id="studentCode"
                        placeholder="Enter your child's student code"
                        value={form.studentCode}
                        onChange={(e) => updateField('studentCode', e.target.value)}
                        disabled={loading}
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={loading || !form.role}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/sign-in" className="text-primary font-medium underline-offset-4 hover:underline transition-colors">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
