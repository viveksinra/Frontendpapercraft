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
    onlineTests: {
      root: `${ROOTS.DASHBOARD}/online-tests`,
      create: `${ROOTS.DASHBOARD}/online-tests/create`,
      detail: (id) => `${ROOTS.DASHBOARD}/online-tests/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/online-tests/${id}/edit`,
      monitor: (id) => `${ROOTS.DASHBOARD}/online-tests/${id}/monitor`,
      results: (id) => `${ROOTS.DASHBOARD}/online-tests/${id}/results`,
      grading: (id) => `${ROOTS.DASHBOARD}/online-tests/${id}/grading`,
    },
    testTaking: {
      take: (id) => `${ROOTS.DASHBOARD}/take-test/${id}`,
      result: (id) => `${ROOTS.DASHBOARD}/take-test/${id}/result`,
    },
    students: {
      root: `${ROOTS.DASHBOARD}/students`,
      profile: (id) => `${ROOTS.DASHBOARD}/students/${id}`,
    },
    tests: `${ROOTS.DASHBOARD}/tests`,
    classes: {
      root: `${ROOTS.DASHBOARD}/classes`,
      create: `${ROOTS.DASHBOARD}/classes/create`,
      detail: (id) => `${ROOTS.DASHBOARD}/classes/${id}`,
    },
    homework: {
      root: `${ROOTS.DASHBOARD}/homework`,
      create: `${ROOTS.DASHBOARD}/homework/create`,
      detail: (id) => `${ROOTS.DASHBOARD}/homework/${id}`,
    },
    announcements: {
      root: `${ROOTS.DASHBOARD}/announcements`,
      create: `${ROOTS.DASHBOARD}/announcements/create`,
    },
    fees: {
      root: `${ROOTS.DASHBOARD}/fees`,
    },
    // Phase 6: Payments & Monetization
    products: {
      root: `${ROOTS.DASHBOARD}/products`,
      create: `${ROOTS.DASHBOARD}/products/create`,
      detail: (id) => `${ROOTS.DASHBOARD}/products/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/products/${id}/edit`,
    },
    revenue: {
      root: `${ROOTS.DASHBOARD}/revenue`,
    },
    analytics: `${ROOTS.DASHBOARD}/analytics`,
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
      company: `${ROOTS.DASHBOARD}/settings/company`,
      brand: `${ROOTS.DASHBOARD}/settings/brand`,
      members: `${ROOTS.DASHBOARD}/settings/members`,
      stripe: `${ROOTS.DASHBOARD}/settings/stripe`,
    },
  },
};
