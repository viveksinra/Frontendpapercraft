import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// ----------------------------------------------------------------------

export function FormReturnLink({ href, label, icon, children }) {
  return (
    <Link
      href={href}
      className="mt-4 mx-auto inline-flex items-center gap-1 text-sm font-semibold hover:underline"
    >
      {icon || <ArrowLeft className="h-4 w-4" />}
      {label || 'Return to sign in'}
      {children}
    </Link>
  );
}
