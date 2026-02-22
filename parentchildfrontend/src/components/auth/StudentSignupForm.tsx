'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, GraduationCap, PartyPopper } from 'lucide-react';
import { OrgCodeInput } from './OrgCodeInput';
import { StudentCodeDisplay } from './StudentCodeDisplay';

const studentSignupSchema = z.object({
  orgCode: z
    .string()
    .min(3, 'Organization code must be at least 3 characters')
    .max(10, 'Organization code must be at most 10 characters')
    .regex(/^[A-Z0-9]+$/, 'Organization code must be uppercase letters or numbers'),
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  yearGroup: z.string().min(1, 'Please select a year group'),
});

type StudentSignupValues = z.infer<typeof studentSignupSchema>;

const YEAR_GROUPS = [
  { value: 'year4', label: 'Year 4' },
  { value: 'year5', label: 'Year 5' },
  { value: 'year6', label: 'Year 6' },
];

export function StudentSignupForm() {
  const { registerStudent } = useAuth();
  const [loading, setLoading] = useState(false);
  const [studentCode, setStudentCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<StudentSignupValues>({
    resolver: zodResolver(studentSignupSchema as any),
    defaultValues: {
      orgCode: '',
      name: '',
      email: '',
      password: '',
      yearGroup: '',
    },
  });

  const orgCodeValue = watch('orgCode');

  const onSubmit = async (data: StudentSignupValues) => {
    setLoading(true);
    try {
      const result = await registerStudent(data.email, data.password, data.name, data.orgCode);
      setStudentCode(result.studentCode);
      toast.success('Account created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200 disabled:opacity-50";

  // Show student code after successful registration
  if (studentCode) {
    return (
      <GlassCard className="p-8 animate-scale-in">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-green-500/25 animate-scale-in">
              <PartyPopper className="w-7 h-7 text-white" />
            </div>
            <div className="animate-fade-in-up stagger-1">
              <h1 className="text-2xl font-bold text-gradient">Registration Complete!</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your student account has been created. Save your student code below.
              </p>
            </div>
          </div>
          <div className="animate-fade-in-up stagger-2">
            <StudentCodeDisplay code={studentCode} />
          </div>
          <div className="flex justify-center animate-fade-in-up stagger-3">
            <Button className="rounded-xl font-medium" asChild>
              <Link href="/student/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8 animate-scale-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg shadow-primary/25 shine-effect">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">Student Sign Up</h1>
            <p className="text-sm text-muted-foreground mt-1">Create your student account to get started</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Organization Code */}
          <div className="space-y-2">
            <label htmlFor="orgCode" className="text-sm font-medium text-foreground">Organization Code</label>
            <Controller
              name="orgCode"
              control={control}
              render={({ field }) => (
                <OrgCodeInput
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.orgCode?.message}
                  disabled={loading}
                />
              )}
            />
          </div>

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

          <div className="space-y-2">
            <label htmlFor="yearGroup" className="text-sm font-medium text-foreground">Year Group</label>
            <Controller
              name="yearGroup"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select your year group" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_GROUPS.map((yg) => (
                      <SelectItem key={yg.value} value={yg.value}>{yg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.yearGroup && <p className="text-sm text-destructive animate-fade-in-up">{errors.yearGroup.message}</p>}
          </div>

          <Button type="submit" className="w-full h-10 rounded-xl font-medium" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Create Student Account
          </Button>
        </form>

        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
          <p>
            Already have an account?{' '}
            <Link href="/auth/student/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign In</Link>
          </p>
          <p>
            Are you a parent?{' '}
            <Link href="/auth/parent/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">Register as Parent</Link>
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
