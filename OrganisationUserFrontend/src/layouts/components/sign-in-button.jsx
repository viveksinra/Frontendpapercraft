import Link from 'next/link';

import { CONFIG } from 'src/global-config';

import { Button } from '@/components/ui/button';

export function SignInButton({ className, ...other }) {
  return (
    <Button variant="outline" asChild className={className} {...other}>
      <Link href={CONFIG.auth.redirectPath}>Sign in</Link>
    </Button>
  );
}
