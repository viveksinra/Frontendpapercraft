import { useCallback } from 'react';

import { Button } from '@/components/ui/button';

import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { signOut } from 'src/auth/context/jwt/action';

export function SignOutButton({ onClose, className, ...other }) {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();
      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, onClose, router]);

  return (
    <Button
      variant="destructive"
      size="lg"
      className={className}
      onClick={handleLogout}
      {...other}
    >
      Logout
    </Button>
  );
}
