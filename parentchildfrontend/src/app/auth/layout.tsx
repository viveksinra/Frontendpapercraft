'use client';

import { motion } from 'framer-motion';
import { GradientOrb, GridPattern, FloatingShapes } from '@/components/ui/background-elements';
import { ClipboardCheck, TrendingUp, Users } from 'lucide-react';

const features = [
  {
    icon: ClipboardCheck,
    title: 'Practice Tests',
    description: 'Targeted exam preparation',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Real-time performance analytics',
  },
  {
    icon: Users,
    title: 'Learn Together',
    description: 'Parent-child collaboration',
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel — hidden on mobile, 60% on lg */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-gradient-to-br from-[hsl(245,82%,55%)] via-[hsl(280,70%,50%)] to-[hsl(173,80%,40%)]">
        {/* Grid pattern overlay */}
        <GridPattern className="text-white" />

        {/* Gradient orbs */}
        <GradientOrb
          size={400}
          color="from-white/10 to-purple-300/10"
          className="top-[-10%] left-[-5%]"
          delay={0.3}
        />
        <GradientOrb
          size={300}
          color="from-teal-300/10 to-white/5"
          className="bottom-[-5%] right-[-5%]"
          delay={0.6}
        />

        {/* Floating shapes */}
        <FloatingShapes />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight">
              PaperCraft
            </h1>
            <p className="mt-3 text-lg text-white/70 max-w-md">
              Empower your child&apos;s learning journey with smart practice tests and real-time analytics
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="mt-12 space-y-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.5 },
              },
            }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="flex items-center gap-4"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{feature.title}</p>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Right Panel — full on mobile, 40% on lg */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-8 lg:py-0 overflow-y-auto">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
