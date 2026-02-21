import { Menu } from 'lucide-react';

export function MenuButton({ className, ...other }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground ${className || ''}`}
      {...other}
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
