'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

import { Sheet, SheetContent } from '@/components/ui/sheet';

import { usePathname } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { NavSectionVertical } from '../components/nav-section-vertical';

export function NavMobile({ data, open, onClose, checkPermissions }) {
  const pathname = usePathname();

  // Close on navigation
  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <Logo />
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Scrollbar fillContent>
          <NavSectionVertical data={data} checkPermissions={checkPermissions} />
        </Scrollbar>
      </SheetContent>
    </Sheet>
  );
}
