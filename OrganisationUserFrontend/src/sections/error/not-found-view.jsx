'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { SimpleLayout } from 'src/layouts/simple';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
    >
      <div className="flex flex-col items-center text-center">
        <h3 className="mb-2 text-2xl font-bold">
          Sorry, page not found!
        </h3>

        <p className="text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve mistyped the URL? Be
          sure to check your spelling.
        </p>

        <div className="my-10 text-8xl font-bold text-muted-foreground/30">
          404
        </div>

        <Button asChild size="lg">
          <Link href="/">Go to home</Link>
        </Button>
      </div>
    </SimpleLayout>
  );
}
