'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Star, Play, Quote, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

const testimonials = [
  {
    quote:
      'PaperCraft has transformed how we create exams. What used to take hours now takes minutes. The AI paper generator is a game-changer for our school.',
    author: 'Dr. Sarah Mitchell',
    role: 'Head of Assessment',
    avatar: '👩‍🏫',
    color: 'from-purple-500 to-purple-600',
    highlight: 'Reduced paper creation time by 80%',
  },
  {
    quote:
      'The question bank organisation is brilliant. We can tag, filter, and reuse questions across departments. It has brought real consistency to our assessments.',
    author: 'James Thompson',
    role: 'Tutoring Centre Director',
    avatar: '👨‍💼',
    color: 'from-blue-500 to-blue-600',
    highlight: '5,000+ questions organised',
  },
  {
    quote:
      'Online testing with auto-grading saved us countless hours of marking. The analytics show us exactly where students need support — absolutely invaluable.',
    author: 'Priya Sharma',
    role: 'Maths Department Lead',
    avatar: '👩‍🔬',
    color: 'from-emerald-500 to-emerald-600',
    highlight: '40+ hours saved per month',
  },
  {
    quote:
      'As a parent, I love that I can track my child\'s progress in real time. The detailed reports help me understand their strengths and where they need more practice.',
    author: 'David Chen',
    role: 'Parent',
    avatar: '👨',
    color: 'from-orange-500 to-orange-600',
    highlight: "Child's score improved 25%",
  },
  {
    quote:
      'We switched from three different tools to PaperCraft and haven\'t looked back. Question bank, paper generation, online tests, and analytics — all in one place.',
    author: 'Rachel Williams',
    role: 'Academy Trust Manager',
    avatar: '👩‍💻',
    color: 'from-pink-500 to-pink-600',
    highlight: 'Managing 12 schools on one platform',
  },
  {
    quote:
      'The course builder with integrated assessments is fantastic. Students can learn and practise at their own pace, and I can monitor everything from the dashboard.',
    author: 'Michael O\'Brien',
    role: '11+ Tutor',
    avatar: '👨‍🏫',
    color: 'from-indigo-500 to-indigo-600',
    highlight: 'Student pass rate increased to 95%',
  },
];

const trustStats = [
  { value: '500+', label: 'Schools & Centres', icon: '🏫' },
  { value: '98%', label: 'Satisfaction Rate', icon: '✅' },
  { value: '4.9/5', label: 'User Rating', icon: '⭐' },
  { value: '1M+', label: 'Assessments Delivered', icon: '📄' },
];

export function Testimonials() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
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
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const visibleTestimonials = [
    testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length],
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
  ];

  return (
    <section ref={sectionRef} className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/20" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-sm font-medium text-muted-foreground mb-6">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Trusted by Educators <span className="text-gradient">Everywhere</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of schools, tutoring centres, and educators who build better assessments with PaperCraft
          </p>
        </div>

        <div
          className={`relative max-w-5xl mx-auto transition-all duration-700 delay-200 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border-border/50 shadow-lg hover:bg-background hover:scale-110 transition-all hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border-border/50 shadow-lg hover:bg-background hover:scale-110 transition-all hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          <div className="relative h-[420px] sm:h-[380px]">
            {visibleTestimonials.map((testimonial, idx) => {
              const isCenter = idx === 1;
              const isLeft = idx === 0;
              const isRight = idx === 2;

              return (
                <div
                  key={`${testimonial.author}-${idx}`}
                  className={cn(
                    'absolute top-1/2 left-1/2 w-full max-w-lg transition-all duration-500 ease-out',
                    isCenter && '-translate-x-1/2 -translate-y-1/2 z-10 scale-100 opacity-100',
                    isLeft && '-translate-x-[120%] -translate-y-1/2 z-0 scale-90 opacity-40 hidden md:block',
                    isRight && 'translate-x-[20%] -translate-y-1/2 z-0 scale-90 opacity-40 hidden md:block'
                  )}
                >
                  <GlassCard className="p-6 sm:p-8 rounded-2xl border-2 border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <Quote className="w-10 h-10 text-primary/20" />
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>

                    <p className="text-foreground text-lg leading-relaxed mb-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {testimonial.highlight && (
                      <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                          <span className="text-lg">🎉</span>
                          {testimonial.highlight}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                      <div
                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-3xl shadow-lg`}
                      >
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-lg">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-8 h-8 rounded-full"
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-300',
                    currentIndex === idx ? 'w-8 bg-primary' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className={`mt-16 sm:mt-24 transition-all duration-700 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/20 transition-colors group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
