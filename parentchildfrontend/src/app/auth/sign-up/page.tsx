'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2, GraduationCap, Users, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200 disabled:opacity-50";

  return (
    <GlassCard className="p-8 animate-scale-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg shadow-primary/25 shine-effect">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign up to get started with PaperCraft</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: 'student' as const, icon: GraduationCap, label: 'Student' },
                { role: 'parent' as const, icon: Users, label: 'Parent' },
              ].map(({ role, icon: Icon, label }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => updateField('role', role)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-300',
                    form.role === role
                      ? 'border-primary/40 bg-primary/5 text-primary shadow-lg shadow-primary/10'
                      : 'border-border/50 hover:border-primary/20 hover:bg-primary/5'
                  )}
                  disabled={loading}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    form.role === role
                      ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25"
                      : "bg-muted"
                  )}>
                    <Icon className={cn("h-5 w-5", form.role === role ? "text-primary-foreground" : "text-primary")} />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
              <input id="firstName" placeholder="John" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} disabled={loading} required className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
              <input id="lastName" placeholder="Doe" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} disabled={loading} required className={inputClass} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} disabled={loading} required className={inputClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <input id="password" type="password" placeholder="Create a password" value={form.password} onChange={(e) => updateField('password', e.target.value)} disabled={loading} required className={inputClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="organizationCode" className="text-sm font-medium text-foreground">Organization Code</label>
            <input id="organizationCode" placeholder="Enter your institute code" value={form.organizationCode} onChange={(e) => updateField('organizationCode', e.target.value)} disabled={loading} required className={inputClass} />
          </div>

          {form.role === 'parent' && (
            <div className="space-y-2 animate-fade-in-up">
              <label htmlFor="studentCode" className="text-sm font-medium text-foreground">Student Code</label>
              <input id="studentCode" placeholder="Enter your child's student code" value={form.studentCode} onChange={(e) => updateField('studentCode', e.target.value)} disabled={loading} required className={inputClass} />
            </div>
          )}

          <Button type="submit" className="w-full h-10 rounded-xl font-medium" disabled={loading || !form.role}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </GlassCard>
  );
}
