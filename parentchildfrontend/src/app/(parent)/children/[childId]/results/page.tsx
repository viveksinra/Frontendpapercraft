'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChildResultsList } from '@/components/parent/ChildResultsList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ChildResultsPage() {
  const params = useParams();
  const childId = params.childId as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/children/${childId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Results</h1>
          <p className="text-sm text-muted-foreground">
            View your child&apos;s test results and scores.
          </p>
        </div>
      </div>

      <ChildResultsList childId={childId} />
    </div>
  );
}
