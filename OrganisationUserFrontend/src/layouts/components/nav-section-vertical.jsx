'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { usePathname } from 'src/routes/hooks';

import { cn } from '@/lib/utils';

export function NavSectionVertical({ data, isNavMini, checkPermissions }) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-1 flex-col gap-2', isNavMini ? 'px-1' : 'px-3')}>
      {data?.map((section) => (
        <div key={section.subheader}>
          {/* Subheader */}
          {!isNavMini && (
            <p className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.subheader}
            </p>
          )}

          {/* Items */}
          <ul className="space-y-0.5">
            {section.items?.map((item) => {
              if (checkPermissions && checkPermissions(item.allowedRoles)) {
                return null;
              }
              return (
                <NavItem
                  key={item.title}
                  item={item}
                  isNavMini={isNavMini}
                  pathname={pathname}
                  depth={0}
                />
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function NavItem({ item, isNavMini, pathname, depth }) {
  const { title, path, icon, info, badge, children, disabled } = item;
  const isActive = pathname === path || pathname.startsWith(path + '/');
  const hasChildren = children && children.length > 0;
  const [open, setOpen] = useState(
    hasChildren && children.some((child) => pathname === child.path || pathname.startsWith(child.path + '/'))
  );

  if (isNavMini && depth === 0) {
    return (
      <li>
        <Link
          href={disabled ? '#' : path}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg px-1 py-2 text-xs text-muted-foreground transition-colors',
            isActive && 'bg-primary/10 text-primary font-medium',
            !isActive && 'hover:bg-accent hover:text-foreground',
            disabled && 'pointer-events-none opacity-50'
          )}
        >
          {icon && <span className="mb-0.5 [&_svg]:h-5 [&_svg]:w-5">{icon}</span>}
          <span className="max-w-full truncate text-[10px]">{title}</span>
        </Link>
      </li>
    );
  }

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors',
            isActive && 'bg-primary/10 text-primary font-medium',
            !isActive && 'hover:bg-accent hover:text-foreground'
          )}
        >
          {icon && <span className="shrink-0 [&_svg]:h-5 [&_svg]:w-5">{icon}</span>}
          <span className="flex-1 truncate text-left">{title}</span>
          {info && <span className="ml-auto text-xs">{info}</span>}
          <ChevronDown
            className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')}
          />
        </button>

        {open && (
          <ul className="mt-0.5 ml-4 space-y-0.5 border-l border-border pl-3">
            {children.map((child) => (
              <NavItem
                key={child.title}
                item={child}
                isNavMini={false}
                pathname={pathname}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={disabled ? '#' : path}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors',
          isActive && 'bg-primary/10 text-primary font-medium',
          !isActive && 'hover:bg-accent hover:text-foreground',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        {icon && <span className="shrink-0 [&_svg]:h-5 [&_svg]:w-5">{icon}</span>}
        <span className="flex-1 truncate">{title}</span>
        {badge && (
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {badge}
          </span>
        )}
        {info && !badge && <span className="ml-auto text-xs">{info}</span>}
      </Link>
    </li>
  );
}
