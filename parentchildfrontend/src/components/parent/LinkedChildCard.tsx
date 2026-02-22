'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { unlinkChild } from '@/lib/parent-api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  GraduationCap,
  Building2,
  Hash,
  BarChart3,
  Unlink,
  Loader2,
  ArrowRight,
} from 'lucide-react';

interface LinkedChildCardProps {
  child: any;
  onUnlinked?: () => void;
}

export function LinkedChildCard({ child, onUnlinked }: LinkedChildCardProps) {
  const [unlinking, setUnlinking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const student = child.student || child;
  const childId = student.id || student.userId;
  const name =
    student.name ||
    `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
    'Child';
  const yearGroup = student.yearGroup || '';
  const studentCode = student.studentCode || '';
  const orgs = student.organizations || child.organizations || [];
  const stats = child.stats || {};
  const totalTests = stats.totalTests ?? stats.testsCompleted ?? 0;
  const average = stats.averageScore ?? stats.average;

  const handleUnlink = async () => {
    setUnlinking(true);
    try {
      await unlinkChild(childId);
      toast.success(`${name} has been unlinked.`);
      setDialogOpen(false);
      onUnlinked?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to unlink child.');
    } finally {
      setUnlinking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            {yearGroup && (
              <CardDescription className="mt-1">Year {yearGroup}</CardDescription>
            )}
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Unlink className="mr-1 h-4 w-4" />
                Unlink
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unlink {name}?</DialogTitle>
                <DialogDescription>
                  This will remove the link between your account and {name}&apos;s
                  student account. You will no longer be able to view their tests,
                  results, or performance data. This action can be undone by
                  re-linking with their student code.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={unlinking}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleUnlink}
                  disabled={unlinking}
                >
                  {unlinking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Unlink Child
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          {studentCode && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span className="font-mono">{studentCode}</span>
            </div>
          )}
          {orgs.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{orgs.map((o: any) => o.name || o).join(', ')}</span>
            </div>
          )}
          {yearGroup && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>Year {yearGroup}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>
              {totalTests} test{totalTests !== 1 ? 's' : ''} completed
              {average !== undefined && average !== null && (
                <> &middot; {Math.round(average)}% average</>
              )}
            </span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/children/${childId}`}>
            View Details
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
