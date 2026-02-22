import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:2040';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('jwt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.variant && response.data?.myData) {
      if (response.data.myData.accessToken) {
        response.data.accessToken = response.data.myData.accessToken;
      }
      response.data = { ...response.data, ...response.data.myData };
    }
    return response;
  },
  (error) => {
    const errorData = error?.response?.data;
    let message = 'Something went wrong!';
    if (errorData?.message) message = errorData.message;
    else if (error?.message) message = error.message;
    const enhancedError = new Error(message);
    (enhancedError as any).status = error?.response?.status;
    (enhancedError as any).response = error?.response;

    // On 401, redirect to login (unless already on auth page)
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (!path.startsWith('/auth')) {
        window.location.href = '/auth/sign-in';
      }
    }

    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;

export const endpoints = {
  auth: {
    me: '/api/v2/auth/me',
    signIn: '/api/v2/auth/login',
    signUp: '/api/v2/auth/signup',
    studentSignup: '/api/v2/auth/student/signup',
    studentJoinOrg: '/api/v2/auth/student/join-org',
    parentSignup: '/api/v2/auth/parent/signup',
  },
  student: {
    profile: '/api/v2/student/profile',
    dashboard: '/api/v2/student/dashboard',
    tests: '/api/v2/student/tests',
    results: '/api/v2/student/results',
    performance: '/api/v2/student/performance',
  },
  parent: {
    linkChild: '/api/v2/parent/link-child',
    createChild: '/api/v2/parent/create-child',
    unlinkChild: '/api/v2/parent/unlink-child',
    children: '/api/v2/parent/children',
    dashboard: '/api/v2/parent/dashboard',
  },
  testTaking: {
    start: '/api/v2/tests',
    attempt: '/api/v2/tests',
  },
  studentHomework: {
    list: '/api/v2/student/homework',
    detail: (hwId: string) => `/api/v2/student/homework/${hwId}`,
    submit: (hwId: string) => `/api/v2/student/homework/${hwId}/submit`,
  },
  studentAnnouncements: {
    list: '/api/v2/student/announcements',
  },
  // Phase 6: Store, Checkout, Purchases
  catalog: {
    list: (companyId: string) => `/api/v2/companies/${companyId}/catalog`,
    detail: (companyId: string, productId: string) => `/api/v2/companies/${companyId}/catalog/${productId}`,
  },
  checkout: {
    createSession: '/api/v2/checkout/create-session',
    verify: (sessionId: string) => `/api/v2/checkout/verify/${sessionId}`,
    freeAccess: '/api/v2/checkout/free-access',
  },
  studentPurchases: {
    list: '/api/v2/student/purchases',
    access: (refType: string, refId: string) => `/api/v2/student/access/${refType}/${refId}`,
  },
  parentPurchases: {
    list: '/api/v2/parent/purchases',
  },
  // Phase 8: Course Builder
  courseCatalog: {
    browse: (companyId: string) => `/api/v2/companies/${companyId}/catalog`,
    detail: (companyId: string, courseSlugOrId: string) =>
      `/api/v2/companies/${companyId}/catalog/${courseSlugOrId}`,
    reviews: (companyId: string, courseSlugOrId: string) =>
      `/api/v2/companies/${companyId}/catalog/${courseSlugOrId}/reviews`,
  },
  courseEnrollment: {
    enroll: (courseId: string) => `/api/v2/courses/${courseId}/enroll`,
    myEnrollments: '/api/v2/courses/my-enrollments',
    progress: (courseId: string) => `/api/v2/courses/${courseId}/progress`,
    complete: (courseId: string) => `/api/v2/courses/${courseId}/complete`,
    incomplete: (courseId: string) => `/api/v2/courses/${courseId}/incomplete`,
    trackTime: (courseId: string) => `/api/v2/courses/${courseId}/track-time`,
    content: (courseId: string, sectionId: string, lessonId: string) =>
      `/api/v2/courses/${courseId}/content/${sectionId}/${lessonId}`,
    rate: (courseId: string) => `/api/v2/courses/${courseId}/rate`,
    drop: (courseId: string) => `/api/v2/courses/${courseId}/drop`,
    currentLesson: (courseId: string) => `/api/v2/courses/${courseId}/current-lesson`,
  },
  certificates: {
    myCertificates: '/api/v2/certificates/my-certificates',
    get: (enrollmentId: string) => `/api/v2/certificates/${enrollmentId}`,
    download: (enrollmentId: string) => `/api/v2/certificates/${enrollmentId}/download`,
  },
  parentCourses: {
    childCourses: (childId: string) => `/api/v2/parent/children/${childId}/courses`,
    childProgress: (childId: string, courseId: string) =>
      `/api/v2/parent/children/${childId}/courses/${courseId}/progress`,
    enrollChild: (childId: string, courseId: string) =>
      `/api/v2/parent/children/${childId}/courses/${courseId}/enroll`,
    childCertificates: (childId: string) =>
      `/api/v2/parent/children/${childId}/certificates`,
  },
  // Phase 7: Analytics & Reporting
  studentAnalytics: {
    analytics: '/api/v2/student/analytics',
    scoreTrend: '/api/v2/student/analytics/score-trend',
    subjectRadar: '/api/v2/student/analytics/subject-radar',
    elevenPlus: '/api/v2/student/analytics/eleven-plus',
    reports: '/api/v2/student/reports',
    downloadReport: (reportId: string) => `/api/v2/student/reports/${reportId}/download`,
    topicDrilldown: (subjectId: string) => `/api/v2/student/analytics/topic-drilldown/${subjectId}`,
  },
};
