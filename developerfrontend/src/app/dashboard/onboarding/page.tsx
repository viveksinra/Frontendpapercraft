'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { createOrganization } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const onboardingSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(100),
  ownerEmail: z.string().email('Please enter a valid email address'),
  primaryColor: z.string().optional(),
  plan: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface CreatedOrg {
  id?: string;
  name: string;
  ownerEmail: string;
  slug?: string;
  plan?: string;
}

export default function OnboardingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [createdOrg, setCreatedOrg] = useState<CreatedOrg | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(onboardingSchema as any),
    defaultValues: {
      name: '',
      ownerEmail: '',
      primaryColor: '#18181b',
      plan: 'free',
    },
  });

  const selectedPlan = watch('plan');

  const onSubmit = async (data: OnboardingFormValues) => {
    setSubmitting(true);
    try {
      const res = await createOrganization({
        name: data.name,
        ownerEmail: data.ownerEmail,
        primaryColor: data.primaryColor || undefined,
        plan: data.plan || undefined,
      });
      const org = res.organization || res.data || res;
      setCreatedOrg({
        id: org?.id,
        name: data.name,
        ownerEmail: data.ownerEmail,
        slug: org?.slug,
        plan: data.plan,
      });
      toast.success('Organization created successfully!');
      reset();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create organization.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Client Onboarding</h2>
        <p className="text-muted-foreground">Create a new organization and onboard a client.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Onboarding Form */}
        <Card>
          <CardHeader>
            <CardTitle>New Organization</CardTitle>
            <CardDescription>Fill in the details to create a new client organization.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  placeholder="Acme Corporation"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Owner Email *</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="owner@acme.com"
                  {...register('ownerEmail')}
                />
                {errors.ownerEmail && (
                  <p className="text-sm text-destructive">{errors.ownerEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Brand Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="primaryColorPicker"
                    value={watch('primaryColor') || '#18181b'}
                    onChange={(e) => setValue('primaryColor', e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-input p-1"
                  />
                  <Input
                    id="primaryColor"
                    placeholder="#18181b"
                    {...register('primaryColor')}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plan / Tier</Label>
                <Select
                  value={selectedPlan}
                  onValueChange={(value: string) => setValue('plan', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Organization'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Confirmation Card */}
        {createdOrg && (
          <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-green-700 dark:text-green-300">Organization Created</CardTitle>
              </div>
              <CardDescription>The organization has been set up successfully.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {createdOrg.id && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Organization ID</dt>
                    <dd className="mt-0.5 font-mono text-xs">{createdOrg.id}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd className="mt-0.5 text-sm">{createdOrg.name}</dd>
                </div>
                {createdOrg.slug && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Slug</dt>
                    <dd className="mt-0.5 font-mono text-xs">{createdOrg.slug}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Owner Email</dt>
                  <dd className="mt-0.5 text-sm">{createdOrg.ownerEmail}</dd>
                </div>
                {createdOrg.plan && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Plan</dt>
                    <dd className="mt-0.5 text-sm capitalize">{createdOrg.plan}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Next Steps:</p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>The owner will receive an invitation email to set up their account.</li>
                  <li>Configure branding and settings in the organization detail page.</li>
                  <li>The owner can then invite team members from their dashboard.</li>
                </ul>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
