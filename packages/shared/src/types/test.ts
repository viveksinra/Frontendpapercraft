// Phase 3 -- Online Test Engine shared types

// ─── Type aliases ───────────────────────────────────────────────────────────

export type TestMode =
  | "live_mock"
  | "anytime_mock"
  | "practice"
  | "classroom"
  | "section_timed";

export type TestStatus =
  | "draft"
  | "scheduled"
  | "live"
  | "completed"
  | "archived";

export type AttemptStatus =
  | "in_progress"
  | "submitted"
  | "auto_submitted"
  | "graded";

// ─── Test configuration interfaces ──────────────────────────────────────────

export interface TestScheduling {
  startTime: string | null;
  endTime: string | null;
  availableFrom: string | null;
  duration: number;
}

export interface TestSection {
  name: string;
  questionIds: string[];
  timeLimit: number;
  instructions: string;
  canGoBack: boolean;
}

export interface TestOptions {
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showResultsAfterCompletion: boolean;
  showSolutionsAfterCompletion: boolean;
  showResultsToParents: boolean;
  instantFeedback: boolean;
  allowReview: boolean;
  maxAttempts: number;
  passingScore: number;
}

export interface TestAssignment {
  classIds: string[];
  studentIds: string[];
  isPublic: boolean;
}

export interface TestGrading {
  requireManualGrading: boolean;
  gradingDeadline: string | null;
}

export interface OnlineTest {
  _id: string;
  tenantId: string;
  companyId: string;
  title: string;
  description: string;
  paperId: string | null;
  mode: TestMode;
  scheduling: TestScheduling;
  sections: TestSection[];
  options: TestOptions;
  assignment: TestAssignment;
  grading: TestGrading;
  status: TestStatus;
  resultsPublished: boolean;
  totalMarks: number;
  totalQuestions: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Attempt interfaces ─────────────────────────────────────────────────────

export interface AttemptAnswer {
  questionId: string;
  sectionIndex: number;
  answer: unknown;
  isCorrect: boolean | null;
  marksAwarded: number | null;
  maxMarks: number;
  timeSpent: number;
  flagged: boolean;
  answeredAt: string | null;
  feedback: string;
}

export interface AttemptSectionProgress {
  sectionIndex: number;
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number;
  isLocked: boolean;
}

// ─── Result interfaces ──────────────────────────────────────────────────────

export interface SectionScore {
  sectionIndex: number;
  sectionName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

export interface AttemptResult {
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade: string;
  rank: number | null;
  percentile: number | null;
  sectionScores: SectionScore[];
  subjectScores: SubjectScore[];
  objectiveMarks: number;
  subjectiveMarks: number;
  isPassing: boolean;
}

export interface TestAttempt {
  _id: string;
  tenantId: string;
  companyId: string;
  testId: string;
  studentId: string;
  attemptNumber: number;
  status: AttemptStatus;
  startedAt: string | null;
  submittedAt: string | null;
  sections: AttemptSectionProgress[];
  answers: AttemptAnswer[];
  result: AttemptResult | null;
  questionOrder: string[];
  optionOrders: Record<string, unknown>;
  currentSectionIndex: number;
  autoSavedAt: string | null;
  ipAddress: string;
  userAgent: string;
  gradedBy: string | null;
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
