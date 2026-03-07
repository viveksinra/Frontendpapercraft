/**
 * Shared API endpoint constants for the PaperCraft platform.
 *
 * Usage:
 *   import { v2 } from '@papercraft/shared/api/endpoints';
 *   axiosInstance.get(v2.auth.me);
 *   axiosInstance.get(v2.catalog.list('company-id'));
 *
 * These endpoints map 1-to-1 with the backend Express routes under /api/v2.
 */

// ─── Auth ────────────────────────────────────────────────────────────────────

export const auth = {
  me: '/api/v2/auth/me',
  login: '/api/v2/auth/login',
  signup: '/api/v2/auth/signup',
  studentSignup: '/api/v2/auth/student/signup',
  studentJoinOrg: '/api/v2/auth/student/join-org',
  parentSignup: '/api/v2/auth/parent/signup',
} as const;

// ─── Company management ─────────────────────────────────────────────────────

export const companies = {
  list: '/api/v2/companies',
  create: '/api/v2/companies',
  settings: (companyId: string) => `/api/v2/companies/${companyId}/settings`,
  bootstrapStatus: (companyId: string) => `/api/v2/companies/${companyId}/bootstrap-status`,
  select: (companyId: string) => `/api/v2/companies/${companyId}/select`,
  branding: (companyId: string) => `/api/v2/companies/${companyId}/branding`,
  seo: (companyId: string) => `/api/v2/companies/${companyId}/seo`,
  info: (companyId: string) => `/api/v2/companies/${companyId}/info`,
} as const;

export const memberships = {
  list: (companyId: string) => `/api/v2/companies/${companyId}/memberships`,
  invite: (companyId: string) => `/api/v2/companies/${companyId}/memberships/invite`,
  update: (companyId: string, membershipId: string) => `/api/v2/companies/${companyId}/memberships/${membershipId}`,
  remove: (companyId: string, membershipId: string) => `/api/v2/companies/${companyId}/memberships/${membershipId}`,
} as const;

// ─── Test taking ─────────────────────────────────────────────────────────────

export const testTaking = {
  start: (testId: string) => `/api/v2/tests/${testId}/start`,
  attempt: (testId: string) => `/api/v2/tests/${testId}/attempt`,
  answer: (testId: string) => `/api/v2/tests/${testId}/answer`,
  flag: (testId: string) => `/api/v2/tests/${testId}/flag`,
  submit: (testId: string) => `/api/v2/tests/${testId}/submit`,
  result: (testId: string) => `/api/v2/tests/${testId}/result`,
  resultByAttempt: (testId: string, attemptNumber: number) => `/api/v2/tests/${testId}/result/${attemptNumber}`,
  startSection: (testId: string, index: number) => `/api/v2/tests/${testId}/section/${index}/start`,
  sectionStatus: (testId: string, index: number) => `/api/v2/tests/${testId}/section/${index}/status`,
} as const;

// ─── Store & checkout ────────────────────────────────────────────────────────

export const catalog = {
  list: (companyId: string) => `/api/v2/companies/${companyId}/catalog`,
  detail: (companyId: string, productId: string) => `/api/v2/companies/${companyId}/catalog/${productId}`,
} as const;

export const checkout = {
  createSession: '/api/v2/checkout/create-session',
  verify: (sessionId: string) => `/api/v2/checkout/verify/${sessionId}`,
  freeAccess: '/api/v2/checkout/free-access',
} as const;

// ─── Courses ─────────────────────────────────────────────────────────────────

export const courseCatalog = {
  browse: (companyId: string) => `/api/v2/companies/${companyId}/catalog/courses`,
  detail: (companyId: string, courseSlugOrId: string) =>
    `/api/v2/companies/${companyId}/catalog/courses/${courseSlugOrId}`,
  reviews: (companyId: string, courseSlugOrId: string) =>
    `/api/v2/companies/${companyId}/catalog/courses/${courseSlugOrId}/reviews`,
} as const;

export const courseEnrollment = {
  enroll: (courseId: string) => `/api/v2/courses/${courseId}/enroll`,
  myEnrollments: '/api/v2/courses/my-enrollments',
  progress: (courseId: string) => `/api/v2/courses/${courseId}/progress`,
  complete: (courseId: string, lessonId: string) => `/api/v2/courses/${courseId}/lessons/${lessonId}/complete`,
  incomplete: (courseId: string, lessonId: string) => `/api/v2/courses/${courseId}/lessons/${lessonId}/incomplete`,
  trackTime: (courseId: string, lessonId: string) => `/api/v2/courses/${courseId}/lessons/${lessonId}/track-time`,
  content: (courseId: string, lessonId: string) => `/api/v2/courses/${courseId}/lessons/${lessonId}/content`,
  rate: (courseId: string) => `/api/v2/courses/${courseId}/rate`,
  drop: (courseId: string) => `/api/v2/courses/${courseId}/drop`,
  currentLesson: (courseId: string) => `/api/v2/courses/${courseId}/current-lesson`,
} as const;

