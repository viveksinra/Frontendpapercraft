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
    papers: {
      root: `${ROOTS.DASHBOARD}/papers`,
      create: `${ROOTS.DASHBOARD}/papers/create`,
      autoGenerate: `${ROOTS.DASHBOARD}/papers/auto-generate`,
      detail: (id) => `${ROOTS.DASHBOARD}/papers/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/papers/${id}/edit`,
      templates: `${ROOTS.DASHBOARD}/papers/templates`,
      blueprints: `${ROOTS.DASHBOARD}/papers/blueprints`,
      sets: `${ROOTS.DASHBOARD}/papers/sets`,
      setDetail: (id) => `${ROOTS.DASHBOARD}/papers/sets/${id}`,
      setCreate: `${ROOTS.DASHBOARD}/papers/sets/create`,
    },
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
