'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientOrb, GridPattern, FloatingShapes } from '@/components/ui/background-elements';
import {
  FileText,
  TrendingUp,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Star,
  Pencil,
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp, scaleIn } from '@/lib/animations';

const features = [
  {
    icon: FileText,
    title: 'Smart Practice Tests',
    description:
      'Access a wide range of 11+ practice tests covering English, Maths, Verbal Reasoning, and Non-Verbal Reasoning.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Analytics',
    description:
      'Get detailed results and performance charts immediately after completing each test, with question-by-question breakdowns.',
  },
  {
    icon: Users,
    title: 'Parent Dashboard',
    description:
      'Parents can link to their child\'s account, view results, track performance, and receive smart alerts.',
  },
];

// Scroll-triggered section wrapper
function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-60px' });

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(245,82%,55%)] via-[hsl(280,70%,50%)] to-[hsl(173,80%,40%)] animate-gradient-shift opacity-[0.06]" />

        {/* Background elements */}
        <GridPattern className="text-primary opacity-30" />
        <GradientOrb
          size={500}
          color="from-primary/15 to-purple-400/10"
          className="top-[-15%] right-[-10%]"
          delay={0.2}
        />
        <GradientOrb
          size={400}
          color="from-accent/10 to-primary/5"
          className="bottom-[-10%] left-[-10%]"
          delay={0.5}
        />

        {/* Floating illustration elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute text-primary/10"
            style={{ left: '8%', top: '25%' }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BookOpen className="h-12 w-12" />
          </motion.div>
          <motion.div
            className="absolute text-accent/10"
            style={{ right: '12%', top: '20%' }}
            animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Pencil className="h-10 w-10" />
          </motion.div>
          <motion.div
            className="absolute text-primary/10"
            style={{ right: '20%', bottom: '25%' }}
            animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <Star className="h-8 w-8" />
          </motion.div>
          <motion.div
            className="absolute text-accent/10"
            style={{ left: '15%', bottom: '30%' }}
            animate={{ y: [0, 18, 0], rotate: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            <Sparkles className="h-10 w-10" />
          </motion.div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GraduationCap className="h-4 w-4 text-primary" />
            Trusted by schools and tutors
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Empower Your Child&apos;s{' '}
            <span className="gradient-text">Learning Journey</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Practice with realistic tests, get instant results, and track your progress.
            Everything you need to succeed in your 11+ entrance exams, all in one place.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button asChild variant="gradient" size="lg" className="w-full sm:w-auto px-8">
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 bg-card/80 backdrop-blur-sm">
              <Link href="/auth/sign-in">
                Sign In
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="px-4 py-20 sm:py-28" ref={featuresRef}>
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to{' '}
                <span className="gradient-text">Succeed</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                PaperCraft provides a complete 11+ preparation platform for students and parents.
              </p>
            </div>
          </ScrollReveal>

          <motion.div
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.2 },
              },
            }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
                    <CardHeader>
                      <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <ScrollReveal>
        <footer className="border-t px-4 py-10">
          <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-mid))]">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">PaperCraft</span>
            </div>
            <p>&copy; {new Date().getFullYear()} PaperCraft. All rights reserved.</p>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  );
}