export const certificates = {
  myCertificates: '/api/v2/certificates/my-certificates',
  get: (courseId: string) => `/api/v2/certificates/courses/${courseId}/certificate`,
  download: (courseId: string) => `/api/v2/certificates/courses/${courseId}/certificate/download`,
  verify: (certificateNumber: string) => `/api/v2/certificates/verify/${certificateNumber}`,
} as const;

// ─── Communication ───────────────────────────────────────────────────────────

export const messages = {
  send: (companyId: string) => `/api/v2/companies/${companyId}/messages`,
  conversations: (companyId: string) => `/api/v2/companies/${companyId}/messages/conversations`,
  conversation: (companyId: string, otherUserId: string) =>
    `/api/v2/companies/${companyId}/messages/conversation/${otherUserId}`,
  conversationRead: (companyId: string, otherUserId: string) =>
    `/api/v2/companies/${companyId}/messages/conversation/${otherUserId}/read`,
  read: (companyId: string, messageId: string) =>
    `/api/v2/companies/${companyId}/messages/${messageId}/read`,
  delete: (companyId: string, messageId: string) =>
    `/api/v2/companies/${companyId}/messages/${messageId}`,
  unreadCount: (companyId: string) => `/api/v2/companies/${companyId}/messages/unread-count`,
  search: (companyId: string) => `/api/v2/companies/${companyId}/messages/search`,
  sent: (companyId: string) => `/api/v2/companies/${companyId}/messages/sent`,
} as const;

export const notifications = {
  list: (companyId: string) => `/api/v2/companies/${companyId}/notifications`,
  unreadCount: (companyId: string) => `/api/v2/companies/${companyId}/notifications/unread-count`,
  read: (companyId: string, notificationId: string) =>
    `/api/v2/companies/${companyId}/notifications/${notificationId}/read`,
  readAll: (companyId: string) => `/api/v2/companies/${companyId}/notifications/read-all`,
  archive: (companyId: string, notificationId: string) =>
    `/api/v2/companies/${companyId}/notifications/${notificationId}`,
} as const;

export const notificationPreferences = {
  get: (companyId: string) => `/api/v2/companies/${companyId}/notification-preferences`,
  update: (companyId: string) => `/api/v2/companies/${companyId}/notification-preferences`,
} as const;

export const discussions = {
  list: (companyId: string) => `/api/v2/companies/${companyId}/discussions`,
  create: (companyId: string) => `/api/v2/companies/${companyId}/discussions`,
  detail: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}`,
  update: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}`,
  delete: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}`,
  upvote: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}/upvote`,
  flag: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}/flag`,
  lock: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}/lock`,
  unlock: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}/unlock`,
  pin: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}/pin`,
  unpin: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}/unpin`,
  replies: (companyId: string, threadId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}/replies`,
  editReply: (companyId: string, replyId: string) =>
    `/api/v2/companies/${companyId}/discussions/replies/${replyId}`,
  deleteReply: (companyId: string, replyId: string) =>
    `/api/v2/companies/${companyId}/discussions/replies/${replyId}`,
  upvoteReply: (companyId: string, replyId: string) =>
    `/api/v2/companies/${companyId}/discussions/replies/${replyId}/upvote`,
  flagReply: (companyId: string, replyId: string) =>
    `/api/v2/companies/${companyId}/discussions/replies/${replyId}/flag`,
  acceptAnswer: (companyId: string, threadId: string, replyId: string) =>
    `/api/v2/companies/${companyId}/discussions/${threadId}/accept/${replyId}`,
  flagged: (companyId: string) => `/api/v2/companies/${companyId}/discussions/moderation/flagged`,
} as const;

export const gamification = {
  profile: (companyId: string) => `/api/v2/companies/${companyId}/gamification/profile`,
  studentProfile: (companyId: string, studentUserId: string) =>
    `/api/v2/companies/${companyId}/gamification/profile/${studentUserId}`,
  pointsHistory: (companyId: string) => `/api/v2/companies/${companyId}/gamification/points-history`,
  leaderboard: (companyId: string) => `/api/v2/companies/${companyId}/gamification/leaderboard`,
  badges: (companyId: string) => `/api/v2/companies/${companyId}/gamification/badges`,
  streak: (companyId: string) => `/api/v2/companies/${companyId}/gamification/streak`,
} as const;

// ─── Aggregated export ───────────────────────────────────────────────────────

export const v2 = {
  auth,
  companies,
  memberships,
  testTaking,
  catalog,
  checkout,
  courseCatalog,
  courseEnrollment,
  certificates,
  messages,
  notifications,
  notificationPreferences,
  discussions,
  gamification,
} as const;
