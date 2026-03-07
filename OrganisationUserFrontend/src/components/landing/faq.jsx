'use client';

import { useRef, useState, useEffect } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'How does the free trial work?',
    a: 'You get 14 days of full access to all Professional features. No credit card required. Create up to 100 questions, generate 5 papers, and deliver 3 online tests during your trial.',
  },
  {
    q: 'Can I import my existing questions?',
    a: 'Yes. We support bulk import from Excel, CSV, and Word documents. You can also import from other assessment platforms. Our team can help with migration for Enterprise plans.',
  },
  {
    q: 'How does the AI paper generator work?',
    a: 'Set your blueprint with desired topics, difficulty levels, and marks distribution. Our AI selects the best questions from your bank and assembles a balanced paper in seconds. You can review and adjust before finalising.',
  },
  {
    q: 'Is online testing secure?',
    a: 'Yes. We offer timed sessions, randomised question order, browser lockdown options, and proctoring features. Tests can be scheduled for specific time windows with access codes.',
  },
  {
    q: 'Can parents and students access results?',
    a: 'Absolutely. PaperCraft includes a dedicated student and parent portal where they can view test results, track progress over time, access homework, and see detailed performance analytics.',
  },
  {
    q: 'Do you support multiple branches or schools?',
    a: 'Yes. Our Enterprise plan supports multi-branch management with centralised question banks, shared templates, and consolidated analytics across all locations.',
  },
  {
    q: 'What question types are supported?',
    a: 'We support multiple choice, multi-select, true/false, short answer, long answer (essay), fill-in-the-blank, matching, ordering, and comprehension-based questions with passages.',
  },
];

export function FAQ() {
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="py-18 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`text-center mb-10 sm:mb-12 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-muted-foreground mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Questions, answered</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about PaperCraft — pricing, features, and getting started.
          </p>
        </div>

        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="bg-card/60 border border-border rounded-2xl p-2 sm:p-3 space-y-1">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.q}
                  className={cn(
                    'rounded-xl px-2 sm:px-3 transition-colors',
                    isOpen && 'bg-secondary/40'
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex items-center justify-between w-full py-4 text-left text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <span className="pr-4">{item.q}</span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      isOpen ? 'max-h-48 pb-4' : 'max-h-0'
                    )}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
