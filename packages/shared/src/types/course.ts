// Phase 8: Udemy-Style Course Builder types

// ─── Type Aliases ──────────────────────────────────────────────────────────

export type CourseStatus = "draft" | "published" | "archived";

export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all_levels";

export type LessonType = "video" | "pdf" | "text" | "quiz" | "resource";

export type EnrollmentStatus = "active" | "completed" | "dropped";

// ─── Course Interfaces ─────────────────────────────────────────────────────

export interface CoursePricing {
  isFree: boolean;
  price: number;
  currency: string;
}

export interface CourseStats {
  enrollmentCount: number;
  avgRating: number;
  ratingCount: number;
  totalLessons: number;
  totalDurationMinutes: number;
}

export interface CourseLessonSummary {
  _id: string;
  title: string;
  type: LessonType;
  order: number;
  isFree: boolean;
  estimatedMinutes: number;
  dripDate: string | null;
  isPublished: boolean;
}

export interface CourseSectionSummary {
  _id: string;
  title: string;
  order: number;
  lessons: CourseLessonSummary[];
}

export interface CourseSummary {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  teacherName: string;
  category: string;
  level: CourseLevel;
  pricing: CoursePricing;
  stats: CourseStats;
  tags: string[];
  status: CourseStatus;
}

export interface CourseDetail extends CourseSummary {
  description: string;
  teacherId: string;
  sections: CourseSectionSummary[];
  welcomeMessage: string;
  completionMessage: string;
  certificateEnabled: boolean;
}

// ─── Enrollment Interfaces ─────────────────────────────────────────────────

export interface EnrollmentProgress {
  percentComplete: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessedAt: string | null;
  totalTimeSpentSeconds: number;
}

export interface EnrollmentSummary {
  _id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  teacherName: string;
  status: EnrollmentStatus;
  progress: EnrollmentProgress;
  enrolledAt: string;
  completedAt: string | null;
}

// ─── Certificate Interfaces ────────────────────────────────────────────────

export interface CertificateSummary {
  enrollmentId: string;
  courseTitle: string;
  instituteName: string;
  certificateNumber: string;
  issuedAt: string;
  certificateUrl: string;
}

// ─── Review Interfaces ─────────────────────────────────────────────────────

export interface CourseReview {
  studentName: string;
  rating: number;
  reviewText: string;
  reviewedAt: string;
}

// ─── Analytics Interfaces ──────────────────────────────────────────────────

export interface CourseAnalyticsOverview {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  droppedEnrollments: number;
  avgProgress: number;
  avgTimeSpentSeconds: number;
  completionRate: number;
  avgRating: number;
  totalRevenue: number;
}

export interface CourseEnrollmentTrend {
  date: string;
  count: number;
}

export interface LessonCompletionFunnel {
  lessonId: string;
  lessonTitle: string;
  sectionTitle: string;
  completionCount: number;
  completionPercentage: number;
}

export interface CourseRatingDistribution {
  stars: number;
  count: number;
}

export interface LessonAnalytics {
  lessonId: string;
  completionCount: number;
  avgTimeSpentSeconds: number;
  quizAvgScore: number | null;
  dropOffRate: number;
}

export interface InstituteCourseAnalytics {
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalCompletions: number;
  totalCourseRevenue: number;
  topCourses: {
    courseId: string;
    title: string;
    enrollmentCount: number;
    completionRate: number;
    avgRating: number;
    revenue: number;
  }[];
  enrollmentTrend: CourseEnrollmentTrend[];
}
