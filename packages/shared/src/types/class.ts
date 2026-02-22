// Phase 5: Class Management, Homework, Announcement, and Fee Record types

// ─── Class ─────────────────────────────────────────────────────────────────

export type ClassStatus = "active" | "archived";

export interface ClassSchedule {
  dayOfWeek: string[];
  time: string;
  location: string;
}

export interface Class {
  _id: string;
  tenantId: string;
  companyId: string;
  name: string;
  slug: string;
  description: string;
  yearGroup: string;
  subject: string;
  schedule: ClassSchedule;
  students: string[];
  teachers: string[];
  studentCount: number;
  status: ClassStatus;
  archivedAt: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Homework ──────────────────────────────────────────────────────────────

export type HomeworkStatus = "active" | "past_due" | "completed" | "archived";
export type HomeworkType = "test" | "questions";

export interface SubmissionSummary {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  late: number;
}

export interface Homework {
  _id: string;
  tenantId: string;
  companyId: string;
  classId: string;
  title: string;
  description: string;
  type: HomeworkType;
  testId: string | null;
  questionIds: string[];
  totalMarks: number;
  assignedAt: string;
  dueDate: string;
  lateSubmissionAllowed: boolean;
  lateDeadline: string | null;
  status: HomeworkStatus;
  submissionSummary: SubmissionSummary;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Homework Submission ───────────────────────────────────────────────────

export type SubmissionStatus = "pending" | "submitted" | "late" | "graded";

export interface HomeworkAnswerItem {
  questionId: string;
  answer: unknown;
  isCorrect: boolean | null;
  marksAwarded: number;
  maxMarks: number;
}

export interface HomeworkSubmission {
  _id: string;
  tenantId: string;
  companyId: string;
  homeworkId: string;
  studentUserId: string;
  testAttemptId: string | null;
  status: SubmissionStatus;
  answers: HomeworkAnswerItem[];
  score: number | null;
  totalMarks: number;
  percentage: number | null;
  submittedAt: string | null;
  gradedAt: string | null;
  gradedBy: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Announcement ──────────────────────────────────────────────────────────

export type AnnouncementAudience = "class" | "organization";

export interface Announcement {
  _id: string;
  tenantId: string;
  companyId: string;
  classId: string | null;
  audience: AnnouncementAudience;
  title: string;
  body: string;
  isPinned: boolean;
  publishedAt: string;
  expiresAt: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Fee Record ────────────────────────────────────────────────────────────

export type FeeStatus = "unpaid" | "partial" | "paid";
export type FeeCurrency = "GBP" | "INR";

export interface FeeRecord {
  _id: string;
  tenantId: string;
  companyId: string;
  classId: string;
  studentUserId: string;
  amount: number;
  currency: FeeCurrency;
  amountPaid: number;
  status: FeeStatus;
  dueDate: string | null;
  notes: string;
  lastReminderSentAt: string | null;
  reminderCount: number;
  paidAt: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Fee Summary (returned by getClassFees API) ────────────────────────────

export interface FeeSummary {
  totalStudents: number;
  paidCount: number;
  unpaidCount: number;
  partialCount: number;
  totalRevenue: number;
  totalOutstanding: number;
  currency: FeeCurrency;
}
