/**
 * Phase 3 -- Shared auto-grading utility functions
 * Used by both the backend (official grading) and frontend (optimistic client-side scoring in practice mode).
 */

export interface GradeResult {
  isCorrect: boolean | null;
  marksAwarded: number | null;
}

interface McqOption {
  index: number;
  isCorrect?: boolean;
}

// ─── Type-specific graders ──────────────────────────────────────────────────

/**
 * Grade a single-select MCQ. Full marks for correct answer, 0 for incorrect.
 */
export function gradeMcqSingle(
  studentAnswer: unknown,
  options: McqOption[],
  maxMarks: number = 1
): GradeResult {
  if (studentAnswer == null) {
    return { isCorrect: false, marksAwarded: 0 };
  }
  const correctOption = options.find((o) => o.isCorrect);
  if (!correctOption) {
    return { isCorrect: null, marksAwarded: null };
  }
  const isCorrect = Number(studentAnswer) === correctOption.index;
  return {
    isCorrect,
    marksAwarded: isCorrect ? maxMarks : 0,
  };
}

/**
 * Grade a multi-select MCQ. Partial marks based on correct selections.
 * marksAwarded = (correctSelected / totalCorrect) * maxMarks
 * Deduct for wrong selections but minimum 0.
 */
export function gradeMcqMultiple(
  studentAnswer: unknown,
  options: McqOption[],
  maxMarks: number = 1
): GradeResult {
  if (!Array.isArray(studentAnswer) || studentAnswer.length === 0) {
    return { isCorrect: false, marksAwarded: 0 };
  }

  const correctIndexes = new Set(
    options.filter((o) => o.isCorrect).map((o) => o.index)
  );
  const studentIndexes = new Set(studentAnswer.map(Number));

  if (correctIndexes.size === 0) {
    return { isCorrect: null, marksAwarded: null };
  }

  let correctSelected = 0;
  let wrongSelected = 0;

  for (const idx of studentIndexes) {
    if (correctIndexes.has(idx)) {
      correctSelected++;
    } else {
      wrongSelected++;
    }
  }

  const isExactMatch =
    correctSelected === correctIndexes.size && wrongSelected === 0;
  const marks = Math.max(
    0,
    ((correctSelected - wrongSelected) / correctIndexes.size) * maxMarks
  );

  return {
    isCorrect: isExactMatch,
    marksAwarded: Math.round(marks * 100) / 100,
  };
}

/**
 * Grade a true/false question. Direct boolean comparison.
 */
export function gradeTrueFalse(
  studentAnswer: unknown,
  correctAnswer: boolean,
  maxMarks: number = 1
): GradeResult {
  if (studentAnswer == null) {
    return { isCorrect: false, marksAwarded: 0 };
  }
  const studentBool =
    typeof studentAnswer === "boolean"
      ? studentAnswer
      : String(studentAnswer).toLowerCase() === "true";
  const isCorrect = studentBool === correctAnswer;
  return {
    isCorrect,
    marksAwarded: isCorrect ? maxMarks : 0,
  };
}

/**
 * Grade a fill-in-the-blank question.
 * Case-insensitive, trims whitespace, supports multiple acceptable answers.
 */
export function gradeFillInBlank(
  studentAnswer: unknown,
  correctAnswer: string | string[],
  maxMarks: number = 1
): GradeResult {
  if (studentAnswer == null || String(studentAnswer).trim() === "") {
    return { isCorrect: false, marksAwarded: 0 };
  }

  const studentStr = String(studentAnswer).trim().toLowerCase();
  const acceptableAnswers = Array.isArray(correctAnswer)
    ? correctAnswer
    : [correctAnswer];

  const isCorrect = acceptableAnswers.some(
    (ans) => String(ans).trim().toLowerCase() === studentStr
  );

  return {
    isCorrect,
    marksAwarded: isCorrect ? maxMarks : 0,
  };
}

/**
 * Grade a numerical answer. Supports exact match or tolerance-based comparison.
 */
export function gradeNumerical(
  studentAnswer: unknown,
  correctAnswer: number,
  maxMarks: number = 1,
  tolerance: number = 0
): GradeResult {
  if (studentAnswer == null || studentAnswer === "") {
    return { isCorrect: false, marksAwarded: 0 };
  }

  const studentNum = Number(studentAnswer);
  if (isNaN(studentNum)) {
    return { isCorrect: false, marksAwarded: 0 };
  }

  const isCorrect = Math.abs(studentNum - correctAnswer) <= tolerance;
  return {
    isCorrect,
    marksAwarded: isCorrect ? maxMarks : 0,
  };
}

/**
 * Grade a match-the-column question. Partial marks based on correct match count.
 * marksAwarded = (correctCount / totalPairs) * maxMarks
 */
