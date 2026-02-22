import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export function LoadingSpinner({ className, label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="ml-2 text-muted-foreground">{label}</span>
    </div>
  );
}
