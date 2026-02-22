import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const GlassCard = forwardRef(({ className, hover = false, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-xl shadow-black/5',
      hover &&
        'transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/20',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

GlassCard.displayName = 'GlassCard';

export { GlassCard };
