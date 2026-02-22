'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import OptionListEditor from './OptionListEditor';

const SUB_QUESTION_TYPES = [
  { value: 'mcq_single', label: 'MCQ (Single)' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'true_false', label: 'True/False' },
  { value: 'fill_in_blank', label: 'Fill in Blank' },
];

export default function SubQuestionBuilder({ subQuestions = [], onChange }) {
  const handleAdd = () => {
    onChange([
      ...subQuestions,
      {
        questionNumber: subQuestions.length + 1,
        type: 'mcq_single',
        body: '',
        options: [
          { label: 'A', text: '', isCorrect: false },
          { label: 'B', text: '', isCorrect: false },
        ],
        correctAnswer: '',
        marks: 1,
        explanation: '',
      },
    ]);
  };

  const handleRemove = (index) => {
    const updated = subQuestions
      .filter((_, i) => i !== index)
      .map((sq, i) => ({ ...sq, questionNumber: i + 1 }));
    onChange(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...subQuestions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Sub-Questions</label>
      {subQuestions.map((sq, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sub-Question {sq.questionNumber}</span>
            <Button variant="ghost" size="sm" onClick={() => handleRemove(index)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select value={sq.type} onValueChange={(val) => handleChange(index, 'type', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {SUB_QUESTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Marks"
              value={sq.marks}
              onChange={(e) => handleChange(index, 'marks', parseInt(e.target.value) || 0)}
            />
          </div>
          <Textarea
            placeholder="Sub-question text..."
            value={sq.body}
            onChange={(e) => handleChange(index, 'body', e.target.value)}
            rows={2}
          />
          {(sq.type === 'mcq_single' || sq.type === 'mcq_multiple') && (
            <OptionListEditor
              options={sq.options || []}
              onChange={(opts) => handleChange(index, 'options', opts)}
            />
          )}
          {sq.type === 'short_answer' && (
            <Input
              placeholder="Expected answer"
              value={sq.correctAnswer || ''}
              onChange={(e) => handleChange(index, 'correctAnswer', e.target.value)}
            />
          )}
          <Textarea
            placeholder="Explanation (optional)"
            value={sq.explanation || ''}
            onChange={(e) => handleChange(index, 'explanation', e.target.value)}
            rows={1}
            className="text-xs"
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={handleAdd}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Sub-Question
      </Button>
    </div>
  );
}
