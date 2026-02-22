'use client';

import { useEffect, useRef, useState } from 'react';
import { BookOpen, FileText, Monitor, BarChart3, ArrowRight } from 'lucide-react';

import { GlassCard } from '@/components/ui/glass-card';

const steps = [
  {
    number: 1,
    icon: BookOpen,
    title: 'Create Questions',
    description: 'Build your question bank with rich text, images, and multiple question types. Import from Excel or create with AI.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    details: ['Multiple choice, short answer, essay', 'Rich text editor with images', 'Bulk import from spreadsheets', 'AI-powered question generation'],
  },
  {
    number: 2,
    icon: FileText,
    title: 'Generate Papers',
    description: 'Auto-generate balanced exam papers using blueprints. Set difficulty, topic coverage, and marks distribution.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    details: ['AI-powered paper generation', 'Custom blueprints & templates', 'Difficulty balancing', 'Print-ready PDF export'],
  },
  {
    number: 3,
    icon: Monitor,
    title: 'Deliver Tests',
    description: 'Deliver assessments online with timed sessions, secure access, and auto-grading for objective questions.',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    details: ['Timed online assessments', 'Secure test environment', 'Auto-grading & manual marking', 'Instant result publication'],
  },
  {
    number: 4,
    icon: BarChart3,
    title: 'Analyse Results',
    description: 'Get deep insights into student performance, question effectiveness, and topic mastery across your organisation.',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    details: ['Student performance tracking', 'Question difficulty analysis', 'Topic-wise breakdowns', 'Exportable reports & charts'],
  },
];

export function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`text-center mb-12 sm:mb-20 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-muted-foreground mb-4">
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            From Questions to <span className="text-gradient">Insights</span> in 4 Steps
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            A streamlined workflow that takes you from question creation to comprehensive analytics
          </p>
        </div>

        <div
          className={`overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex gap-4 sm:gap-6 min-w-max sm:min-w-0 sm:grid sm:grid-cols-4 sm:gap-4">
            {steps.map((step, stepIndex) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative transition-all duration-700"
                  style={{ transitionDelay: `${(stepIndex + 1) * 150}ms` }}
                >
                  {stepIndex < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-border via-primary/30 to-border z-0" />
                  )}

                  <GlassCard
                    hover
                    className={`relative w-64 sm:w-full p-4 sm:p-6 ${step.borderColor} transition-all duration-500 ${
                      visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                    style={{ transitionDelay: `${(stepIndex + 1) * 150}ms` }}
                  >
                    <div className="text-center mb-4">
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg mb-3`}
                      >
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">{step.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>

                    <div className="space-y-2">
                      {step.details.map((detail, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-2 rounded-lg ${step.bgColor}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${step.color} flex-shrink-0`} />
                          <span className="text-sm text-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>

                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
