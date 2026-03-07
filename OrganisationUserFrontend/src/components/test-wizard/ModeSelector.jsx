'use client';

import {
  Clock,
  Users,
  Timer,
  RefreshCw,
  CalendarClock,
} from 'lucide-react';

const MODES = [
  {
    value: 'live_mock',
    title: 'Live Mock',
    description: 'Scheduled exam with fixed start time and duration',
    icon: Clock,
  },
  {
    value: 'anytime_mock',
    title: 'Anytime Mock',
    description: 'Available within a time window, students choose when to start',
    icon: CalendarClock,
  },
  {
    value: 'practice',
    title: 'Practice',
    description: 'Unlimited attempts with instant feedback',
    icon: RefreshCw,
  },
  {
    value: 'classroom',
    title: 'Classroom',
    description: 'Teacher-controlled, can pause/resume',
    icon: Users,
  },
  {
    value: 'section_timed',
    title: 'Section Timed',
    description: 'Simulates FSCE/CSSE with per-section timers and no going back',
    icon: Timer,
  },
];

export default function ModeSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Select Test Mode</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = value === mode.value;

          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange(mode.value)}
              className={`flex flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-accent/50'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{mode.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {mode.description}
                </p>
              </div>
              {isSelected && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