export function gradeMatchTheColumn(
  studentAnswer: unknown,
  correctPairs: Record<string, string>,
  maxMarks: number = 1
): GradeResult {
  if (
    studentAnswer == null ||
    typeof studentAnswer !== "object" ||
    Array.isArray(studentAnswer)
  ) {
    return { isCorrect: false, marksAwarded: 0 };
  }

  const studentPairs = studentAnswer as Record<string, string>;
  const pairKeys = Object.keys(correctPairs);
  const totalPairs = pairKeys.length;

  if (totalPairs === 0) {
    return { isCorrect: null, marksAwarded: null };
  }

  let correctCount = 0;
  for (const key of pairKeys) {
    if (
      studentPairs[key] != null &&
      String(studentPairs[key]).trim().toLowerCase() ===
        String(correctPairs[key]).trim().toLowerCase()
    ) {
      correctCount++;
    }
  }

  const isCorrect = correctCount === totalPairs;
  const marks = (correctCount / totalPairs) * maxMarks;

  return {
    isCorrect,
    marksAwarded: Math.round(marks * 100) / 100,
  };
}

interface SubQuestion {
  type: string;
  correctAnswer: unknown;
  options?: McqOption[];
  maxMarks: number;
  tolerance?: number;
}

/**
 * Grade comprehension sub-questions. Dispatches each sub-question to its type grader and sums marks.
 */
export function gradeComprehensionSubQuestions(
  studentAnswers: unknown[],
  subQuestions: SubQuestion[]
): GradeResult {
  if (!Array.isArray(studentAnswers)) {
    return { isCorrect: false, marksAwarded: 0 };
  }

  let totalMarks = 0;
  let totalAwarded = 0;
  let allCorrect = true;
  let hasSubjective = false;

  for (let i = 0; i < subQuestions.length; i++) {
    const sq = subQuestions[i];
    const sa = studentAnswers[i];
    totalMarks += sq.maxMarks;

    const result = gradeQuestion(sq.type, sa, sq.correctAnswer, {
      options: sq.options,
      maxMarks: sq.maxMarks,
      tolerance: sq.tolerance,
    });

    if (result.isCorrect === null) {
      hasSubjective = true;
    } else {
      if (!result.isCorrect) allCorrect = false;
      totalAwarded += result.marksAwarded ?? 0;
    }
  }

  if (hasSubjective && totalAwarded === 0) {
    return { isCorrect: null, marksAwarded: null };
  }

  return {
    isCorrect: hasSubjective ? null : allCorrect,
    marksAwarded: totalAwarded,
  };
}

// ─── Subjective types (non-auto-gradable) ───────────────────────────────────

const SUBJECTIVE_TYPES = new Set([
  "short_answer",
  "long_answer",
  "creative_writing",
  "essay",
]);

// ─── Main dispatcher ────────────────────────────────────────────────────────

export interface GradeOptions {
  options?: McqOption[];
  maxMarks?: number;
  tolerance?: number;
  correctPairs?: Record<string, string>;
  subQuestions?: SubQuestion[];
}

/**
 * Grade a question based on its type. Dispatches to the appropriate type-specific grader.
 * Non-auto-gradable types return { isCorrect: null, marksAwarded: null }.
 */
export function gradeQuestion(
  questionType: string,
  studentAnswer: unknown,
  correctAnswer: unknown,
  opts: GradeOptions = {}
): GradeResult {
  const maxMarks = opts.maxMarks ?? 1;

  if (SUBJECTIVE_TYPES.has(questionType)) {
    return { isCorrect: null, marksAwarded: null };
  }

  switch (questionType) {
    case "mcq_single":
    case "multiple_choice":
      return gradeMcqSingle(studentAnswer, opts.options ?? [], maxMarks);

    case "mcq_multiple":
    case "multi_select":
      return gradeMcqMultiple(studentAnswer, opts.options ?? [], maxMarks);

    case "true_false":
      return gradeTrueFalse(studentAnswer, correctAnswer as boolean, maxMarks);

    case "fill_in_blank":
    case "fill_in_the_blank":
      return gradeFillInBlank(
        studentAnswer,
        correctAnswer as string | string[],
        maxMarks
      );

    case "numerical":
      return gradeNumerical(
        studentAnswer,
        correctAnswer as number,
        maxMarks,
        opts.tolerance ?? 0
      );

    case "match_the_column":
    case "matching":
      return gradeMatchTheColumn(
        studentAnswer,
        (opts.correctPairs ?? correctAnswer) as Record<string, string>,
        maxMarks
      );

    case "comprehension":
      return gradeComprehensionSubQuestions(
        studentAnswer as unknown[],
        opts.subQuestions ?? []
      );

    default:
      // Unknown type -- cannot auto-grade
      return { isCorrect: null, marksAwarded: null };
  }
}
