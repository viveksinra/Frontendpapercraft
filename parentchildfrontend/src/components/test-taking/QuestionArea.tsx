'use client';

import { Card, CardContent } from '@/components/ui/card';
import { McqAnswerInput } from './McqAnswerInput';
import { TrueFalseInput } from './TrueFalseInput';
import { FillInBlankInput } from './FillInBlankInput';
import { ShortAnswerInput } from './ShortAnswerInput';
import { LongAnswerInput } from './LongAnswerInput';
import { NumericalInput } from './NumericalInput';
import { MatchColumnInput } from './MatchColumnInput';
import { ComprehensionSplitView } from './ComprehensionSplitView';
import type { Question } from '@/hooks/useTestTaking';

interface QuestionAreaProps {
  question: Question;
  answer: unknown;
  onAnswer: (value: unknown) => void;
  disabled?: boolean;
}

function renderAnswerInput(question: Question, answer: unknown, onAnswer: (v: unknown) => void, disabled: boolean) {
  const type = question.type?.toLowerCase() || '';

  switch (type) {
    case 'mcq':
    case 'multiple_choice':
      return (
        <McqAnswerInput
          options={question.options || []}
          value={answer as string | null}
          onChange={onAnswer}
          disabled={disabled}
        />
      );

    case 'mcq_multi':
    case 'multiple_select':
      return (
        <McqAnswerInput
          options={question.options || []}
          value={answer as string[] | null}
          onChange={onAnswer}
          multiSelect
          disabled={disabled}
        />
      );

    case 'true_false':
      return (
        <TrueFalseInput
          value={answer as boolean | null}
          onChange={onAnswer}
          disabled={disabled}
        />
      );

    case 'fill_in_blank':
      return (
        <FillInBlankInput
          blankCount={question.blankCount as number || 1}
          value={answer as string[] | null}
          onChange={onAnswer}
          disabled={disabled}
        />
      );

    case 'short_answer':
      return (
        <ShortAnswerInput
          value={answer as string | null}
          onChange={onAnswer}
          disabled={disabled}
        />
      );

    case 'long_answer':
    case 'essay':
      return (
        <LongAnswerInput
          value={answer as string | null}
          onChange={onAnswer}
          disabled={disabled}
        />
      );

    case 'numerical':
      return (
        <NumericalInput
          value={answer as number | null}
          onChange={onAnswer}
          disabled={disabled}
        />
      );

    case 'match_column':
    case 'matching':
      return (
        <MatchColumnInput
          leftItems={question.columns?.left || []}
          rightItems={question.columns?.right || []}
          value={answer as Record<string, string> | null}
          onChange={onAnswer}
          disabled={disabled}
        />
      );

    default:
      return (
        <ShortAnswerInput
          value={answer as string | null}
          onChange={onAnswer}
          disabled={disabled}
        />
      );
  }
}

export function QuestionArea({ question, answer, onAnswer, disabled = false }: QuestionAreaProps) {
  const content = (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Question {question.questionNumber}</span>
          <span className="text-muted-foreground/50">|</span>
          <span>{question.marks} {question.marks === 1 ? 'mark' : 'marks'}</span>
        </div>
        <p className="text-sm leading-relaxed">{question.text}</p>
      </div>
      {renderAnswerInput(question, answer, onAnswer, disabled)}
    </div>
  );

  // If comprehension question with passage, use split view
  if (question.passage) {
    return (
      <ComprehensionSplitView passage={question.passage}>
        <Card>
          <CardContent className="p-4">{content}</CardContent>
        </Card>
      </ComprehensionSplitView>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">{content}</CardContent>
    </Card>
  );
}
