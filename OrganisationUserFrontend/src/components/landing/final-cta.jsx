'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Clock, Users, FileText, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';

const liveStats = [
  { icon: Users, value: '500+', label: 'schools & centres' },
  { icon: FileText, value: '1M+', label: 'assessments delivered' },
  { icon: Sparkles, value: '4.9', label: 'average rating' },
];

export function FinalCTA() {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-[2rem] blur-xl opacity-30 animate-pulse" />

            <div className="relative rounded-3xl border-2 border-primary/30 bg-card/90 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-primary/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/90 text-white text-sm font-medium shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Limited time — 14-day free trial with full access
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 pt-4">
                <div className="flex-1 space-y-4">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
                    Start building{' '}
                    <span className="text-gradient">better assessments</span>{' '}
                    today
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                    Join 500+ schools and tutoring centres who trust PaperCraft.
                    Full access to all features — completely free for 14 days.
                  </p>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50">
                    <Clock className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Offer expires in:</p>
                      <div className="flex items-center gap-2 mt-1">
                        {[
                          { val: timeLeft.hours, label: 'h' },
                          { val: timeLeft.minutes, label: 'm' },
                          { val: timeLeft.seconds, label: 's' },
                        ].map((unit, i) => (
                          <div key={unit.label} className="flex items-center gap-1">
                            {i > 0 && <span className="text-muted-foreground">:</span>}
                            <span className="text-2xl font-bold text-foreground tabular-nums">
                              {String(unit.val).padStart(2, '0')}
                            </span>
                            <span className="text-muted-foreground">{unit.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col gap-4">
                  <Button
                    size="lg"
                    className="w-full lg:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-xl shadow-primary/25 text-lg group relative overflow-hidden"
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
                    className="w-full lg:w-auto h-14 px-8 rounded-2xl border-2 hover:bg-secondary/80 text-lg group bg-background/50"
                    asChild
                  >
                    <Link href="/auth/jwt/sign-in">
                      <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      Sign In
                    </Link>
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    No credit card required
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50 grid grid-cols-3 gap-4 sm:gap-8">
                {liveStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <stat.icon className="w-4 h-4 text-primary" />
                      <span className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 transition-all duration-700 delay-300 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {['🛡️ SSL Encrypted', '🇬🇧 UK Based', '⭐ 4.9/5 Rating', '💬 Priority Support'].map((item) => (
              <span key={item} className="text-sm text-muted-foreground">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
