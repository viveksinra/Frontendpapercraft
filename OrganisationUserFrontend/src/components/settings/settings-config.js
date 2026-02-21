import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY = 'app-settings';

export const defaultSettings = {
  mode: 'light',
  direction: 'ltr',
  contrast: 'default',
  navLayout: 'vertical',
  primaryColor: 'default',
  navColor: 'integrate',
  compactLayout: true,
  fontSize: 16,
  fontFamily: 'Inter, sans-serif',
  version: CONFIG.appVersion,
};
