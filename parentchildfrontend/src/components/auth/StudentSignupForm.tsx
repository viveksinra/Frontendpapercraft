'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, GraduationCap } from 'lucide-react';
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

  // Show student code after successful registration
  if (studentCode) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <GraduationCap className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Registration Complete!</CardTitle>
          <CardDescription>
            Your student account has been created. Save your student code below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <StudentCodeDisplay code={studentCode} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/student/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Student Sign Up</CardTitle>
        <CardDescription>Create your student account to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Organization Code - at top */}
          <div className="space-y-2">
            <Label htmlFor="orgCode">Organization Code</Label>
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

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register('name')}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
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
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register('password')}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Year Group */}
          <div className="space-y-2">
            <Label htmlFor="yearGroup">Year Group</Label>
            <Controller
              name="yearGroup"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your year group" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_GROUPS.map((yg) => (
                      <SelectItem key={yg.value} value={yg.value}>
                        {yg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.yearGroup && (
              <p className="text-sm text-red-500">{errors.yearGroup.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Student Account
          </Button>
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <p>
              Already have an account?{' '}
              <Link href="/auth/student/login" className="text-primary underline-offset-4 hover:underline">
                Sign In
              </Link>
            </p>
            <p>
              Are you a parent?{' '}
              <Link href="/auth/parent/signup" className="text-primary underline-offset-4 hover:underline">
                Register as Parent
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
