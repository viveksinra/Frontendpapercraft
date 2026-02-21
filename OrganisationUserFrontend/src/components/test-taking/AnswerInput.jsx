'use client';

import { Input } from '@/components/ui/input';

// ─── MCQ Single (Radio) ─────────────────────────────────────────────────────

function McqSingleInput({ options, value, onChange }) {
  return (
    <div className="space-y-2">
      {options.map((option, idx) => {
        const optionValue = option.index ?? idx;
        const isSelected = Number(value) === optionValue;
        const label = option.text || option.label || option;

        return (
          <label
            key={idx}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
              isSelected
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border bg-background hover:bg-accent/50'
            }`}
          >
            <input
              type="radio"
              name="mcq-single"
              checked={isSelected}
              onChange={() => onChange(optionValue)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{label}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ─── MCQ Multiple (Checkboxes) ──────────────────────────────────────────────

function McqMultipleInput({ options, value, onChange }) {
  const selected = Array.isArray(value) ? value.map(Number) : [];

  const handleToggle = (optionValue) => {
    const numVal = Number(optionValue);
    if (selected.includes(numVal)) {
      onChange(selected.filter((v) => v !== numVal));
    } else {
      onChange([...selected, numVal]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Select all that apply</p>
      {options.map((option, idx) => {
        const optionValue = option.index ?? idx;
        const isChecked = selected.includes(optionValue);
        const label = option.text || option.label || option;

        return (
          <label
            key={idx}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
              isChecked
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border bg-background hover:bg-accent/50'
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleToggle(optionValue)}
              className="mt-0.5 h-4 w-4 rounded accent-primary"
            />
            <span className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{label}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ─── True/False ─────────────────────────────────────────────────────────────

function TrueFalseInput({ value, onChange }) {
  return (
    <div className="flex gap-3">
      {[
        { val: true, label: 'True' },
        { val: false, label: 'False' },
      ].map(({ val, label }) => {
        const isSelected = value === val;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(val)}
            className={`flex-1 rounded-lg border-2 px-6 py-3 text-sm font-medium transition-all ${
              isSelected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-foreground hover:bg-accent/50 hover:border-primary/40'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Fill in the Blank ──────────────────────────────────────────────────────

function FillInBlankInput({ value, onChange }) {
  return (
    <Input
      type="text"
      placeholder="Type your answer..."
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-md"
    />
  );
}

// ─── Numerical ──────────────────────────────────────────────────────────────

function NumericalInput({ value, onChange }) {
  return (
    <Input
      type="number"
      placeholder="Enter a number..."
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      className="max-w-xs"
      step="any"
    />
  );
}

// ─── Short Answer ───────────────────────────────────────────────────────────

function ShortAnswerInput({ value, onChange }) {
  return (
    <Input
      type="text"
      placeholder="Type your short answer..."
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// ─── Long Answer / Essay / Creative Writing ─────────────────────────────────

function LongAnswerInput({ value, onChange, placeholder }) {
  return (
    <textarea
      placeholder={placeholder || 'Write your answer here...'}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      rows={8}
      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[120px]"
    />
  );
}

// ─── Match the Column ───────────────────────────────────────────────────────

function MatchTheColumnInput({ value, onChange, options }) {
  const columnA = options?.columnA || [];
  const columnB = options?.columnB || [];
  const pairs = (typeof value === 'object' && value !== null && !Array.isArray(value))
    ? value
    : {};

  const handlePairChange = (key, matchValue) => {
    onChange({ ...pairs, [key]: matchValue });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Match each item in Column A with the corresponding item in Column B
      </p>
      {columnA.map((item, idx) => {
        const key = String(idx);
        const itemLabel = item.text || item;
        return (
          <div key={idx} className="flex items-center gap-3 rounded-lg border bg-background p-3">
            <span className="min-w-[120px] text-sm font-medium">
              {idx + 1}. {itemLabel}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 text-muted-foreground"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            <select
              value={pairs[key] || ''}
              onChange={(e) => handlePairChange(key, e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">-- Select --</option>
              {columnB.map((bItem, bIdx) => (
                <option key={bIdx} value={String(bIdx)}>
                  {String.fromCharCode(65 + bIdx)}. {bItem.text || bItem}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main AnswerInput ───────────────────────────────────────────────────────

export default function AnswerInput({ questionType, value, onChange, options }) {
  switch (questionType) {
    case 'mcq_single':
    case 'multiple_choice':
      return <McqSingleInput options={options || []} value={value} onChange={onChange} />;

    case 'mcq_multiple':
    case 'multi_select':
      return <McqMultipleInput options={options || []} value={value} onChange={onChange} />;

    case 'true_false':
      return <TrueFalseInput value={value} onChange={onChange} />;

    case 'fill_in_blank':
    case 'fill_in_the_blank':
      return <FillInBlankInput value={value} onChange={onChange} />;

    case 'numerical':
      return <NumericalInput value={value} onChange={onChange} />;

    case 'short_answer':
      return <ShortAnswerInput value={value} onChange={onChange} />;

    case 'long_answer':
      return <LongAnswerInput value={value} onChange={onChange} placeholder="Write your detailed answer here..." />;

    case 'essay':
      return <LongAnswerInput value={value} onChange={onChange} placeholder="Write your essay here..." />;

    case 'creative_writing':
      return <LongAnswerInput value={value} onChange={onChange} placeholder="Write your creative piece here..." />;

    case 'match_the_column':
    case 'matching':
      return <MatchTheColumnInput value={value} onChange={onChange} options={options} />;

    case 'comprehension':
      // Comprehension sub-questions are rendered individually -- fall through to a text area
      return <LongAnswerInput value={value} onChange={onChange} placeholder="Answer the comprehension question..." />;

    default:
      return (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-4 text-sm text-muted-foreground">
          Unsupported question type: <span className="font-mono">{questionType}</span>
        </div>
      );
  }
}
