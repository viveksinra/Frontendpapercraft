'use client';

import Link from 'next/link';
import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Button } from '@/components/ui/button';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState('');

  const testAccounts = [
    { label: 'Owner', name: 'Navin Pathak', email: 'navin@chelmsford11plus.com', role: 'owner' },
    { label: 'Admin', name: 'Vivek Kumar', email: 'vivek@chelmsford11plus.com', role: 'admin' },
    { label: 'Sr. Teacher', name: 'Sarah Williams', email: 'sarah@chelmsford11plus.com', role: 'senior_teacher' },
    { label: 'Teacher', name: 'James Anderson', email: 'james@chelmsford11plus.com', role: 'teacher' },
    { label: 'Reviewer', name: 'Priya Sharma', email: 'priya@chelmsford11plus.com', role: 'content_reviewer' },
  ];

  const TEST_PASSWORD = 'Test@1234';

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const fillTestAccount = (account) => {
    setValue('email', account.email, { shouldValidate: true });
    setValue('password', TEST_PASSWORD, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();
      router.push(paths.dashboard.root);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  return (
    <>
      <FormHead
        title="Sign in to your account"
        description={
          <>
            {`Don't have an account? `}
            <Link href={paths.auth.jwt.signUp} className="font-semibold text-foreground hover:underline">
              Get started
            </Link>
          </>
        }
      />

      {!!errorMessage && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <div className="flex flex-col gap-5">
          <Field.Text name="email" label="Email address" placeholder="your@email.com" />

          <div className="flex flex-col gap-1.5">
            <Link
              href="#"
              className="self-end text-sm text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <div className="relative">
                <Field.Text
                  name="password"
                  placeholder="6+ characters"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </Form>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 rounded-lg border border-dashed border-muted-foreground/30 p-4">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Test Accounts (Password: {TEST_PASSWORD})
          </p>
          <div className="flex flex-wrap gap-2">
            {testAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => fillTestAccount(account)}
                className="flex-1 min-w-[calc(50%-0.25rem)] rounded-md border border-border bg-muted/50 px-3 py-2 text-left text-xs transition-colors hover:bg-muted hover:border-foreground/30"
              >
                <span className="font-semibold">{account.label}</span>
                <br />
                <span className="text-muted-foreground">{account.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
