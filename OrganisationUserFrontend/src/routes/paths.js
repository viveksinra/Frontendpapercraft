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
    questionBank: `${ROOTS.DASHBOARD}/question-bank`,
    papers: `${ROOTS.DASHBOARD}/papers`,
    tests: `${ROOTS.DASHBOARD}/tests`,
    classes: `${ROOTS.DASHBOARD}/classes`,
    homework: `${ROOTS.DASHBOARD}/homework`,
    analytics: `${ROOTS.DASHBOARD}/analytics`,
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
      company: `${ROOTS.DASHBOARD}/settings/company`,
      brand: `${ROOTS.DASHBOARD}/settings/brand`,
      members: `${ROOTS.DASHBOARD}/settings/members`,
    },
  },
};
