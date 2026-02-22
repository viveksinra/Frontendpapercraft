// Phase 4: Student, Parent, and ParentLink types for the ParentChildFrontend

export type UserRole =
  | "owner"
  | "admin"
  | "senior_teacher"
  | "teacher"
  | "content_reviewer"
  | "student"
  | "parent";

export interface StudentOrganization {
  companyId: string;
  tenantId: string;
  joinedAt: string;
  role: string;
  orgName: string;
  isActive: boolean;
}

export interface StudentStats {
  totalTestsTaken: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: string | null;
}

export interface StudentPreferences {
  showTimerWarning: boolean;
  questionFontSize: "small" | "medium" | "large";
  highContrastMode: boolean;
}

export interface Student {
  id: string;
  userId: string;
  studentCode: string;
  name: string;
  email: string;
  dateOfBirth: string | null;
  yearGroup: string;
  school: string;
  organizations: StudentOrganization[];
  stats: StudentStats;
  preferences: StudentPreferences;
}

export interface ParentLink {
  id: string;
  parentUserId: string;
  studentUserId: string;
  studentId: string;
  status: "pending" | "active" | "revoked";
  relationship: "mother" | "father" | "guardian" | "other";
  linkedAt: string;
  revokedAt: string | null;
}

export interface ParentChildAlert {
  type: "new_result" | "overdue_homework" | "upcoming_test";
  message: string;
  testId?: string;
  testName?: string;
  date?: string;
}

export interface ParentChild {
  student: Student;
  relationship: string;
  linkedAt: string;
  recentResults: {
    testId: string;
    testName: string;
    score: number;
    grade: string;
    date: string;
  }[];
  upcomingTests: {
    testId: string;
    testName: string;
    mode: string;
    startTime: string;
    duration: number;
  }[];
  stats: StudentStats;
  alerts: ParentChildAlert[];
}
