'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createChild } from '@/lib/parent-api';
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
import { Loader2, CheckCircle2, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { StudentCodeDisplay } from '@/components/auth/StudentCodeDisplay';

interface FormErrors {
  name?: string;
  relationship?: string;
  email?: string;
  password?: string;
  orgCode?: string;
}

export function CreateChildForm() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdChild, setCreatedChild] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Required fields
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');

  // Optional fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [yearGroup, setYearGroup] = useState('');
  const [orgCode, setOrgCode] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!relationship) {
      newErrors.relationship = 'Please select a relationship';
    }
    // If email is provided, password must be too (and vice versa)
    if (email.trim() && !password) {
      newErrors.password = 'Password is required when email is provided';
    }
    if (password && !email.trim()) {
      newErrors.email = 'Email is required when password is provided';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data: any = {
        name: name.trim(),
        relationship,
      };
      if (email.trim()) data.email = email.trim();
      if (password) data.password = password;
      if (yearGroup.trim()) data.yearGroup = yearGroup.trim();
      if (orgCode.trim()) data.orgCode = orgCode.trim();

      const result = await createChild(data);
      setCreatedChild(result.child || result);
      setIsSuccess(true);
      toast.success('Child account created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create child account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setIsSuccess(false);
    setCreatedChild(null);
    setName('');
    setRelationship('');
    setEmail('');
    setPassword('');
    setYearGroup('');
    setOrgCode('');
    setErrors({});
    setShowAdvanced(false);
  };

  if (isSuccess && createdChild) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Child Account Created</CardTitle>
          <CardDescription>
            {createdChild.name}&apos;s account has been created and linked to yours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <StudentCodeDisplay code={createdChild.studentCode} />
          {createdChild.email && !createdChild.email.includes('@managed.local') && (
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Login Email</p>
              <p className="text-sm font-medium">{createdChild.email}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleCreateAnother}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Another
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
          <UserPlus className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Create a Child Account</CardTitle>
        <CardDescription>
          Create a new account for your child. You can optionally set up login credentials and link them to a school.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="childName">Child&apos;s Name</Label>
            <Input
              id="childName"
              placeholder="e.g. John Smith"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              disabled={loading}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Relationship */}
          <div className="space-y-2">
            <Label htmlFor="childRelationship">Your Relationship</Label>
            <Select
              value={relationship}
              onValueChange={(value: string) => {
                setRelationship(value);
                if (errors.relationship) setErrors((prev) => ({ ...prev, relationship: undefined }));
              }}
              disabled={loading}
            >
              <SelectTrigger id="childRelationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.relationship && <p className="text-xs text-destructive">{errors.relationship}</p>}
          </div>

          {/* Year Group (optional, always visible) */}
          <div className="space-y-2">
            <Label htmlFor="yearGroup">Year Group (optional)</Label>
            <Input
              id="yearGroup"
              placeholder="e.g. Year 5"
              value={yearGroup}
              onChange={(e) => setYearGroup(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Advanced section toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <span>Login Credentials &amp; School (optional)</span>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAdvanced && (
            <div className="space-y-4 rounded-md border p-4">
              <p className="text-xs text-muted-foreground">
                Set up email and password if you want your child to log in independently.
              </p>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="childEmail">Email</Label>
                <Input
                  id="childEmail"
                  type="email"
                  placeholder="child@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  disabled={loading}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="childPassword">Password</Label>
                <Input
                  id="childPassword"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  disabled={loading}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              {/* Org Code */}
              <div className="space-y-2">
                <Label htmlFor="orgCode">School / Organisation Code</Label>
                <Input
                  id="orgCode"
                  placeholder="e.g. chelmsford11plus"
                  value={orgCode}
                  onChange={(e) => {
                    setOrgCode(e.target.value);
                    if (errors.orgCode) setErrors((prev) => ({ ...prev, orgCode: undefined }));
                  }}
                  disabled={loading}
                />
                {errors.orgCode && <p className="text-xs text-destructive">{errors.orgCode}</p>}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Child Account
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
