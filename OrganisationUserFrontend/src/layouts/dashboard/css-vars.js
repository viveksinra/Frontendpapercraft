// Dashboard layout CSS variables (no MUI dependency)
export function dashboardLayoutVars() {
  return {
    '--layout-transition-easing': 'linear',
    '--layout-transition-duration': '120ms',
    '--layout-nav-mini-width': '88px',
    '--layout-nav-vertical-width': '280px',
    '--layout-nav-horizontal-height': '64px',
    '--layout-dashboard-content-pt': '8px',
    '--layout-dashboard-content-pb': '64px',
    '--layout-dashboard-content-px': '40px',
  };
}

export function dashboardNavColorVars() {
  // Simplified — we use Tailwind theme colors now
  return {
    layout: {},
    section: undefined,
  };
}
