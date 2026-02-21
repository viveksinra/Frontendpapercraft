'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, RefreshCw, Globe, Mail, FileText, Link, AtSign, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from 'src/auth/hooks';
import { getCompanyInfo, updateCompanyInfo, getActiveCompanyIdFromCookie } from 'src/lib/company-api';

// ----------------------------------------------------------------------

function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUsername(value) {
  if (!value) return true;
  return /^[a-z0-9_-]+$/.test(value);
}

// ----------------------------------------------------------------------

export default function CompanyInfoPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    description: '',
    websiteUrl: '',
    contactEmail: '',
  });
  const [initialData, setInitialData] = useState(null);
  const [companySlug, setCompanySlug] = useState('');

  const activeCompanyId = getActiveCompanyIdFromCookie();

  const validationErrors = useMemo(() => {
    const issues = [];
    if (!formData.name?.trim()) {
      issues.push('Company name is required.');
    }
    if (formData.username) {
      if (formData.username.length < 3) {
        issues.push('Username must be at least 3 characters.');
      }
      if (!isValidUsername(formData.username)) {
        issues.push('Username can only contain lowercase letters, numbers, underscores, and hyphens.');
      }
    }
    if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
      issues.push('Website URL must be a valid http(s) link.');
    }
    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      issues.push('Contact email must be a valid email address.');
    }
    return issues;
  }, [formData.name, formData.username, formData.websiteUrl, formData.contactEmail]);

  const hasChanges = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  const disableSave = saving || !hasChanges || validationErrors.length > 0;

  useEffect(() => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return;
    }
    loadCompanyInfo();
  }, [activeCompanyId]);

  const loadCompanyInfo = async () => {
    try {
      setLoading(true);
      const company = await getCompanyInfo(activeCompanyId);
      if (company) {
        const data = {
          name: company.name || '',
          username: company.username || '',
          description: company.description || '',
          websiteUrl: company.websiteUrl || '',
          contactEmail: company.contactEmail || '',
        };
        setFormData(data);
        setInitialData(data);
        setCompanySlug(company.slug || '');
      }
    } catch (err) {
      console.error('Failed to load company info:', err);
      setError(err.message || 'Failed to load company info');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setSuccess(false);
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!activeCompanyId) {
      setError('No active company selected');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const payload = {
        name: formData.name.trim(),
        username: formData.username?.trim().toLowerCase() || null,
        description: formData.description?.trim() || null,
        websiteUrl: formData.websiteUrl?.trim() || null,
        contactEmail: formData.contactEmail?.trim() || null,
      };

      const updated = await updateCompanyInfo(activeCompanyId, payload);
      if (updated) {
        const data = {
          name: updated.name || '',
          username: updated.username || '',
          description: updated.description || '',
          websiteUrl: updated.websiteUrl || '',
          contactEmail: updated.contactEmail || '',
        };
        setFormData(data);
        setInitialData(data);
        setCompanySlug(updated.slug || '');
      }
      setSuccess(true);
    } catch (err) {
      console.error('Failed to save company info:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save company info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="h-6 w-72 animate-pulse rounded bg-muted" />
        <div className="h-[400px] w-full animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Company Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your company&apos;s basic information and contact details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving || !hasChanges}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={disableSave}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="relative rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <button
            type="button"
            className="absolute right-2 top-2 rounded-sm p-1 text-destructive/70 hover:text-destructive"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Close</span>
            <span className="text-lg leading-none">&times;</span>
          </button>
          {error}
        </div>
      )}
      {success && (
        <div className="relative rounded-md border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <button
            type="button"
            className="absolute right-2 top-2 rounded-sm p-1 text-green-600/70 hover:text-green-700 dark:text-green-400/70 dark:hover:text-green-400"
            onClick={() => setSuccess(false)}
          >
            <span className="sr-only">Close</span>
            <span className="text-lg leading-none">&times;</span>
          </button>
          Company profile updated successfully!
        </div>
      )}
      {validationErrors.length > 0 && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <ul className="my-0 list-disc space-y-1 pl-5">
            {validationErrors.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form */}
      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Company Name */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <label className="text-sm font-medium">Company Name *</label>
            </div>
            <Input
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Enter your company name"
              className={!formData.name?.trim() ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              This is the primary name for your company in the system.
            </p>
          </div>

          {/* Username */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <AtSign className="h-4 w-4" />
              <label className="text-sm font-medium">Username</label>
              <Badge variant="outline" className="h-5 text-[10px]">Unique</Badge>
            </div>
            <Input
              value={formData.username}
              onChange={handleChange('username')}
              placeholder="your-company-username"
              maxLength={30}
              className={
                formData.username && (!isValidUsername(formData.username) || formData.username.length < 3)
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              A unique identifier for your company (3-30 chars, lowercase letters, numbers, underscores, hyphens only).
            </p>
            <div className="mt-3 flex items-start gap-2 rounded-md border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <strong>Important:</strong> Once you publish a blog, your username cannot be changed.
                This ensures your published URLs remain consistent and accessible.
              </p>
            </div>
          </div>

          {/* Slug Info */}
          {companySlug && (
            <div className="rounded-md bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Link className="h-3.5 w-3.5" />
                <span className="text-xs text-muted-foreground">URL Slug:</span>
                <Badge variant="outline">{companySlug}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                The URL slug is automatically generated from your company name and updates when you save changes.
              </p>
            </div>
          )}

          <Separator />

          {/* Description */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <label className="text-sm font-medium">Description</label>
            </div>
            <textarea
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Brief description of your company..."
              maxLength={500}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {formData.description?.length || 0}/500 characters
            </p>
          </div>

          <Separator />

          {/* Website URL */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <label className="text-sm font-medium">Website URL</label>
            </div>
            <Input
              value={formData.websiteUrl}
              onChange={handleChange('websiteUrl')}
              placeholder="https://example.com"
              className={
                formData.websiteUrl && !isValidUrl(formData.websiteUrl)
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Your company&apos;s main website address.
            </p>
          </div>

          {/* Contact Email */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <label className="text-sm font-medium">Contact Email</label>
            </div>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={handleChange('contactEmail')}
              placeholder="contact@example.com"
              className={
                formData.contactEmail && !isValidEmail(formData.contactEmail)
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Primary contact email for your company.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
