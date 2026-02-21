import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CONFIG } from 'src/global-config';

export function SignInButton({ className, ...other }) {
  return (
    <Button variant="outline" asChild className={className} {...other}>
      <Link href={CONFIG.auth.redirectPath}>Sign in</Link>
    </Button>
  );
}
