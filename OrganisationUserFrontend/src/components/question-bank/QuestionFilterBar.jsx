'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

const QUESTION_TYPES = [
  { value: 'mcq_single', label: 'MCQ (Single)' },
  { value: 'mcq_multiple', label: 'MCQ (Multiple)' },
  { value: 'true_false', label: 'True/False' },
  { value: 'fill_in_blank', label: 'Fill in Blank' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'long_answer', label: 'Long Answer' },
  { value: 'comprehension', label: 'Comprehension' },
  { value: 'match_the_column', label: 'Match Column' },
  { value: 'assertion_reasoning', label: 'Assertion/Reasoning' },
  { value: 'numerical', label: 'Numerical' },
  { value: 'math_latex', label: 'Math/LaTeX' },
  { value: 'diagram_image', label: 'Diagram/Image' },
  { value: 'verbal_reasoning', label: 'Verbal Reasoning' },
  { value: 'non_verbal_reasoning', label: 'Non-Verbal Reasoning' },
  { value: 'english_comprehension', label: 'English Comprehension' },
  { value: 'creative_writing', label: 'Creative Writing' },
  { value: 'cloze_passage', label: 'Cloze Passage' },
  { value: 'synonym_antonym', label: 'Synonym/Antonym' },
  { value: 'missing_letters', label: 'Missing Letters' },
  { value: 'word_definition', label: 'Word Definition' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'very_hard', label: 'Very Hard' },
];

export default function QuestionFilterBar({ search, onSearchChange, typeFilter, onTypeFilterChange, difficultyFilter, onDifficultyFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {QUESTION_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={difficultyFilter} onValueChange={onDifficultyFilterChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="All Difficulties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Difficulties</SelectItem>
          {DIFFICULTIES.map((d) => (
            <SelectItem key={d.value} value={d.value}>
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
