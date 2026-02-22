// Phase 7: Analytics & Reporting types

// ─── Student Analytics ──────────────────────────────────────────────────────

export interface TopicPerformance {
  topicId: string;
  topicName: string;
  subjectId: string;
  accuracy: number;
  totalQuestions: number;
  correctCount: number;
  avgTimeSeconds: number;
}

export interface TestPerformanceEntry {
  testId: string;
  testTitle: string;
  date: string;
  percentage: number;
  rank: number | null;
  percentile: number | null;
  totalStudents: number | null;
}

export interface SubjectBreakdown {
  subjectId: string;
  subjectName: string;
  avgPercentage: number;
  totalQuestions: number;
  correctCount: number;
  topics: TopicPerformance[];
}

export interface OverallStats {
  totalTests: number;
  avgPercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  improvementRate: number;
  percentileInClass: number | null;
  percentileInOrg: number | null;
}

export interface DifficultyBucket {
  difficulty: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface DifficultyAnalysis {
  buckets: DifficultyBucket[];
}

export interface TimeDistributionBucket {
  bucket: string;
  count: number;
  avgScore: number;
}

export interface TimeAnalysis {
  avgTimePerQuestion: number;
  medianTimePerQuestion: number;
  distribution: TimeDistributionBucket[];
}

export interface ElevenPlusComponentScore {
  component: string;
  avgPercentage: number;
  testCount: number;
  trend: number;
  sections: Array<{ sectionName: string; avgPercentage: number }>;
}

export interface ElevenPlusAnalytics {
  qualificationBand: {
    band: string | null;
    avgScore: number;
    confidence: string;
    testCount: number;
  };
  componentScores: ElevenPlusComponentScore[];
  cohortPercentile: {
    percentile: number;
    cohortSize: number;
  };
}

export interface StudentAnalytics {
  _id: string;
  studentUserId: string;
  companyId: string;
  period: string;
  overallStats: OverallStats;
  testPerformance: TestPerformanceEntry[];
  subjectBreakdown: SubjectBreakdown[];
  difficultyAnalysis: DifficultyAnalysis;
  timeAnalysis: TimeAnalysis;
  elevenPlusAnalytics: ElevenPlusAnalytics | null;
  computedAt: string;
}

// ─── Class Analytics ────────────────────────────────────────────────────────

export interface ScoreStats {
  avg: number;
  median: number;
  highest: number;
  lowest: number;
  stdDev: number;
}

export interface ScoreDistributionBucket {
  bucket: string;
  count: number;
}

export interface PerformerEntry {
  studentId: string;
  studentName: string;
  percentage: number;
  rank: number;
}

export interface MostMissedQuestion {
  questionId: string;
  questionText: string;
  subjectName: string;
  topicName: string;
  accuracy: number;
  totalAttempts: number;
}

export interface ClassTestAnalytics {
  scoreStats: ScoreStats;
  scoreDistribution: ScoreDistributionBucket[];
  topPerformers: PerformerEntry[];
  bottomPerformers: PerformerEntry[];
  mostMissedQuestions: MostMissedQuestion[];
  completionRate: number;
  topicHeatmap: Array<{
    topicId: string;
    topicName: string;
    avgAccuracy: number;
  }>;
}

// ─── Question Analytics ─────────────────────────────────────────────────────

export interface DistractorStat {
  label: string;
  text: string;
  selectedCount: number;
  selectedPercentage: number;
  isCorrect: boolean;
}

export interface QuestionAnalyticsSummary {
  _id: string;
  questionId: string;
  companyId: string;
  accuracy: number;
  taggedDifficulty: string;
  actualDifficulty: string;
  discriminationIndex: number;
  totalAttempts: number;
  correctCount: number;
  averageTimeSeconds: number;
  medianTimeSeconds: number;
  distractorStats: DistractorStat[];
  computedAt: string;
}

// ─── Institute Analytics ────────────────────────────────────────────────────

export interface InstituteOverview {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalTests: number;
  totalQuestions: number;
  totalAttempts: number;
  avgPassRate: number;
  totalRevenue: number;
  activeStudents30d: number;
}

export interface EnrollmentTrendEntry {
  date: string;
  newStudents: number;
  totalStudents: number;
}

export interface TeacherActivityEntry {
  teacherId: string;
  teacherName: string;
  questionsCreated: number;
  testsCreated: number;
  classesManaged: number;
  lastActive: string;
}

export interface ContentUsageEntry {
  testId: string;
  testTitle: string;
  attemptCount: number;
  avgScore: number;
  uniqueStudents: number;
}

export interface RetentionEntry {
  period: string;
  rate: number;
}

// ─── Reports ────────────────────────────────────────────────────────────────

export type ReportType =
  | "progress_report"
  | "mock_analysis"
  | "class_summary"
  | "custom";

export type ReportStatus = "pending" | "generating" | "completed" | "failed";

export interface Report {
  _id: string;
  companyId: string;
  type: ReportType;
  title: string;
  studentUserId: string | null;
  classId: string | null;
  templateId: string;
  status: ReportStatus;
  pdfUrl: string | null;
  pdfSize: number | null;
  generatedBy: string;
  generatedAt: string | null;
  expiresAt: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}
