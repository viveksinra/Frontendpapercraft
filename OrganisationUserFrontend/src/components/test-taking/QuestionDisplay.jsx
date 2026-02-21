'use client';

const TYPE_LABELS = {
  mcq_single: 'Multiple Choice',
  multiple_choice: 'Multiple Choice',
  mcq_multiple: 'Multi-Select',
  multi_select: 'Multi-Select',
  true_false: 'True / False',
  fill_in_blank: 'Fill in the Blank',
  fill_in_the_blank: 'Fill in the Blank',
  short_answer: 'Short Answer',
  long_answer: 'Long Answer',
  essay: 'Essay',
  creative_writing: 'Creative Writing',
  numerical: 'Numerical',
  match_the_column: 'Match the Column',
  matching: 'Matching',
  comprehension: 'Comprehension',
};

export default function QuestionDisplay({ question, questionNumber }) {
  if (!question) return null;

  const typeLabel = TYPE_LABELS[question.type] || question.type;

  return (
    <div className="flex flex-col gap-4">
      {/* Question header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold">
          <span className="mr-2 text-primary">Q{questionNumber}.</span>
          <span className="text-foreground">{question.text || question.questionText}</span>
        </h2>
      </div>

      {/* Meta: type + marks */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center rounded-full border bg-muted/50 px-2 py-0.5">
          {typeLabel}
        </span>
        {question.marks != null && (
          <span className="inline-flex items-center rounded-full border bg-muted/50 px-2 py-0.5">
            {question.marks} mark{question.marks !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Passage / comprehension text */}
      {question.passage && (
        <div className="rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
          {question.passage}
        </div>
      )}

      {/* Image attachments */}
      {question.imageUrl && (
        <div className="mt-1">
          <img
            src={question.imageUrl}
            alt={`Attachment for question ${questionNumber}`}
            className="max-h-80 rounded-lg border object-contain"
          />
        </div>
      )}

      {/* Multiple image attachments */}
      {question.attachments?.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-1">
          {question.attachments.map((att, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg border">
              {att.type === 'image' || att.url?.match(/\.(png|jpe?g|gif|svg|webp)$/i) ? (
                <img
                  src={att.url}
                  alt={att.name || `Attachment ${idx + 1}`}
                  className="max-h-60 object-contain"
                />
              ) : (
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:underline"
                >
                  {att.name || `Attachment ${idx + 1}`}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MCQ options display (read-only labels, the actual selection is handled by AnswerInput) */}
      {(question.type === 'mcq_single' ||
        question.type === 'multiple_choice' ||
        question.type === 'mcq_multiple' ||
        question.type === 'multi_select' ||
        question.type === 'true_false') &&
        question.options?.length > 0 && (
          <div className="mt-1 space-y-2">
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border bg-background p-3 text-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="pt-0.5">{option.text || option.label || option}</span>
              </div>
            ))}
          </div>
        )}

      {/* Match the column display */}
      {(question.type === 'match_the_column' || question.type === 'matching') &&
        question.columnA &&
        question.columnB && (
          <div className="mt-1 grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Column A
              </h4>
              <ul className="space-y-1.5">
                {question.columnA.map((item, idx) => (
                  <li key={idx} className="rounded border bg-background px-3 py-2">
                    {idx + 1}. {item.text || item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Column B
              </h4>
              <ul className="space-y-1.5">
                {question.columnB.map((item, idx) => (
                  <li key={idx} className="rounded border bg-background px-3 py-2">
                    {String.fromCharCode(65 + idx)}. {item.text || item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
    </div>
  );
}
