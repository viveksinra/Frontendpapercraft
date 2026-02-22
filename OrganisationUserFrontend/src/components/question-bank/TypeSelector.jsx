'use client';

import {
  CheckSquare, List, ToggleLeft, TextCursor, AlignLeft, FileText,
  BookOpen, Columns, GitBranch, Hash, Sigma, Image, Brain,
  Puzzle, BookOpenCheck, PenTool, ListOrdered, ArrowLeftRight,
  Type, BookMarked,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const QUESTION_TYPES = [
  { value: 'mcq_single', label: 'MCQ (Single)', description: 'Single correct answer from options', icon: CheckSquare },
  { value: 'mcq_multiple', label: 'MCQ (Multiple)', description: 'Multiple correct answers from options', icon: List },
  { value: 'true_false', label: 'True / False', description: 'Binary true or false answer', icon: ToggleLeft },
  { value: 'fill_in_blank', label: 'Fill in Blank', description: 'Complete the missing word or phrase', icon: TextCursor },
  { value: 'short_answer', label: 'Short Answer', description: 'Brief text answer (1-2 sentences)', icon: AlignLeft },
  { value: 'long_answer', label: 'Long Answer', description: 'Detailed written response', icon: FileText },
  { value: 'comprehension', label: 'Comprehension', description: 'Passage with sub-questions', icon: BookOpen },
  { value: 'match_the_column', label: 'Match Column', description: 'Match items from two columns', icon: Columns },
  { value: 'assertion_reasoning', label: 'Assertion & Reasoning', description: 'Evaluate assertion and reason relationship', icon: GitBranch },
  { value: 'numerical', label: 'Numerical', description: 'Calculate a numeric answer', icon: Hash },
  { value: 'math_latex', label: 'Math / LaTeX', description: 'Mathematical expressions and equations', icon: Sigma },
  { value: 'diagram_image', label: 'Diagram / Image', description: 'Question with diagram or image', icon: Image },
  { value: 'verbal_reasoning', label: 'Verbal Reasoning', description: 'Logical reasoning with words', icon: Brain },
  { value: 'non_verbal_reasoning', label: 'Non-Verbal Reasoning', description: 'Pattern and spatial reasoning', icon: Puzzle },
  { value: 'english_comprehension', label: 'English Comprehension', description: 'English passage with questions', icon: BookOpenCheck },
  { value: 'creative_writing', label: 'Creative Writing', description: 'Essay or creative writing prompt', icon: PenTool },
  { value: 'cloze_passage', label: 'Cloze Passage', description: 'Fill in multiple blanks in a passage', icon: ListOrdered },
  { value: 'synonym_antonym', label: 'Synonym / Antonym', description: 'Find synonyms or antonyms', icon: ArrowLeftRight },
  { value: 'missing_letters', label: 'Missing Letters', description: 'Complete the word with missing letters', icon: Type },
  { value: 'word_definition', label: 'Word Definition', description: 'Define or identify word meanings', icon: BookMarked },
];

export default function TypeSelector({ selectedType, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {QUESTION_TYPES.map((qt) => {
        const Icon = qt.icon;
        const isSelected = selectedType === qt.value;
        return (
          <Card
            key={qt.value}
            className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:border-primary/50'}`}
            onClick={() => onSelect(qt.value)}
          >
            <CardContent className="flex flex-col items-center text-center gap-2 p-4">
              <div className={`rounded-lg p-2 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{qt.label}</span>
              <span className="text-xs text-muted-foreground leading-tight">{qt.description}</span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
