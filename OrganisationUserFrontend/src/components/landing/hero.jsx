'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  BookOpen,
  Monitor,
  BarChart3,
  Play,
  Zap,
  TrendingUp,
  Users,
  GraduationCap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

const platformFeatures = [
  { icon: '📝', label: 'Question Bank', color: 'from-blue-500 to-blue-600' },
  { icon: '📄', label: 'Paper Builder', color: 'from-purple-500 to-purple-600' },
  { icon: '💻', label: 'Online Tests', color: 'from-emerald-500 to-emerald-600' },
  { icon: '📊', label: 'Analytics', color: 'from-amber-500 to-amber-600' },
  { icon: '📚', label: 'Courses', color: 'from-pink-500 to-pink-600' },
];

const floatingElements = [
  { icon: '📝', x: '10%', y: '20%', delay: 0, duration: 4 },
  { icon: '📊', x: '85%', y: '15%', delay: 1, duration: 5 },
  { icon: '🎯', x: '5%', y: '70%', delay: 2, duration: 4.5 },
  { icon: '⭐', x: '90%', y: '65%', delay: 0.5, duration: 3.5 },
  { icon: '🏆', x: '15%', y: '45%', delay: 1.5, duration: 4 },
  { icon: '📄', x: '80%', y: '40%', delay: 2.5, duration: 5 },
];

