import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  TrendingUp,
  Users,
  GraduationCap,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Practice Tests',
    description:
      'Access a wide range of 11+ practice tests covering English, Maths, Verbal Reasoning, and Non-Verbal Reasoning.',
  },
  {
    icon: ClipboardCheck,
    title: 'Instant Results',
    description:
      'Get detailed results and feedback immediately after completing each test, with question-by-question breakdowns.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description:
      'Monitor improvement over time with performance charts, subject breakdowns, and personalised insights.',
  },
  {
    icon: Users,
    title: 'Parent Dashboard',
    description:
      'Parents can link to their child\'s account, view results, track performance, and receive alerts.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Create an Account',
    description: 'Sign up as a student or parent in just a few clicks.',
  },
  {
    number: '2',
    title: 'Take Practice Tests',
    description:
      'Students access timed tests set by their school or tutor, in exam-like conditions.',
  },
  {
    number: '3',
    title: 'Review Results',
    description:
      'See scores, grades, and detailed question reviews immediately after completion.',
  },
  {
    number: '4',
    title: 'Track Progress',
    description:
      'Monitor improvement over time and identify areas that need more practice.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center sm:py-28 lg:py-36">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            Trusted by schools and tutors
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Prepare for Your{' '}
            <span className="text-primary">11+ Exams</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Practice with realistic tests, get instant results, and track your progress.
            Everything you need to succeed in your 11+ entrance exams, all in one place.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/auth/student/signup">
                <GraduationCap className="mr-2 h-5 w-5" />
                I&apos;m a Student
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/auth/parent/signup">
                <Users className="mr-2 h-5 w-5" />
                I&apos;m a Parent
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/sign-in"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <Separator />

      {/* Features section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              PaperCraft provides a complete 11+ preparation platform for students
              and parents.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* How it works section */}
      <section className="bg-muted/30 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Getting started with PaperCraft is simple.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Footer */}
      <footer className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold">PaperCraft</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The smarter way to prepare for 11+ entrance exams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">For Students</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/student/signup" className="hover:text-foreground">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-in" className="hover:text-foreground">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">For Parents</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/parent/signup" className="hover:text-foreground">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-in" className="hover:text-foreground">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Support</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/sign-in" className="hover:text-foreground">
                    Help Centre
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-in" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
            <p>&copy; {new Date().getFullYear()} PaperCraft. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
