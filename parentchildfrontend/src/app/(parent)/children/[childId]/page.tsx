'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getChildren } from '@/lib/parent-api';
import { ChildOverviewCard } from '@/components/parent/ChildOverviewCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Building2,
  Hash,
} from 'lucide-react';

export default function ChildDetailPage() {
  const params = useParams();
  const childId = params.childId as string;
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChild() {
      setLoading(true);
      setError(null);
      try {
        const data = await getChildren();
        const children = data.children || data || [];
        const found = children.find(
          (c: any) =>
            (c.student?.id || c.id || c.userId) === childId
        );
        if (found) {
          setChild(found);
        } else {
          setError('Child not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load child details.');
      } finally {
        setLoading(false);
      }
    }
    fetchChild();
  }, [childId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-destructive">{error || 'Child not found.'}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/children">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Children
          </Link>
        </Button>
      </div>
    );
  }

  const student = child.student || child;
  const name =
    student.name ||
    `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
    'Child';
  const yearGroup = student.yearGroup || '';
  const studentCode = student.studentCode || '';
  const orgs = student.organizations || child.organizations || [];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/children">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Children
        </Link>
      </Button>

      {/* Child info header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
              {yearGroup && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Year {yearGroup}
                </span>
              )}
              {studentCode && (
                <span className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  <span className="font-mono">{studentCode}</span>
                </span>
              )}
              {orgs.length > 0 && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {orgs.map((o: any) => o.name || o).join(', ')}
                </span>
              )}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      <ChildOverviewCard child={child} />
    </div>
  );
}
