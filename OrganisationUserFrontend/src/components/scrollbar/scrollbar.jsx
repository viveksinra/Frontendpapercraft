import SimpleBar from 'simplebar-react';
import { cn } from '@/lib/utils';

import { scrollbarClasses } from './classes';

export function Scrollbar({
  ref,
  children,
  className,
  fillContent = true,
  ...other
}) {
  return (
    <SimpleBar
      scrollableNodeProps={{ ref }}
      clickOnTrack={false}
      className={cn(
        scrollbarClasses.root,
        'min-w-0 min-h-0 flex-1 flex flex-col',
        fillContent && '[&_.simplebar-content]:flex [&_.simplebar-content]:flex-1 [&_.simplebar-content]:min-h-full [&_.simplebar-content]:flex-col',
        className
      )}
      {...other}
    >
      {children}
    </SimpleBar>
  );
}
