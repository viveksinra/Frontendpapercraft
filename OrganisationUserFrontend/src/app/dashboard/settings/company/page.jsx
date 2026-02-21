'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Skeleton,
} from '@mui/material';
import { FiCheck, FiRefreshCw, FiGlobe, FiMail, FiFileText, FiLink, FiAtSign, FiAlertTriangle } from 'react-icons/fi';
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
      <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={300} height={24} />
        <Skeleton variant="rounded" height={400} />
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Company Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your company&apos;s basic information and contact details.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<FiRefreshCw size={16} />}
            onClick={handleReset}
            disabled={saving || !hasChanges}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <FiCheck size={16} />}
            onClick={handleSubmit}
            disabled={disableSave}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Stack>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Company profile updated successfully!
        </Alert>
      )}
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <Stack component="ul" spacing={0.5} sx={{ my: 0, pl: 2 }}>
            {validationErrors.map((issue) => (
              <Typography component="li" variant="body2" key={issue}>
                {issue}
              </Typography>
            ))}
          </Stack>
        </Alert>
      )}

      {/* Form */}
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Company Name */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <FiFileText size={16} />
              <Typography variant="subtitle2">Company Name *</Typography>
            </Stack>
            <TextField
              fullWidth
              size="small"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Enter your company name"
              helperText="This is the primary name for your company in the system."
              error={!formData.name?.trim()}
            />
          </Box>

          {/* Username */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <FiAtSign size={16} />
              <Typography variant="subtitle2">Username</Typography>
              <Chip label="Unique" size="small" color="info" variant="outlined" sx={{ height: 20, fontSize: 10 }} />
            </Stack>
            <TextField
              fullWidth
              size="small"
              value={formData.username}
              onChange={handleChange('username')}
              placeholder="your-company-username"
              helperText="A unique identifier for your company (3-30 chars, lowercase letters, numbers, underscores, hyphens only)."
              error={formData.username && (!isValidUsername(formData.username) || formData.username.length < 3)}
              inputProps={{ maxLength: 30 }}
            />
            <Alert 
              severity="warning" 
              icon={<FiAlertTriangle size={18} />}
              sx={{ mt: 1.5, py: 0.5 }}
            >
              <Typography variant="body2">
                <strong>Important:</strong> Once you publish a blog, your username cannot be changed. 
                This ensures your published URLs remain consistent and accessible.
              </Typography>
            </Alert>
          </Box>

          {/* Slug Info */}
          {companySlug && (
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FiLink size={14} />
                <Typography variant="caption" color="text.secondary">
                  URL Slug:
                </Typography>
                <Chip label={companySlug} size="small" variant="outlined" />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                The URL slug is automatically generated from your company name and updates when you save changes.
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Description */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <FiFileText size={16} />
              <Typography variant="subtitle2">Description</Typography>
            </Stack>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Brief description of your company..."
              helperText={`${formData.description?.length || 0}/500 characters`}
              inputProps={{ maxLength: 500 }}
            />
          </Box>

          <Divider />

          {/* Website URL */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <FiGlobe size={16} />
              <Typography variant="subtitle2">Website URL</Typography>
            </Stack>
            <TextField
              fullWidth
              size="small"
              value={formData.websiteUrl}
              onChange={handleChange('websiteUrl')}
              placeholder="https://example.com"
              helperText="Your company's main website address."
              error={formData.websiteUrl && !isValidUrl(formData.websiteUrl)}
            />
          </Box>

          {/* Contact Email */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <FiMail size={16} />
              <Typography variant="subtitle2">Contact Email</Typography>
            </Stack>
            <TextField
              fullWidth
              size="small"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange('contactEmail')}
              placeholder="contact@example.com"
              helperText="Primary contact email for your company."
              error={formData.contactEmail && !isValidEmail(formData.contactEmail)}
            />
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}

