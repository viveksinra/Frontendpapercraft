import { Separator } from '@/components/ui/separator';

// ----------------------------------------------------------------------

export function FormDivider({ label = 'OR' }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <Separator className="flex-1" />
    </div>
  );
}
