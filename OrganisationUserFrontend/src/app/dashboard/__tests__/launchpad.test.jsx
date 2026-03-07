import { it, expect, describe } from 'vitest';

import { paths } from 'src/routes/paths';

import { buildLaunchpadSteps, getLaunchpadProgress } from 'src/sections/launchpad/utils';

describe('Launchpad utilities', () => {
  it('computes checklist progress from status flags', () => {
    expect(getLaunchpadProgress(null)).toBe(0);
    expect(
      getLaunchpadProgress({
        brandingReady: true,
        settingsReady: false,
      })
    ).toBe(50);
    expect(
      getLaunchpadProgress({
        brandingReady: true,
        settingsReady: true,
      })
    ).toBe(100);
  });

  it('creates onboarding steps with expected routes', () => {
    const steps = buildLaunchpadSteps({
      status: {
        brandingReady: false,
        settingsReady: false,
      },
      paths,
    });
    expect(steps).toHaveLength(1);
    const [branding] = steps;
    expect(branding.actionPath).toBe(paths.dashboard.settings.brand);
  });
});
