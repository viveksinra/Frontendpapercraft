import 'src/global.css';

import { CONFIG } from 'src/global-config';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsProvider, defaultSettings } from 'src/components/settings';
import { detectSettings } from 'src/components/settings/server';

import { AuthProvider } from 'src/auth/context/jwt';

import { Toaster } from '@/components/ui/sonner';

// ----------------------------------------------------------------------

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'PaperCraft - Assessment Platform',
  description: 'PaperCraft Organisation Dashboard',
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

// ----------------------------------------------------------------------

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  }
  const [settings] = await Promise.all([detectSettings()]);
  return {
    cookieSettings: settings,
    dir: settings.direction,
  };
}

export default async function RootLayout({ children }) {
  const appConfig = await getAppConfig();

  return (
    <html lang="en" dir={appConfig.dir} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <AuthProvider>
          <SettingsProvider
            cookieSettings={appConfig.cookieSettings}
            defaultSettings={defaultSettings}
          >
            <MotionLazy>
              <ProgressBar />
              <Toaster />
              {children}
            </MotionLazy>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
