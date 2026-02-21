'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
} from '@mui/material';
import {
  FiCheck,
  FiRefreshCw,
  FiEye,
  FiType,
  FiDroplet,
  FiImage,
  FiCode,
  FiMonitor,
  FiTablet,
  FiSmartphone,
  FiAlertTriangle,
} from 'react-icons/fi';
import { useAuthContext } from 'src/auth/hooks';
import { getBrandSettings, updateBrandSettings, DEFAULT_BRAND_SETTINGS } from 'src/lib/brand-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { primeTenantBrandTokens } from 'src/lib/tenant-branding';

// ----------------------------------------------------------------------

const FONT_OPTIONS = [
  { value: 'Inter, sans-serif', label: 'Inter', category: 'Modern' },
  { value: 'Poppins, sans-serif', label: 'Poppins', category: 'Modern' },
  { value: 'DM Sans, sans-serif', label: 'DM Sans', category: 'Modern' },
  { value: 'Space Grotesk, sans-serif', label: 'Space Grotesk', category: 'Modern' },
  { value: 'Manrope, sans-serif', label: 'Manrope', category: 'Modern' },
  { value: 'Plus Jakarta Sans, sans-serif', label: 'Plus Jakarta Sans', category: 'Modern' },
  { value: 'Outfit, sans-serif', label: 'Outfit', category: 'Modern' },
  { value: 'Roboto, sans-serif', label: 'Roboto', category: 'Classic' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans', category: 'Classic' },
  { value: 'Lato, sans-serif', label: 'Lato', category: 'Classic' },
  { value: 'Source Sans 3, sans-serif', label: 'Source Sans', category: 'Classic' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat', category: 'Display' },
  { value: 'Playfair Display, serif', label: 'Playfair Display', category: 'Serif' },
  { value: 'Merriweather, serif', label: 'Merriweather', category: 'Serif' },
  { value: 'Crimson Pro, serif', label: 'Crimson Pro', category: 'Serif' },
  { value: 'Georgia, serif', label: 'Georgia', category: 'System' },
];

const THEME_PRESETS = [
  {
    name: 'Professional Blue',
    colors: {
      primaryColor: '#1976d2',
      secondaryColor: '#455a64',
      accentColor: '#00bcd4',
      backgroundColor: '#ffffff',
      surfaceColor: '#f8fafc',
      textColor: '#1e293b',
    },
  },
  {
    name: 'Modern Indigo',
    colors: {
      primaryColor: '#4f46e5',
      secondaryColor: '#7c3aed',
      accentColor: '#06b6d4',
      backgroundColor: '#ffffff',
      surfaceColor: '#f5f3ff',
      textColor: '#1e1b4b',
    },
  },
  {
    name: 'Emerald Fresh',
    colors: {
      primaryColor: '#059669',
      secondaryColor: '#0d9488',
      accentColor: '#fbbf24',
      backgroundColor: '#ffffff',
      surfaceColor: '#ecfdf5',
      textColor: '#064e3b',
    },
  },
  {
    name: 'Warm Sunset',
    colors: {
      primaryColor: '#ea580c',
      secondaryColor: '#dc2626',
      accentColor: '#fbbf24',
      backgroundColor: '#fffbeb',
      surfaceColor: '#fef3c7',
      textColor: '#78350f',
    },
  },
  {
    name: 'Elegant Rose',
    colors: {
      primaryColor: '#be185d',
      secondaryColor: '#9333ea',
      accentColor: '#f472b6',
      backgroundColor: '#ffffff',
      surfaceColor: '#fdf2f8',
      textColor: '#831843',
    },
  },
  {
    name: 'Dark Executive',
    colors: {
      primaryColor: '#3b82f6',
      secondaryColor: '#6366f1',
      accentColor: '#22d3ee',
      backgroundColor: '#0f172a',
      surfaceColor: '#1e293b',
      textColor: '#f1f5f9',
    },
  },
];

const DEVICE_PRESETS = {
  desktop: { width: '100%', maxWidth: 1200, label: 'Desktop', icon: FiMonitor },
  tablet: { width: 768, maxWidth: 768, label: 'Tablet', icon: FiTablet },
  mobile: { width: 375, maxWidth: 375, label: 'Mobile', icon: FiSmartphone },
};

function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function hexToRgb(hex) {
  if (!hex) return null;
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  if (value.length !== 6) return null;
  const int = Number.parseInt(value, 16);
  if (Number.isNaN(int)) return null;
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function luminance(r, g, b) {
  const channel = (c) => {
    const normalized = c / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  const rLum = channel(r);
  const gLum = channel(g);
  const bLum = channel(b);
  return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
}

function getContrastRatio(colorA, colorB) {
  const first = hexToRgb(colorA);
  const second = hexToRgb(colorB);
  if (!first || !second) return null;
  const lum1 = luminance(first.r, first.g, first.b);
  const lum2 = luminance(second.r, second.g, second.b);
  const [bright, dark] = lum1 >= lum2 ? [lum1, lum2] : [lum2, lum1];
  return (bright + 0.05) / (dark + 0.05);
}

const MIN_BUTTON_CONTRAST = 3;
const MIN_TEXT_CONTRAST = 4.5;

// ----------------------------------------------------------------------

function ColorInput({ label, value, onChange, disabled }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            border: '2px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{
              width: 56,
              height: 56,
              border: 'none',
              cursor: disabled ? 'default' : 'pointer',
              marginTop: -8,
              marginLeft: -8,
            }}
          />
        </Box>
        <TextField
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          sx={{ flex: 1 }}
          inputProps={{ style: { fontFamily: 'monospace', fontSize: 13 } }}
        />
      </Stack>
    </Box>
  );
}

function PreviewContent({ settings, deviceWidth }) {
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    surfaceColor,
    textColor,
    fontFamily,
    headingFont,
    logo,
    displayName,
    tagline,
  } = settings;

  const isMobile = deviceWidth <= 375;
  const isTablet = deviceWidth <= 768 && deviceWidth > 375;

  return (
    <Box
      sx={{
        bgcolor: backgroundColor,
        fontFamily,
        minHeight: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Navigation Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: isMobile ? 2 : 3,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: alpha(textColor, 0.1),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {logo ? (
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: isMobile ? 28 : 36, maxWidth: isMobile ? 80 : 120, objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <Box
              sx={{
                width: isMobile ? 28 : 36,
                height: isMobile ? 28 : 36,
                borderRadius: 1,
                bgcolor: primaryColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: isMobile ? 14 : 16,
                fontFamily: headingFont,
              }}
            >
              {(displayName || 'Co')[0]}
            </Box>
          )}
          {!isMobile && (
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: textColor,
                fontFamily: headingFont,
              }}
            >
              {displayName || 'Company'}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={isMobile ? 1 : 2}>
          {!isMobile && (
            <>
              <Typography sx={{ fontSize: 13, color: alpha(textColor, 0.7), fontFamily, cursor: 'pointer' }}>
                Features
              </Typography>
              <Typography sx={{ fontSize: 13, color: alpha(textColor, 0.7), fontFamily, cursor: 'pointer' }}>
                Pricing
              </Typography>
            </>
          )}
          <Box
            sx={{
              px: isMobile ? 1.5 : 2,
              py: 0.5,
              borderRadius: 1,
              bgcolor: primaryColor,
              color: '#fff',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 600,
              fontFamily,
            }}
          >
            Get Started
          </Box>
        </Stack>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          px: isMobile ? 2 : isTablet ? 3 : 4,
          py: isMobile ? 3 : isTablet ? 4 : 5,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: isMobile ? 24 : isTablet ? 32 : 40,
            color: textColor,
            fontFamily: headingFont,
            mb: 1.5,
            lineHeight: 1.2,
          }}
        >
          {displayName || 'Your Brand'} Headline
        </Typography>
        {tagline && (
          <Typography
            sx={{
              fontSize: isMobile ? 13 : 15,
              color: alpha(textColor, 0.7),
              fontFamily,
              mb: 3,
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            {tagline}
          </Typography>
        )}
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={1.5}
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Box
            sx={{
              px: isMobile ? 2 : 3,
              py: 1,
              borderRadius: 1,
              bgcolor: primaryColor,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              fontFamily,
              display: 'inline-block',
            }}
          >
            Primary Action
          </Box>
          <Box
            sx={{
              px: isMobile ? 2 : 3,
              py: 1,
              borderRadius: 1,
              bgcolor: 'transparent',
              border: '1px solid',
              borderColor: secondaryColor,
              color: secondaryColor,
              fontSize: 14,
              fontWeight: 600,
              fontFamily,
              display: 'inline-block',
            }}
          >
            Learn More
          </Box>
        </Stack>
      </Box>

      {/* Features Section */}
      <Box sx={{ px: isMobile ? 2 : 3, pb: 3 }}>
        <Grid container spacing={isMobile ? 1.5 : 2}>
          {[
            { title: 'Feature One', desc: 'Brief description of feature value.' },
            { title: 'Feature Two', desc: 'Another key benefit explained.' },
            { title: 'Feature Three', desc: 'Third compelling feature point.' },
          ].map((feature, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Box
                sx={{
                  p: isMobile ? 1.5 : 2,
                  borderRadius: 1.5,
                  bgcolor: surfaceColor,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 28 : 32,
                    height: isMobile ? 28 : 32,
                    borderRadius: 1,
                    bgcolor: alpha(accentColor, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: isMobile ? 12 : 14,
                      height: isMobile ? 12 : 14,
                      borderRadius: '50%',
                      bgcolor: accentColor,
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: isMobile ? 13 : 14,
                    color: textColor,
                    fontFamily: headingFont,
                    mb: 0.5,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: isMobile ? 11 : 12,
                    color: alpha(textColor, 0.65),
                    fontFamily,
                    lineHeight: 1.4,
                  }}
                >
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: isMobile ? 2 : 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: alpha(textColor, 0.1),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: 11, color: alpha(textColor, 0.5), fontFamily }}>
          © 2024 {displayName || 'Company'}
        </Typography>
        <Stack direction="row" spacing={0.5}>
          {[primaryColor, secondaryColor, accentColor].map((color, i) => (
            <Box
              key={i}
              sx={{
                width: 16,
                height: 16,
                borderRadius: 0.5,
                bgcolor: color,
                border: '1px solid',
                borderColor: alpha(textColor, 0.15),
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

function DevicePreviewPanel({ settings, deviceType, onDeviceChange }) {
  const device = DEVICE_PRESETS[deviceType];
  const previewWidth = typeof device.width === 'number' ? device.width : '100%';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Preview Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.neutral',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <FiEye size={18} />
          <Typography variant="subtitle2" fontWeight={600}>
            Live Preview
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="caption" color="text.secondary">
            {typeof device.width === 'number' ? `${device.width}px` : 'Full Width'}
          </Typography>
          <ToggleButtonGroup
            value={deviceType}
            exclusive
            onChange={(_, val) => val && onDeviceChange(val)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 1.5,
                py: 0.5,
                border: 1,
                borderColor: 'divider',
              },
            }}
          >
            {Object.entries(DEVICE_PRESETS).map(([key, preset]) => {
              const Icon = preset.icon;
              return (
                <ToggleButton key={key} value={key}>
                  <Tooltip title={preset.label}>
                    <Box sx={{ display: 'flex' }}>
                      <Icon size={16} />
                    </Box>
                  </Tooltip>
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {/* Device Frame Container */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          p: 2,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? alpha('#000', 0.2) : alpha('#000', 0.03),
        }}
      >
        {/* Device Frame */}
        <Box
          sx={{
            width: previewWidth,
            maxWidth: device.maxWidth,
            minHeight: 500,
            bgcolor: 'background.paper',
            borderRadius: deviceType === 'mobile' ? 3 : deviceType === 'tablet' ? 2 : 1,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            boxShadow: (theme) => theme.shadows[8],
            transition: 'all 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Browser Chrome (minimal) */}
          <Box
            sx={{
              height: 32,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? alpha('#fff', 0.05) : alpha('#000', 0.04),
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              gap: 0.75,
              flexShrink: 0,
            }}
          >
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff5f57' }} />
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#febc2e' }} />
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#28c840' }} />
            <Box
              sx={{
                flex: 1,
                ml: 1,
                height: 18,
                borderRadius: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? alpha('#fff', 0.08) : alpha('#000', 0.06),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  color: 'text.secondary',
                  fontFamily: 'monospace',
                }}
              >
                yoursite.com
              </Typography>
            </Box>
          </Box>

          {/* Preview Content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <PreviewContent
              settings={settings}
              deviceWidth={typeof device.width === 'number' ? device.width : 1200}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

export default function BrandSettingsPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [deviceType, setDeviceType] = useState('desktop');

  const [formData, setFormData] = useState({ ...DEFAULT_BRAND_SETTINGS });
  const [initialData, setInitialData] = useState(null);

  const activeCompanyId = getActiveCompanyIdFromCookie();

  const contrastStats = useMemo(
    () => ({
      primaryVsBackground: getContrastRatio(formData.primaryColor, formData.backgroundColor),
      textVsBackground: getContrastRatio(formData.textColor, formData.backgroundColor),
    }),
    [formData.primaryColor, formData.backgroundColor, formData.textColor]
  );

  const validationErrors = useMemo(() => {
    const issues = [];
    if (formData.logo && !isValidUrl(formData.logo)) {
      issues.push('Logo URL must be a valid http(s) link.');
    }
    if (formData.favicon && !isValidUrl(formData.favicon)) {
      issues.push('Favicon URL must be a valid http(s) link.');
    }
    return issues;
  }, [formData.logo, formData.favicon]);

  const qaWarnings = useMemo(() => {
    const warnings = [];
    if (!formData.logo) {
      warnings.push('Add a logo so headers, OG cards, and schema stay on-brand.');
    }
    if (!formData.displayName) {
      warnings.push('Provide a display name so templates inherit your brand name.');
    }
    if (contrastStats.primaryVsBackground && contrastStats.primaryVsBackground < MIN_BUTTON_CONTRAST) {
      warnings.push(
        `Primary ↔ Background contrast (${contrastStats.primaryVsBackground.toFixed(2)}:1) is below the recommended ${MIN_BUTTON_CONTRAST}:1 for buttons.`
      );
    }
    if (contrastStats.textVsBackground && contrastStats.textVsBackground < MIN_TEXT_CONTRAST) {
      warnings.push(
        `Body text contrast (${contrastStats.textVsBackground.toFixed(2)}:1) is below WCAG AA (${MIN_TEXT_CONTRAST}:1).`
      );
    }
    return warnings;
  }, [formData.logo, formData.displayName, contrastStats.primaryVsBackground, contrastStats.textVsBackground]);

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
    loadBrandSettings();
  }, [activeCompanyId]);

  useEffect(() => {
    if (initialData && activeCompanyId) {
      primeTenantBrandTokens({ ...initialData, tenantId: activeCompanyId });
    }
  }, [initialData, activeCompanyId]);

  const loadBrandSettings = async () => {
    try {
      setLoading(true);
      const settings = await getBrandSettings(activeCompanyId);
      const merged = settings || { ...DEFAULT_BRAND_SETTINGS };
      setFormData(merged);
      setInitialData(merged);
    } catch (err) {
      console.error('Failed to load brand settings:', err);
      setError(err.message || 'Failed to load brand settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (value) => {
    const newValue = typeof value === 'object' && value.target ? value.target.value : value;
    setFormData((prev) => ({ ...prev, [field]: newValue }));
    setSuccess(false);
  };

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({ ...prev, ...preset.colors }));
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

      const saved = await updateBrandSettings(activeCompanyId, formData);
      setFormData(saved);
      setInitialData(saved);
      setSuccess(true);
    } catch (err) {
      console.error('Failed to save brand settings:', err);
      setError(err.message || 'Failed to save brand settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Stack spacing={3} sx={{ p: { xs: 2, md: 3 }, height: 'calc(100vh - 120px)' }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={300} height={24} />
        <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="rounded" height="100%" sx={{ minHeight: 500 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="rounded" height="100%" sx={{ minHeight: 500 }} />
          </Box>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ p: { xs: 2, md: 3 }, height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} sx={{ flexShrink: 0 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Brand Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customize your brand identity and see changes in real-time across different devices.
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
        <Alert severity="error" onClose={() => setError(null)} sx={{ flexShrink: 0 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ flexShrink: 0 }}>
          Brand settings saved successfully!
        </Alert>
      )}
      {validationErrors.length > 0 && (
        <Alert severity="error" icon={<FiAlertTriangle size={18} />} sx={{ flexShrink: 0 }}>
          <Stack component="ul" spacing={0.5} sx={{ my: 0, pl: 2 }}>
            {validationErrors.map((issue) => (
              <Typography component="li" variant="body2" key={issue}>
                {issue}
              </Typography>
            ))}
          </Stack>
        </Alert>
      )}
      {qaWarnings.length > 0 && (
        <Alert severity="warning" icon={<FiAlertTriangle size={18} />} sx={{ flexShrink: 0 }}>
          <Stack component="ul" spacing={0.5} sx={{ my: 0, pl: 2 }}>
            {qaWarnings.map((warning) => (
              <Typography component="li" variant="body2" key={warning}>
                {warning}
              </Typography>
            ))}
          </Stack>
        </Alert>
      )}

      {/* Main Content - Stable 50/50 Split using Flexbox */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {/* Form Panel - Fixed 50% width */}
        <Box
          sx={{
            flex: { xs: 'none', lg: '0 0 50%' },
            width: { xs: '100%', lg: '50%' },
            minWidth: 0,
            maxWidth: { lg: '50%' },
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 'auto', lg: '100%' },
            minHeight: { xs: 400, lg: 'auto' },
          }}
        >
          <Card sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                px: 2,
                pt: 1,
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': { minHeight: 48, fontSize: 13 },
                flexShrink: 0,
              }}
            >
              <Tab icon={<FiImage size={14} />} iconPosition="start" label="Identity" />
              <Tab icon={<FiDroplet size={14} />} iconPosition="start" label="Colors" />
              <Tab icon={<FiType size={14} />} iconPosition="start" label="Typography" />
              <Tab icon={<FiCode size={14} />} iconPosition="start" label="Advanced" />
            </Tabs>

            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              {/* Identity Tab */}
              {activeTab === 0 && (
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Display Name
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.displayName}
                      onChange={handleChange('displayName')}
                      placeholder="Your Company Name"
                      helperText="How your company name appears on generated pages"
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Tagline
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.tagline}
                      onChange={handleChange('tagline')}
                      placeholder="Your company tagline or motto"
                      helperText="A short phrase that describes your brand"
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Logo URL
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.logo}
                      onChange={handleChange('logo')}
                      placeholder="https://example.com/logo.png"
                      helperText="PNG, SVG, or WebP recommended"
                    />
                    {formData.logo && (
                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1.5,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={formData.logo}
                          alt="Logo preview"
                          sx={{
                            maxWidth: 120,
                            maxHeight: 40,
                            objectFit: 'contain',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Favicon URL
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.favicon}
                      onChange={handleChange('favicon')}
                      placeholder="https://example.com/favicon.ico"
                      helperText="Browser tab icon"
                    />
                  </Box>
                </Stack>
              )}

              {/* Colors Tab */}
              {activeTab === 1 && (
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Quick Presets
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {THEME_PRESETS.map((preset) => (
                        <Chip
                          key={preset.name}
                          label={preset.name}
                          size="small"
                          onClick={() => handleApplyPreset(preset)}
                          sx={{
                            '&:hover': { opacity: 0.9 },
                            '&::before': {
                              content: '""',
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: preset.colors.primaryColor,
                              mr: 0.5,
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Brand Colors
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 120px', minWidth: 120, maxWidth: 180 }}>
                        <ColorInput
                          label="Primary"
                          value={formData.primaryColor}
                          onChange={handleChange('primaryColor')}
                          disabled={saving}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 120px', minWidth: 120, maxWidth: 180 }}>
                        <ColorInput
                          label="Secondary"
                          value={formData.secondaryColor}
                          onChange={handleChange('secondaryColor')}
                          disabled={saving}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 120px', minWidth: 120, maxWidth: 180 }}>
                        <ColorInput
                          label="Accent"
                          value={formData.accentColor}
                          onChange={handleChange('accentColor')}
                          disabled={saving}
                        />
                      </Box>
                    </Stack>
                    {contrastStats.primaryVsBackground && (
                      <Typography
                        variant="caption"
                        color={
                          contrastStats.primaryVsBackground < MIN_BUTTON_CONTRAST
                            ? 'warning.main'
                            : 'text.secondary'
                        }
                        sx={{ display: 'block', mt: 1 }}
                      >
                        {/* Use &gt;= to avoid JSX parser confusion with raw ">" characters */}
                        Primary ↔ Background contrast: {contrastStats.primaryVsBackground.toFixed(2)}:1 (recommended &gt;=
                        {MIN_BUTTON_CONTRAST}:1)
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Background & Surface
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 120px', minWidth: 120, maxWidth: 180 }}>
                        <ColorInput
                          label="Background"
                          value={formData.backgroundColor}
                          onChange={handleChange('backgroundColor')}
                          disabled={saving}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 120px', minWidth: 120, maxWidth: 180 }}>
                        <ColorInput
                          label="Surface"
                          value={formData.surfaceColor}
                          onChange={handleChange('surfaceColor')}
                          disabled={saving}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 120px', minWidth: 120, maxWidth: 180 }}>
                        <ColorInput
                          label="Text"
                          value={formData.textColor}
                          onChange={handleChange('textColor')}
                          disabled={saving}
                        />
                      </Box>
                    </Stack>
                    {contrastStats.textVsBackground && (
                      <Typography
                        variant="caption"
                        color={
                          contrastStats.textVsBackground < MIN_TEXT_CONTRAST
                            ? 'warning.main'
                            : 'text.secondary'
                        }
                        sx={{ display: 'block', mt: 1 }}
                      >
                        {/* Use &gt;= to avoid JSX parser confusion with raw ">" characters */}
                        Text ↔ Background contrast: {contrastStats.textVsBackground.toFixed(2)}:1 (recommended &gt;=
                        {MIN_TEXT_CONTRAST}:1)
                      </Typography>
                    )}
                  </Box>
                </Stack>
              )}

              {/* Typography Tab */}
              {activeTab === 2 && (
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Body Font
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={formData.fontFamily}
                      onChange={handleChange('fontFamily')}
                      SelectProps={{ native: true }}
                    >
                      {Object.entries(
                        FONT_OPTIONS.reduce((acc, font) => {
                          if (!acc[font.category]) acc[font.category] = [];
                          acc[font.category].push(font);
                          return acc;
                        }, {})
                      ).map(([category, fonts]) => (
                        <optgroup key={category} label={category}>
                          {fonts.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </TextField>
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        fontFamily: formData.fontFamily,
                      }}
                    >
                      <Typography sx={{ fontFamily: 'inherit', fontSize: 13 }}>
                        The quick brown fox jumps over the lazy dog.
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Heading Font
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={formData.headingFont}
                      onChange={handleChange('headingFont')}
                      SelectProps={{ native: true }}
                    >
                      {Object.entries(
                        FONT_OPTIONS.reduce((acc, font) => {
                          if (!acc[font.category]) acc[font.category] = [];
                          acc[font.category].push(font);
                          return acc;
                        }, {})
                      ).map(([category, fonts]) => (
                        <optgroup key={category} label={category}>
                          {fonts.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </TextField>
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: formData.headingFont,
                          fontSize: 18,
                          fontWeight: 700,
                        }}
                      >
                        Heading Preview
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: formData.headingFont,
                          fontSize: 14,
                          fontWeight: 600,
                          mt: 0.5,
                        }}
                      >
                        Subheading Preview
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              )}

              {/* Advanced Tab */}
              {activeTab === 3 && (
                <Stack spacing={3}>
                  <Alert severity="info" sx={{ py: 0.5 }}>
                    Custom CSS for advanced styling. Use with caution.
                  </Alert>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Custom CSS
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={10}
                      value={formData.customCss}
                      onChange={handleChange('customCss')}
                      placeholder={`/* Custom CSS */
.hero-section {
  padding: 4rem 2rem;
}`}
                      inputProps={{
                        style: {
                          fontFamily: 'monospace',
                          fontSize: 12,
                          lineHeight: 1.5,
                        },
                      }}
                    />
                  </Box>
                </Stack>
              )}
            </Box>
          </Card>
        </Box>

        {/* Preview Panel - Fixed 50% width */}
        <Box
          sx={{
            flex: { xs: 'none', lg: '0 0 50%' },
            width: { xs: '100%', lg: '50%' },
            minWidth: 0,
            maxWidth: { lg: '50%' },
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 500, lg: '100%' },
          }}
        >
          <DevicePreviewPanel
            settings={formData}
            deviceType={deviceType}
            onDeviceChange={setDeviceType}
          />
        </Box>
      </Box>
    </Stack>
  );
}
