// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // INVITE
  invite: (code) => `/invite/${code}`,
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
      company: `${ROOTS.DASHBOARD}/settings/company`,
      brand: `${ROOTS.DASHBOARD}/settings/brand`,
      members: `${ROOTS.DASHBOARD}/settings/members`,
    },
    analytics: `${ROOTS.DASHBOARD}/analytics`,
  },
};
