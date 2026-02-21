import { describe, it, expect } from 'vitest';

import { buildLaunchpadSteps, getLaunchpadProgress } from 'src/sections/launchpad/utils';
import { paths } from 'src/routes/paths';

describe('Launchpad utilities', () => {
  it('computes checklist progress from status flags', () => {
    expect(getLaunchpadProgress(null)).toBe(0);
    expect(
      getLaunchpadProgress({
        brandingReady: true,
        datasetReady: false,
        pairingReady: false,
        sampleProjectReady: false,
      })
    ).toBe(25);
    expect(
      getLaunchpadProgress({
        brandingReady: true,
        datasetReady: true,
        pairingReady: false,
        sampleProjectReady: false,
      })
    ).toBe(50);
    expect(
      getLaunchpadProgress({
        brandingReady: true,
        datasetReady: true,
        pairingReady: true,
        sampleProjectReady: false,
      })
    ).toBe(75);
    expect(
      getLaunchpadProgress({
        brandingReady: true,
        datasetReady: true,
        pairingReady: true,
        sampleProjectReady: true,
      })
    ).toBe(100);
  });

  it('creates four onboarding steps with expected routes', () => {
    const steps = buildLaunchpadSteps({
      status: {
        brandingReady: false,
        datasetReady: false,
        pairingReady: false,
        sampleProjectReady: false,
      },
      paths,
      basePathLabel: '/demo/blog',
    });
    expect(steps).toHaveLength(4);
    const [branding, dataset, pairing, draft] = steps;
    expect(branding.actionPath).toBe(paths.dashboard.settings.brand);
    expect(dataset.actionPath).toBe(paths.dashboard.dataSources);
    expect(pairing.actionPath).toBe(paths.dashboard.templatePairing);
    expect(draft.actionPath).toBe(paths.dashboard.generation);
    expect(draft.tooltip).toContain('/demo/blog');
  });
});


