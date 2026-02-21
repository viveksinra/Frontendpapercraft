import { CONFIG } from 'src/global-config';
import LaunchpadView from 'src/sections/launchpad/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <LaunchpadView />;
}
