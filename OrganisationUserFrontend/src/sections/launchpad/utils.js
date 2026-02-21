export function getLaunchpadProgress(status) {
  if (!status) return 0;
  const steps = [status.brandingReady, status.settingsReady];
  const complete = steps.filter(Boolean).length;
  return Math.round((complete / steps.length) * 100);
}

export function buildLaunchpadSteps({ status, paths }) {
  return [
    {
      key: 'branding',
      title: 'Brand defaults',
      description: 'Configure your company branding, logo, and color palette.',
      actionLabel: 'Review branding',
      actionPath: paths.dashboard.settings.brand,
      done: Boolean(status?.brandingReady),
      tooltip: 'Set logo, palette, and typography for your assessment papers.',
    },
  ];
}
