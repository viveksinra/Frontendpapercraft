'use client';

import { Badge } from '@/components/ui/badge';

const TYPE_CONFIG = {
  mcq_single: { label: 'MCQ (Single)', color: 'bg-blue-100 text-blue-800' },
  mcq_multiple: { label: 'MCQ (Multiple)', color: 'bg-blue-100 text-blue-800' },
  true_false: { label: 'True/False', color: 'bg-green-100 text-green-800' },
  fill_in_blank: { label: 'Fill in Blank', color: 'bg-yellow-100 text-yellow-800' },
  short_answer: { label: 'Short Answer', color: 'bg-orange-100 text-orange-800' },
  long_answer: { label: 'Long Answer', color: 'bg-orange-100 text-orange-800' },
  comprehension: { label: 'Comprehension', color: 'bg-purple-100 text-purple-800' },
  match_the_column: { label: 'Match Column', color: 'bg-pink-100 text-pink-800' },
  assertion_reasoning: { label: 'Assertion', color: 'bg-indigo-100 text-indigo-800' },
  numerical: { label: 'Numerical', color: 'bg-cyan-100 text-cyan-800' },
  math_latex: { label: 'Math/LaTeX', color: 'bg-cyan-100 text-cyan-800' },
  diagram_image: { label: 'Diagram', color: 'bg-teal-100 text-teal-800' },
  verbal_reasoning: { label: 'Verbal Reasoning', color: 'bg-violet-100 text-violet-800' },
  non_verbal_reasoning: { label: 'Non-Verbal', color: 'bg-violet-100 text-violet-800' },
  english_comprehension: { label: 'English Comp.', color: 'bg-purple-100 text-purple-800' },
  creative_writing: { label: 'Creative Writing', color: 'bg-rose-100 text-rose-800' },
  cloze_passage: { label: 'Cloze Passage', color: 'bg-amber-100 text-amber-800' },
  synonym_antonym: { label: 'Synonym/Antonym', color: 'bg-lime-100 text-lime-800' },
  missing_letters: { label: 'Missing Letters', color: 'bg-emerald-100 text-emerald-800' },
  word_definition: { label: 'Word Definition', color: 'bg-emerald-100 text-emerald-800' },
};

export default function QuestionTypeBadge({ type }) {
  const config = TYPE_CONFIG[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
  return (
    <Badge variant="outline" className={`${config.color} border-0 text-xs font-medium`}>
      {config.label}
    </Badge>
  );
}
