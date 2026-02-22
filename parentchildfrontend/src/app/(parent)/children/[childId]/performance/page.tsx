'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChildPerformanceCharts } from '@/components/parent/ChildPerformanceCharts';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ChildPerformancePage() {
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
          <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
          <p className="text-sm text-muted-foreground">
            Track your child&apos;s performance trends and subject breakdown.
          </p>
        </div>
      </div>

      <ChildPerformanceCharts childId={childId} />
    </div>
  );
}
