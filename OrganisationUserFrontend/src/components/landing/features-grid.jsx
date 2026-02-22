'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, BookOpen, FileText, Monitor, BarChart3, GraduationCap, ShoppingBag, Star, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

const features = [
  {
    icon: BookOpen,
    title: 'Question Bank',
    description:
      'Build a rich library of questions organised by subject, topic, difficulty, and tags. Import in bulk or create with AI assistance.',
    gradient: 'from-blue-500 to-blue-600',
    badge: 'Core',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    stats: { label: 'Question Types', value: '15+' },
    highlight: true,
  },
  {
    icon: FileText,
    title: 'Smart Paper Generator',
    description:
      'Auto-generate balanced exam papers with AI. Set blueprints for difficulty, topics, and marks — papers are built in seconds.',
    gradient: 'from-purple-500 to-purple-600',
    badge: 'AI Powered',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    stats: { label: 'Templates', value: '50+' },
    highlight: false,
  },
  {
    icon: Monitor,
    title: 'Online Testing',
    description:
      'Deliver secure, timed online assessments. Auto-grading, anti-cheating controls, and instant results for objective questions.',
    gradient: 'from-emerald-500 to-emerald-600',
    stats: { label: 'Tests Delivered', value: '8K+' },
    highlight: false,
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description:
      'Deep insights into student performance, question difficulty analysis, topic-wise breakdowns, and exportable reports.',
    gradient: 'from-amber-500 to-amber-600',
    badge: 'New',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    stats: { label: 'Metrics', value: '25+' },
    highlight: false,
  },
];

export function FeaturesGrid() {
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
    <section id="features" ref={sectionRef} className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`text-center mb-12 sm:mb-20 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-sm font-medium text-muted-foreground mb-6">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Everything You Need to{' '}
            <span className="text-gradient">Excel</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Purpose-built tools for creating, delivering, and analysing assessments at scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={feature.title}
                className={`relative transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {(feature.highlight || isHovered) && (
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-20 transition-opacity duration-500 ${
                      isHovered ? 'opacity-40' : 'opacity-20'
                    }`}
                  />
                )}

                <GlassCard
                  className={cn(
                    'relative h-full p-6 sm:p-8 rounded-2xl transition-all duration-300 group',
                    feature.highlight
                      ? 'border-2 border-primary/30 bg-card shadow-xl shadow-primary/5'
                      : 'hover:border-primary/20 hover:shadow-lg'
                  )}
                >
                  {feature.badge && (
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${feature.badgeColor}`}>
                      {feature.badge}
                    </div>
                  )}

                  <div className="relative mb-6">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] transition-transform duration-300 group-hover:scale-110`}
                    >
                      <div className="w-full h-full rounded-2xl bg-background/80 flex items-center justify-center">
                        <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                        {feature.stats.value}
                      </span>
                      <span className="text-sm text-muted-foreground">{feature.stats.label}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm font-medium group/btn hover:bg-transparent hover:text-primary p-0"
                      asChild
                    >
                      <Link href="/auth/jwt/sign-up">
                        Explore
                        <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>

                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ${
                        isHovered ? 'translate-x-[100%]' : 'translate-x-[-100%]'
                      }`}
                    />
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        <div
          className={`text-center mt-12 sm:mt-16 transition-all duration-700 delay-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button
            size="lg"
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25 group"
            asChild
          >
            <Link href="/auth/jwt/sign-up">
              Start Exploring All Features
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
