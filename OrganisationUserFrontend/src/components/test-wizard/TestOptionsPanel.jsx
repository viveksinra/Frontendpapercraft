'use client';

import { Info } from 'lucide-react';
import { useMemo, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Defaults that are auto-set based on mode
const MODE_DEFAULTS = {
  live_mock: {
    randomizeQuestions: false,
    randomizeOptions: false,
    showResults: false,
    showSolutions: false,
    instantFeedback: false,
    allowReview: true,
    maxAttempts: 1,
  },
  anytime_mock: {
    randomizeQuestions: true,
    randomizeOptions: true,
    showResults: false,
    showSolutions: false,
    instantFeedback: false,
    allowReview: true,
    maxAttempts: 1,
  },
  practice: {
    randomizeQuestions: true,
    randomizeOptions: true,
    showResults: true,
    showSolutions: true,
    instantFeedback: true,
    allowReview: true,
    maxAttempts: 0, // unlimited
  },
  classroom: {
    randomizeQuestions: false,
    randomizeOptions: false,
    showResults: true,
    showSolutions: false,
    instantFeedback: false,
    allowReview: true,
    maxAttempts: 1,
  },
  section_timed: {
    randomizeQuestions: false,
    randomizeOptions: false,
    showResults: false,
    showSolutions: false,
    instantFeedback: false,
    allowReview: false,
    maxAttempts: 1,
  },
};

const OPTION_DEFINITIONS = [
  { key: 'randomizeQuestions', label: 'Randomize question order', description: 'Each student sees questions in a different order' },
  { key: 'randomizeOptions', label: 'Randomize option order', description: 'Shuffle answer options for MCQs' },
  { key: 'showResults', label: 'Show results to students', description: 'Students can see their score after submission' },
  { key: 'showSolutions', label: 'Show solutions', description: 'Students can view correct answers after the test ends' },
  { key: 'showToParents', label: 'Show results to parents', description: 'Parents can view their child\'s results' },
  { key: 'instantFeedback', label: 'Instant feedback', description: 'Show correct/incorrect immediately after each question' },
  { key: 'allowReview', label: 'Allow review after submission', description: 'Students can review their answers after submitting' },
];

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function TestOptionsPanel({ mode, options, onChange }) {
  const autoDefaults = useMemo(() => MODE_DEFAULTS[mode] || {}, [mode]);

  // Determine which options are auto-set by the mode
  const isAuto = (key) => mode && autoDefaults[key] !== undefined;

  const getOptionValue = (key) => {
    if (options?.[key] !== undefined) return options[key];
    if (isAuto(key)) return autoDefaults[key];
    return false;
  };

  const handleToggle = (key, value) => {
    onChange({ ...options, [key]: value });
  };

  const handleNumericChange = (key, value) => {
    onChange({ ...options, [key]: value === '' ? '' : Number(value) });
  };

  // Apply mode defaults when mode changes
  useEffect(() => {
    if (mode && autoDefaults) {
      const merged = { ...autoDefaults, ...options };
      // Only update if there are new defaults to apply
      const hasNewDefaults = Object.keys(autoDefaults).some(
        (k) => options?.[k] === undefined
      );
      if (hasNewDefaults) {
        onChange(merged);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Test Options</h3>

      {mode && (
        <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>Some options are pre-configured for <strong className="text-foreground">{mode.replace('_', ' ')}</strong> mode. You can override them.</span>
        </div>
      )}

      <div className="space-y-1">
        {OPTION_DEFINITIONS.map((opt) => (
          <div
            key={opt.key}
            className="flex items-center justify-between rounded-md px-3 py-2.5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{opt.label}</span>
                {isAuto(opt.key) && (
                  <span className="text-[10px] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5">
                    Auto
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
            </div>
            <ToggleSwitch
              checked={!!getOptionValue(opt.key)}
              onChange={(val) => handleToggle(opt.key, val)}
            />
          </div>
        ))}
      </div>

      {/* Numeric options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Max Attempts</Label>
            {isAuto('maxAttempts') && (
              <span className="text-[10px] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5">
                Auto
              </span>
            )}
          </div>
          <Input
            type="number"
            min={0}
            value={options?.maxAttempts ?? autoDefaults.maxAttempts ?? 1}
            onChange={(e) => handleNumericChange('maxAttempts', e.target.value)}
            className="w-32"
          />
          <p className="text-xs text-muted-foreground">0 = unlimited attempts</p>
        </div>
        <div className="space-y-2">
          <Label>Passing Score (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={options?.passingScore ?? ''}
            onChange={(e) => handleNumericChange('passingScore', e.target.value)}
            placeholder="e.g. 40"
            className="w-32"
          />
          <p className="text-xs text-muted-foreground">Leave empty for no pass/fail</p>
        </div>
      </div>
    </div>
  );
}