const stats = [
  { value: '10K+', label: 'Questions Created', icon: BookOpen },
  { value: '5K+', label: 'Papers Generated', icon: FileText },
  { value: '98%', label: 'Satisfaction Rate', icon: TrendingUp },
];

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % platformFeatures.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const target = 2847;
    const steps = 60;
    const step = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      if (current < steps) {
        setQuestionCount(Math.round(step * current));
        current++;
      } else {
        clearInterval(interval);
      }
    }, 33);
    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.55 0.25 270 / 0.3), transparent),
              radial-gradient(ellipse 60% 40% at 80% 50%, oklch(0.6 0.2 300 / 0.2), transparent),
              radial-gradient(ellipse 50% 30% at 20% 80%, oklch(0.55 0.25 270 / 0.15), transparent)
            `,
          }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.145 0.02 270) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.145 0.02 270) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {floatingElements.map((el, i) => (
        <div
          key={i}
          className={`absolute text-3xl sm:text-4xl transition-all duration-1000 pointer-events-none ${
            mounted ? 'opacity-60' : 'opacity-0'
          }`}
          style={{
            left: el.x,
            top: el.y,
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            animation: mounted ? `float ${el.duration}s ease-in-out ${el.delay}s infinite` : 'none',
          }}
        >
          {el.icon}
        </div>
      ))}

      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, oklch(0.55 0.25 270 / 0.15), transparent 70%)',
          transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, oklch(0.6 0.2 300 / 0.15), transparent 70%)',
          transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <div
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 mb-6 sm:mb-8 transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {platformFeatures.map((feat, index) => (
                    <div
                      key={feat.label}
                      className={`transition-all duration-500 ${
                        index === activeFeatureIndex
                          ? 'scale-125 opacity-100'
                          : index < activeFeatureIndex
                            ? 'scale-90 opacity-50'
                            : 'scale-90 opacity-30'
                      }`}
                    >
                      <span className="text-lg">{feat.icon}</span>
                    </div>
                  ))}
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="text-xs sm:text-sm text-foreground font-medium">
                  {platformFeatures[activeFeatureIndex].label}
                </span>
              </div>

              <h1
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight transition-all duration-700 delay-100 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Build & Deliver{' '}
                <span className="relative">
                  <span className="text-gradient">Assessments</span>
                  <Sparkles className="absolute -top-2 -right-6 sm:-right-8 w-5 h-5 sm:w-6 sm:h-6 text-accent animate-pulse" />
                </span>{' '}
                <br className="hidden sm:block" />
                That Matter
              </h1>

              <p
                className={`text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 text-pretty leading-relaxed transition-all duration-700 delay-200 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Create question banks, auto-generate exam papers, deliver online tests, and track student performance — all from one powerful platform.
              </p>

              <div
                className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-10 transition-all duration-700 delay-300 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-xl shadow-primary/25 group relative overflow-hidden"
                  asChild
                >
                  <Link href="/auth/jwt/sign-up">
                    <span className="relative z-10 flex items-center">
                      <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Start Free Trial
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14 rounded-2xl border-2 hover:bg-secondary/80 transition-all group bg-background/50 backdrop-blur-sm"
                  asChild
                >
                  <Link href="#how-it-works">
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    See How It Works
                  </Link>
                </Button>
              </div>

              <div
                className={`flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-muted-foreground transition-all duration-700 delay-400 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {['No credit card required', 'Free 14-day trial', 'Cancel anytime'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`relative transition-all duration-1000 delay-500 ${
                mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div
                className="absolute -inset-4 hidden sm:block bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-[2rem] blur-3xl opacity-40"
                style={{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}
              />

              <GlassCard className="relative p-6 sm:p-8 rounded-3xl overflow-hidden border-2 border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />

                <div className="relative flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center ring-2 ring-primary/20 flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Assessment Dashboard</p>
                      <p className="font-semibold text-sm sm:text-lg text-foreground truncate">Paper Generator</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                      <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                        {questionCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative h-40 sm:h-48 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-amber-500/5 overflow-hidden border border-border/50 mb-6">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160" fill="none" preserveAspectRatio="none">
                    <path
                      d="M40 140 Q100 140 100 100 Q100 60 200 60 Q300 60 300 100 Q300 140 360 140"
                      stroke="url(#heroPathGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000"
                      style={{ strokeDasharray: 400, strokeDashoffset: mounted ? 0 : 400 }}
                    />
                    <defs>
                      <linearGradient id="heroPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {[
                    { left: '10%', top: '85%', color: 'from-blue-500 to-blue-600', icon: '📝', complete: true },
                    { left: '25%', top: '60%', color: 'from-purple-500 to-purple-600', icon: '📄', complete: true },
                    { left: '50%', top: '35%', color: 'from-indigo-500 to-indigo-600', icon: '💻', active: true },
                    { left: '75%', top: '60%', color: 'from-emerald-500 to-emerald-600', icon: '📊' },
                    { left: '90%', top: '85%', color: 'from-amber-500 to-amber-600', icon: '🏆' },
                  ].map((node, index) => (
                    <div
                      key={index}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                        node.active ? 'animate-bounce z-10' : ''
                      }`}
                      style={{ left: node.left, top: node.top, transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="relative">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg ${
                            node.complete ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-background' : ''
                          } ${node.active ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''}`}
                        >
                          <span className="text-xl sm:text-2xl">{node.icon}</span>
                        </div>
                        {node.complete && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {node.active && (
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground whitespace-nowrap">
                            In Progress
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {platformFeatures.map((feat, index) => (
                    <div
                      key={feat.label}
                      className={`text-center p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                        index <= 1
                          ? 'bg-gradient-to-br from-secondary/80 to-secondary/40 ring-1 ring-primary/20'
                          : 'bg-secondary/20 opacity-50'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{feat.icon}</span>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-medium">{feat.label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="absolute -left-4 sm:-left-12 top-1/4 transform -translate-y-1/2 hidden lg:block">
                <div className="bg-background/90 backdrop-blur-xl rounded-xl p-3 shadow-xl border border-border/50 float-animation">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pass Rate</p>
                      <p className="font-bold text-foreground">+15%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 sm:-right-12 bottom-1/4 transform translate-y-1/2 hidden lg:block">
                <div className="bg-background/90 backdrop-blur-xl rounded-xl p-3 shadow-xl border border-border/50 float-animation" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Students</p>
                      <p className="font-bold text-foreground">12K+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto transition-all duration-700 delay-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50 animate-bounce" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
