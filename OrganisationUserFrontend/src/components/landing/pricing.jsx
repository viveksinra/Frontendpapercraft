'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { Zap, Check, Crown, Clock, Shield, Sparkles, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for trying out PaperCraft',
    price: { monthly: 0, annual: 0 },
    period: '14 days',
    icon: Zap,
    iconGradient: 'from-slate-500 to-slate-600',
    features: [
      { text: '100 questions in bank', included: true },
      { text: '5 paper generations', included: true },
      { text: '3 online tests', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Unlimited questions', included: false },
      { text: 'Advanced reporting', included: false },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'outline',
    highlighted: false,
  },
  {
    name: 'Professional',
    description: 'Everything you need for your organisation',
    price: { monthly: 49, annual: 39 },
    period: '/month',
    icon: Sparkles,
    iconGradient: 'from-primary to-accent',
    features: [
      { text: 'Unlimited questions', included: true },
      { text: 'Unlimited paper generation', included: true },
      { text: 'Unlimited online tests', included: true },
      { text: 'Full analytics & reports', included: true },
      { text: 'Course builder', included: true },
      { text: 'Student & parent portal', included: true },
    ],
    cta: 'Get Started',
    ctaVariant: 'default',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    description: 'For multi-school trusts & large centres',
    price: { monthly: 149, annual: 119 },
    period: '/month',
    icon: Crown,
    iconGradient: 'from-amber-500 to-orange-500',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Multi-branch management', included: true },
      { text: 'White-label branding', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom integrations', included: true },
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline',
    highlighted: false,
    badge: 'Best Value',
  },
];

export function Pricing() {
  const [visible, setVisible] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
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
    <section id="pricing" ref={sectionRef} className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-sm font-medium text-muted-foreground mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Start Free, Scale When{' '}
            <span className="text-gradient">Ready</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            No hidden fees. Cancel anytime. 100% money-back guarantee.
          </p>

          <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                !isAnnual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
                isAnnual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Annually
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = plan.price.monthly === 0 ? 0 : isAnnual ? plan.price.annual : plan.price.monthly;

            return (
              <div
                key={plan.name}
                className={`relative transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                {plan.highlighted && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-xl opacity-30 animate-pulse" />
                )}

                <GlassCard
                  className={cn(
                    'relative h-full flex flex-col p-6 sm:p-8 rounded-2xl transition-all duration-300',
                    plan.highlighted
                      ? 'border-2 border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10'
                      : 'hover:border-primary/20 hover:shadow-lg'
                  )}
                >
                  {plan.badge && (
                    <div
                      className={cn(
                        'absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg',
                        plan.highlighted
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                          : 'bg-amber-500 text-white'
                      )}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.iconGradient} p-[1px] mb-6`}>
                    <div className="w-full h-full rounded-2xl bg-background/80 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-foreground" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-foreground">
                      {price === 0 ? 'Free' : `£${price}`}
                    </span>
                    {price !== 0 && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>

                  {isAnnual && plan.price.monthly > 0 && plan.price.annual < plan.price.monthly && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">
                      Save £{(plan.price.monthly - plan.price.annual) * 12}/year
                    </p>
                  )}

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                            feature.included
                              ? plan.highlighted
                                ? 'bg-emerald-500/20'
                                : 'bg-primary/10'
                              : 'bg-muted'
                          )}
                        >
                          {feature.included ? (
                            <Check
                              className={cn('w-3 h-3', plan.highlighted ? 'text-emerald-500' : 'text-primary')}
                            />
                          ) : (
                            <span className="w-1.5 h-0.5 rounded-full bg-muted-foreground/50" />
                          )}
                        </div>
                        <span className={cn(feature.included ? 'text-foreground' : 'text-muted-foreground line-through')}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      'w-full h-12 rounded-xl font-medium transition-all group',
                      plan.highlighted
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25'
                        : plan.ctaVariant === 'outline'
                          ? 'border-2 hover:bg-secondary'
                          : ''
                    )}
                    variant={plan.highlighted ? 'default' : plan.ctaVariant}
                    asChild
                  >
                    <Link href="/auth/jwt/sign-up">
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </GlassCard>
              </div>
            );
          })}
        </div>

        <div
          className={`mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 transition-all duration-700 delay-500 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {[
            { icon: Shield, text: 'Secure Payment' },
            { icon: Clock, text: 'Cancel Anytime' },
            { icon: Sparkles, text: '14-Day Free Trial' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-muted-foreground">
              <item.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        <p
          className={`text-center text-sm text-muted-foreground mt-8 transition-all duration-700 delay-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Trusted by <span className="font-semibold text-foreground">500+</span> schools and tutoring centres worldwide
        </p>
      </div>
    </section>
  );
}
