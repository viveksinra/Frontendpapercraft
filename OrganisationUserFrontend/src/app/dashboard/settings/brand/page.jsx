'use client';

import { useMemo, useState, useEffect } from 'react';
import { Eye, Type, Code, Check, Image, Tablet, Droplet, Monitor, Loader2, RefreshCw, Smartphone, AlertTriangle } from 'lucide-react';

import { primeTenantBrandTokens } from 'src/lib/tenant-branding';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { getBrandSettings, updateBrandSettings, DEFAULT_BRAND_SETTINGS } from 'src/lib/brand-api';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { useAuthContext } from 'src/auth/hooks';

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
  desktop: { width: '100%', maxWidth: 1200, label: 'Desktop', icon: Monitor },
  tablet: { width: 768, maxWidth: 768, label: 'Tablet', icon: Tablet },
  mobile: { width: 375, maxWidth: 375, label: 'Mobile', icon: Smartphone },
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
    // eslint-disable-next-line no-bitwise
    r: (int >> 16) & 255, // NOSONAR
    // eslint-disable-next-line no-bitwise
    g: (int >> 8) & 255, // NOSONAR
    // eslint-disable-next-line no-bitwise
    b: int & 255, // NOSONAR
  };
}

function hexToRgba(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${alpha})`;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
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
    <div>
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded border-2 border-border overflow-hidden shrink-0">
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
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 font-mono text-[13px]"
        />
      </div>
    </div>
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
    <div
      style={{
        backgroundColor,
        fontFamily,
        minHeight: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Navigation Header */}
      <div
        className="flex items-center justify-between gap-4"
        style={{
          padding: isMobile ? '12px 16px' : '12px 24px',
          borderBottom: `1px solid ${hexToRgba(textColor, 0.1)}`,
        }}
      >
        <div className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt="Logo"
              style={{
                height: isMobile ? 28 : 36,
                maxWidth: isMobile ? 80 : 120,
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded"
              style={{
                width: isMobile ? 28 : 36,
                height: isMobile ? 28 : 36,
                backgroundColor: primaryColor,
                color: '#fff',
                fontWeight: 700,
                fontSize: isMobile ? 14 : 16,
                fontFamily: headingFont,
              }}
            >
              {(displayName || 'Co')[0]}
            </div>
          )}
          {!isMobile && (
            <span
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: textColor,
                fontFamily: headingFont,
              }}
            >
              {displayName || 'Company'}
            </span>
          )}
        </div>
        <div className="flex items-center" style={{ gap: isMobile ? 8 : 16 }}>
          {!isMobile && (
            <>
              <span style={{ fontSize: 13, color: hexToRgba(textColor, 0.7), fontFamily, cursor: 'pointer' }}>
                Features
              </span>
              <span style={{ fontSize: 13, color: hexToRgba(textColor, 0.7), fontFamily, cursor: 'pointer' }}>
                Pricing
              </span>
            </>
          )}
          <div
            className="rounded"
            style={{
              padding: isMobile ? '4px 12px' : '4px 16px',
              backgroundColor: primaryColor,
              color: '#fff',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 600,
              fontFamily,
            }}
          >
            Get Started
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="text-center"
        style={{
          padding: isMobile ? '24px 16px' : isTablet ? '32px 24px' : '40px 32px',
        }}
      >
        <p
          style={{
            fontWeight: 800,
            fontSize: isMobile ? 24 : isTablet ? 32 : 40,
            color: textColor,
            fontFamily: headingFont,
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          {displayName || 'Your Brand'} Headline
        </p>
        {tagline && (
          <p
            style={{
              fontSize: isMobile ? 13 : 15,
              color: hexToRgba(textColor, 0.7),
              fontFamily,
              marginBottom: 24,
              maxWidth: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {tagline}
          </p>
        )}
        <div
          className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-3 mb-6`}
        >
          <div
            className="inline-block rounded"
            style={{
              padding: isMobile ? '8px 16px' : '8px 24px',
              backgroundColor: primaryColor,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              fontFamily,
            }}
          >
            Primary Action
          </div>
          <div
            className="inline-block rounded"
            style={{
              padding: isMobile ? '8px 16px' : '8px 24px',
              backgroundColor: 'transparent',
              border: `1px solid ${secondaryColor}`,
              color: secondaryColor,
              fontSize: 14,
              fontWeight: 600,
              fontFamily,
            }}
          >
            Learn More
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: isMobile ? '0 16px 24px' : '0 24px 24px' }}>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
          {[
            { title: 'Feature One', desc: 'Brief description of feature value.' },
            { title: 'Feature Two', desc: 'Another key benefit explained.' },
            { title: 'Feature Three', desc: 'Third compelling feature point.' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="rounded-lg h-full"
              style={{
                padding: isMobile ? 12 : 16,
                backgroundColor: surfaceColor,
              }}
            >
              <div
                className="flex items-center justify-center rounded mb-2"
                style={{
                  width: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                  backgroundColor: hexToRgba(accentColor, 0.15),
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: isMobile ? 12 : 14,
                    height: isMobile ? 12 : 14,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: isMobile ? 13 : 14,
                  color: textColor,
                  fontFamily: headingFont,
                  marginBottom: 4,
                }}
              >
                {feature.title}
              </p>
              <p
                style={{
                  fontSize: isMobile ? 11 : 12,
                  color: hexToRgba(textColor, 0.65),
                  fontFamily,
                  lineHeight: 1.4,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex justify-between items-center flex-wrap gap-2"
        style={{
          padding: isMobile ? '16px' : '16px 24px',
          borderTop: `1px solid ${hexToRgba(textColor, 0.1)}`,
        }}
      >
        <span style={{ fontSize: 11, color: hexToRgba(textColor, 0.5), fontFamily }}>
          &copy; 2024 {displayName || 'Company'}
        </span>
        <div className="flex gap-1">
          {[primaryColor, secondaryColor, accentColor].map((color, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                width: 16,
                height: 16,
                backgroundColor: color,
                border: `1px solid ${hexToRgba(textColor, 0.15)}`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DevicePreviewPanel({ settings, deviceType, onDeviceChange }) {
  const device = DEVICE_PRESETS[deviceType];
  const previewWidth = typeof device.width === 'number' ? device.width : '100%';

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40 shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="h-[18px] w-[18px]" />
          <span className="text-sm font-semibold">Live Preview</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            {typeof device.width === 'number' ? `${device.width}px` : 'Full Width'}
          </span>
          <div className="flex items-center border rounded-md overflow-hidden">
            {Object.entries(DEVICE_PRESETS).map(([key, preset]) => {
              const Icon = preset.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onDeviceChange(key)}
                  title={preset.label}
                  className={`px-3 py-1.5 flex items-center justify-center border-r last:border-r-0 transition-colors ${
                    deviceType === key
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Device Frame Container */}
      <div className="flex-1 overflow-auto flex justify-center p-4 bg-black/[0.03] dark:bg-black/20">
        {/* Device Frame */}
        <div
          className={`bg-background border border-border overflow-hidden flex flex-col shadow-lg transition-all duration-300 ease-in-out ${
            deviceType === 'mobile' ? 'rounded-2xl' : deviceType === 'tablet' ? 'rounded-xl' : 'rounded-md'
          }`}
          style={{
            width: previewWidth,
            maxWidth: device.maxWidth,
            minHeight: 500,
          }}
        >
          {/* Browser Chrome (minimal) */}
          <div className="h-8 bg-black/[0.04] dark:bg-white/[0.05] border-b border-border flex items-center px-3 gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28c840' }} />
            <div className="flex-1 ml-2 h-[18px] rounded bg-black/[0.06] dark:bg-white/[0.08] flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground font-mono">yoursite.com</span>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto">
            <PreviewContent
              settings={settings}
              deviceWidth={typeof device.width === 'number' ? device.width : 1200}
            />
          </div>
        </div>
      </div>
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
  const [activeTab, setActiveTab] = useState('identity');
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
        `Primary \u2194 Background contrast (${contrastStats.primaryVsBackground.toFixed(2)}:1) is below the recommended ${MIN_BUTTON_CONTRAST}:1 for buttons.`
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
      <div className="flex flex-col gap-6 p-4 md:p-6" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="h-10 w-48 animate-pulse bg-muted rounded" />
        <div className="h-6 w-72 animate-pulse bg-muted rounded" />
        <div className="flex gap-6 flex-1">
          <div className="flex-1 min-w-0">
            <div className="animate-pulse bg-muted rounded min-h-[500px] h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="animate-pulse bg-muted rounded min-h-[500px] h-full" />
          </div>
        </div>
      </div>
    );
  }

  const fontSelectGroups = Object.entries(
    FONT_OPTIONS.reduce((acc, font) => {
      if (!acc[font.category]) acc[font.category] = [];
      acc[font.category].push(font);
      return acc;
    }, {})
  );

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Brand Settings</h1>
          <p className="text-sm text-muted-foreground">
            Customize your brand identity and see changes in real-time across different devices.
          </p>
        </div>
        <div className="flex gap-2">
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
        <div className="flex items-center justify-between gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-4 py-3 text-sm shrink-0">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-destructive hover:opacity-70 font-bold text-lg leading-none">&times;</button>
        </div>
      )}
      {success && (
        <div className="flex items-center justify-between gap-2 bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 rounded-md px-4 py-3 text-sm shrink-0">
          <span>Brand settings saved successfully!</span>
          <button type="button" onClick={() => setSuccess(false)} className="hover:opacity-70 font-bold text-lg leading-none">&times;</button>
        </div>
      )}
      {validationErrors.length > 0 && (
        <div className="flex items-start gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-4 py-3 text-sm shrink-0">
          <AlertTriangle className="h-[18px] w-[18px] mt-0.5 shrink-0" />
          <ul className="list-disc pl-4 space-y-1">
            {validationErrors.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      {qaWarnings.length > 0 && (
        <div className="flex items-start gap-2 bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 rounded-md px-4 py-3 text-sm shrink-0">
          <AlertTriangle className="h-[18px] w-[18px] mt-0.5 shrink-0" />
          <ul className="list-disc pl-4 space-y-1">
            {qaWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content - Stable 50/50 Split using Flexbox */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Form Panel - Fixed 50% width */}
        <div className="w-full lg:w-1/2 lg:flex-none flex flex-col min-h-[400px] lg:min-h-0 lg:h-full min-w-0">
          <Card className="flex-1 overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2 pt-1 h-auto shrink-0">
                <TabsTrigger value="identity" className="gap-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2.5 text-[13px]">
                  <Image className="h-3.5 w-3.5" />
                  Identity
                </TabsTrigger>
                <TabsTrigger value="colors" className="gap-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2.5 text-[13px]">
                  <Droplet className="h-3.5 w-3.5" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="typography" className="gap-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2.5 text-[13px]">
                  <Type className="h-3.5 w-3.5" />
                  Typography
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2.5 text-[13px]">
                  <Code className="h-3.5 w-3.5" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto p-6">
                {/* Identity Tab */}
                <TabsContent value="identity" className="mt-0 space-y-6">
                  <div>
                    <label className="text-sm font-semibold block mb-1.5">Display Name</label>
                    <Input
                      value={formData.displayName}
                      onChange={handleChange('displayName')}
                      placeholder="Your Company Name"
                    />
                    <p className="text-xs text-muted-foreground mt-1">How your company name appears on generated pages</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-1.5">Tagline</label>
                    <Input
                      value={formData.tagline}
                      onChange={handleChange('tagline')}
                      placeholder="Your company tagline or motto"
                    />
                    <p className="text-xs text-muted-foreground mt-1">A short phrase that describes your brand</p>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-semibold block mb-1.5">Logo URL</label>
                    <Input
                      value={formData.logo}
                      onChange={handleChange('logo')}
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-muted-foreground mt-1">PNG, SVG, or WebP recommended</p>
                    {formData.logo && (
                      <div className="mt-3 p-3 bg-muted rounded flex items-center gap-4">
                        <img
                          src={formData.logo}
                          alt="Logo preview"
                          className="max-w-[120px] max-h-[40px] object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-1.5">Favicon URL</label>
                    <Input
                      value={formData.favicon}
                      onChange={handleChange('favicon')}
                      placeholder="https://example.com/favicon.ico"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Browser tab icon</p>
                  </div>
                </TabsContent>

                {/* Colors Tab */}
                <TabsContent value="colors" className="mt-0 space-y-6">
                  <div>
                    <label className="text-sm font-semibold block mb-2">Quick Presets</label>
                    <div className="flex flex-wrap gap-2">
                      {THEME_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-background text-xs font-medium hover:bg-muted transition-colors"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: preset.colors.primaryColor }}
                          />
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-semibold block mb-4">Brand Colors</label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[120px] max-w-[180px]">
                        <ColorInput
                          label="Primary"
                          value={formData.primaryColor}
                          onChange={handleChange('primaryColor')}
                          disabled={saving}
                        />
                      </div>
                      <div className="flex-1 min-w-[120px] max-w-[180px]">
                        <ColorInput
                          label="Secondary"
                          value={formData.secondaryColor}
                          onChange={handleChange('secondaryColor')}
                          disabled={saving}
                        />
                      </div>
                      <div className="flex-1 min-w-[120px] max-w-[180px]">
                        <ColorInput
                          label="Accent"
                          value={formData.accentColor}
                          onChange={handleChange('accentColor')}
                          disabled={saving}
                        />
                      </div>
                    </div>
                    {contrastStats.primaryVsBackground && (
                      <p
                        className={`text-xs mt-2 ${
                          contrastStats.primaryVsBackground < MIN_BUTTON_CONTRAST
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Primary &harr; Background contrast: {contrastStats.primaryVsBackground.toFixed(2)}:1 (recommended &gt;=
                        {MIN_BUTTON_CONTRAST}:1)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-4">Background & Surface</label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[120px] max-w-[180px]">
                        <ColorInput
                          label="Background"
                          value={formData.backgroundColor}
                          onChange={handleChange('backgroundColor')}
                          disabled={saving}
                        />
                      </div>
                      <div className="flex-1 min-w-[120px] max-w-[180px]">
                        <ColorInput
                          label="Surface"
                          value={formData.surfaceColor}
                          onChange={handleChange('surfaceColor')}
                          disabled={saving}
                        />
                      </div>
                      <div className="flex-1 min-w-[120px] max-w-[180px]">
                        <ColorInput
                          label="Text"
                          value={formData.textColor}
                          onChange={handleChange('textColor')}
                          disabled={saving}
                        />
                      </div>
                    </div>
                    {contrastStats.textVsBackground && (
                      <p
                        className={`text-xs mt-2 ${
                          contrastStats.textVsBackground < MIN_TEXT_CONTRAST
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Text &harr; Background contrast: {contrastStats.textVsBackground.toFixed(2)}:1 (recommended &gt;=
                        {MIN_TEXT_CONTRAST}:1)
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Typography Tab */}
                <TabsContent value="typography" className="mt-0 space-y-6">
                  <div>
                    <label className="text-sm font-semibold block mb-1.5">Body Font</label>
                    <select
                      value={formData.fontFamily}
                      onChange={handleChange('fontFamily')}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {fontSelectGroups.map(([category, fonts]) => (
                        <optgroup key={category} label={category}>
                          {fonts.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div
                      className="mt-3 p-3 bg-muted rounded"
                      style={{ fontFamily: formData.fontFamily }}
                    >
                      <p className="text-[13px]" style={{ fontFamily: 'inherit' }}>
                        The quick brown fox jumps over the lazy dog.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-1.5">Heading Font</label>
                    <select
                      value={formData.headingFont}
                      onChange={handleChange('headingFont')}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {fontSelectGroups.map(([category, fonts]) => (
                        <optgroup key={category} label={category}>
                          {fonts.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="mt-3 p-3 bg-muted rounded">
                      <p
                        className="text-lg font-bold"
                        style={{ fontFamily: formData.headingFont }}
                      >
                        Heading Preview
                      </p>
                      <p
                        className="text-sm font-semibold mt-1"
                        style={{ fontFamily: formData.headingFont }}
                      >
                        Subheading Preview
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="mt-0 space-y-6">
                  <div className="flex items-start gap-2 bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 rounded-md px-4 py-2 text-sm">
                    Custom CSS for advanced styling. Use with caution.
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-1.5">Custom CSS</label>
                    <textarea
                      value={formData.customCss}
                      onChange={handleChange('customCss')}
                      rows={10}
                      placeholder={`/* Custom CSS */\n.hero-section {\n  padding: 4rem 2rem;\n}`}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono text-xs leading-relaxed resize-y"
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>

        {/* Preview Panel - Fixed 50% width */}
        <div className="w-full lg:w-1/2 lg:flex-none flex flex-col h-[500px] lg:h-full min-w-0">
          <DevicePreviewPanel
            settings={formData}
            deviceType={deviceType}
            onDeviceChange={setDeviceType}
          />
        </div>
      </div>
    </div>
  );
}
