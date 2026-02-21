// Phase 2 -- Paper Creation & PDF Generation shared types

// ─── Type aliases ────────────────────────────────────────────────────────────

export type PaperStatus = "draft" | "finalized" | "published";
export type PaperSetStatus = "draft" | "published" | "archived";
export type PdfType = "question_paper" | "answer_sheet" | "solution_paper" | "passage" | "marking_guide" | "other";
export type LogoPosition = "left" | "center" | "right";
export type InstructionPosition = "before_sections" | "per_section";
export type NumberingStyle = "numeric" | "alpha" | "roman";
export type PaperSize = "A4" | "Letter";
export type Currency = "GBP" | "INR";

// ─── Template interfaces ─────────────────────────────────────────────────────

export interface TemplateHeader {
  showLogo: boolean;
  logoPosition: LogoPosition;
  title: string;
  subtitle: string;
  studentInfoFields: string[];
}

export interface TemplateInstructions {
  show: boolean;
  text: string;
  position: InstructionPosition;
}

export interface TemplateSections {
  numberingStyle: NumberingStyle;
  showSectionHeaders: boolean;
  pageBreakBetweenSections: boolean;
}

export interface TemplateFooter {
  showPageNumbers: boolean;
  copyrightText: string;
  showWatermark: boolean;
  watermarkText: string;
}

export interface TemplateFormatting {
  paperSize: PaperSize;
  margins: { top: number; right: number; bottom: number; left: number };
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
}

export interface TemplateLayout {
  header: TemplateHeader;
  instructions: TemplateInstructions;
  sections: TemplateSections;
  footer: TemplateFooter;
  formatting: TemplateFormatting;
}

export interface PaperTemplate {
  _id: string;
  tenantId: string;
  companyId: string;
  name: string;
  description: string;
  layout: TemplateLayout;
  isPreBuilt: boolean;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Blueprint interfaces ────────────────────────────────────────────────────

export interface TopicDistribution {
  topicId: string;
  percentage: number;
}

export interface DifficultyMix {
  easy: number;
  medium: number;
  hard: number;
  expert: number;
}

export interface BlueprintSection {
  name: string;
  questionCount: number;
  questionTypes: string[];
  marksPerQuestion: number;
  mixedMarks: boolean;
  timeLimit: number;
  topicDistribution: TopicDistribution[];
  difficultyMix: DifficultyMix;
  instructions: string;
  subjectId: string | null;
}

export interface BlueprintConstraints {
  excludeRecentlyUsed: boolean;
  recentlyUsedWindow: number;
  excludeQuestionIds: string[];
  requireApprovedOnly: boolean;
}

export interface PaperBlueprint {
  _id: string;
  tenantId: string;
  companyId: string;
  name: string;
  description: string;
  totalMarks: number;
  totalTime: number;
  sections: BlueprintSection[];
  constraints: BlueprintConstraints;
  isPreBuilt: boolean;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Paper interfaces ────────────────────────────────────────────────────────

export interface PaperQuestion {
  questionId: string;
  questionNumber: number;
  marks: number;
  isRequired: boolean;
}

export interface PaperSection {
  name: string;
  instructions: string;
  timeLimit: number;
  questions: PaperQuestion[];
}

export interface PaperPdf {
  type: PdfType;
  fileName: string;
  s3Key: string;
  fileSize: number;
  generatedAt: string;
}

export interface Paper {
  _id: string;
  tenantId: string;
  companyId: string;
  title: string;
  description: string;
  templateId: string;
  blueprintId: string | null;
  sections: PaperSection[];
  totalMarks: number;
  totalTime: number;
  status: PaperStatus;
  pdfs: PaperPdf[];
  version: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── PaperSet interfaces ─────────────────────────────────────────────────────

export interface PaperSetPdf {
  type: string;
  fileName: string;
  s3Key: string;
  fileSize: number;
}

export interface PaperSetEntry {
  paperId: string;
  order: number;
  pdfs: PaperSetPdf[];
}

export interface PaperSetPricing {
  currency: Currency;
  pricePerPaper: number;
  bundlePrice: number;
  checkingServicePrice: number;
  oneToOneServicePrice: number;
  isFree: boolean;
}

export interface PaperSet {
  _id: string;
  tenantId: string;
  companyId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  examType: string;
  yearGroup: string;
  subjectCategory: string;
  papers: PaperSetEntry[];
  pricing: PaperSetPricing;
  imageUrls: string[];
  status: PaperSetStatus;
  sortDate: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
