'use client';

interface AutoAdvanceToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function AutoAdvanceToggle({ enabled, onToggle }: AutoAdvanceToggleProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
      <span className="text-muted-foreground">Auto-advance</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          enabled ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
          style={{ transform: enabled ? 'translateX(18px)' : 'translateX(2px)' }}
        />
      </button>
    </label>
  );
}
