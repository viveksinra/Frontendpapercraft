'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { linkChild } from '@/lib/parent-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle2, Link2, UserPlus } from 'lucide-react';

export function LinkChildForm() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [linkedChild, setLinkedChild] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [relationship, setRelationship] = useState('');
  const [errors, setErrors] = useState<{ studentCode?: string; relationship?: string }>({});

  const validate = () => {
    const newErrors: { studentCode?: string; relationship?: string } = {};
    if (!studentCode.trim()) {
      newErrors.studentCode = 'Student code is required';
    }
    if (!relationship) {
      newErrors.relationship = 'Please select a relationship';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await linkChild(studentCode.toUpperCase().trim(), relationship);
      setLinkedChild(result.child || result);
      setIsSuccess(true);
      toast.success('Child linked successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to link child. Please check the student code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAnother = () => {
    setIsSuccess(false);
    setLinkedChild(null);
    setStudentCode('');
    setRelationship('');
    setErrors({});
  };

  if (isSuccess) {
    const childName =
      linkedChild?.name ||
      linkedChild?.student?.name ||
      `${linkedChild?.firstName || ''} ${linkedChild?.lastName || ''}`.trim() ||
      'Child';
    const orgs =
      linkedChild?.organizations ||
      linkedChild?.student?.organizations ||
      [];

    return (
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Child Linked Successfully</CardTitle>
          <CardDescription>
            You can now monitor their progress and results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border p-3">
            <p className="text-sm font-medium">{childName}</p>
            {orgs.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {orgs.map((o: any) => o.name || o).join(', ')}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleLinkAnother}>
            <UserPlus className="mr-2 h-4 w-4" />
            Link Another
          </Button>
          <Button className="flex-1" onClick={() => router.push('/parent/dashboard')}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Link2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Link a Child</CardTitle>
        <CardDescription>
          Enter the student code provided by your child&apos;s school to link their
          account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentCode">Student Code</Label>
            <Input
              id="studentCode"
              placeholder="e.g. STU-ABC123"
              className="font-mono uppercase tracking-wider"
              value={studentCode}
              onChange={(e) => {
                setStudentCode(e.target.value.toUpperCase());
                if (errors.studentCode) {
                  setErrors((prev) => ({ ...prev, studentCode: undefined }));
                }
              }}
              disabled={loading}
            />
            {errors.studentCode && (
              <p className="text-xs text-destructive">{errors.studentCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Select
              value={relationship}
              onValueChange={(value: string) => {
                setRelationship(value);
                if (errors.relationship) {
                  setErrors((prev) => ({ ...prev, relationship: undefined }));
                }
              }}
              disabled={loading}
            >
              <SelectTrigger id="relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.relationship && (
              <p className="text-xs text-destructive">{errors.relationship}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Link Child
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
