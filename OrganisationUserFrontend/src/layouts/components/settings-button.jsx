import { Settings } from 'lucide-react';

export function SettingsButton({ className, ...other }) {
  return (
    <button
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${className || ''}`}
      aria-label="Settings"
      {...other}
    >
      <Settings className="h-5 w-5" />
    </button>
  );
}
