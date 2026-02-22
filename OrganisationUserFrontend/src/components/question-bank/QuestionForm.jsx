'use client';

import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OptionListEditor from './OptionListEditor';
import MatchPairBuilder from './MatchPairBuilder';
import SubQuestionBuilder from './SubQuestionBuilder';

export default function QuestionForm({ type, content, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...content, [field]: value });
  };

  const needsOptions = ['mcq_single', 'mcq_multiple', 'true_false'].includes(type);
  const needsPassage = ['comprehension', 'english_comprehension', 'cloze_passage'].includes(type);
  const needsMatchPairs = type === 'match_the_column';
  const needsAssertion = type === 'assertion_reasoning';
  const needsSubQuestions = ['comprehension', 'english_comprehension'].includes(type);
  const needsNumerical = type === 'numerical';
  const needsBlanks = ['cloze_passage', 'fill_in_blank', 'missing_letters'].includes(type);
  const needsCorrectAnswer = ['true_false', 'fill_in_blank', 'short_answer', 'synonym_antonym', 'word_definition', 'missing_letters'].includes(type);
  const isMultiSelect = type === 'mcq_multiple';
  const needsLongAnswer = ['long_answer', 'creative_writing'].includes(type);

  return (
    <div className="space-y-5">
      {/* Passage (for comprehension types) */}
      {needsPassage && (
        <div className="space-y-2">
          <Label>Passage</Label>
          <Textarea
            placeholder="Enter the reading passage..."
            value={content.passage || ''}
            onChange={(e) => handleChange('passage', e.target.value)}
            rows={6}
          />
        </div>
      )}

      {/* Assertion & Reasoning */}
      {needsAssertion && (
        <>
          <div className="space-y-2">
            <Label>Assertion</Label>
            <Textarea
              placeholder="Enter the assertion statement..."
              value={content.assertion || ''}
              onChange={(e) => handleChange('assertion', e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              placeholder="Enter the reasoning statement..."
              value={content.reason || ''}
              onChange={(e) => handleChange('reason', e.target.value)}
              rows={2}
            />
          </div>
        </>
      )}

      {/* Question Body */}
      <div className="space-y-2">
        <Label>Question Body</Label>
        <Textarea
          placeholder="Enter the question text..."
          value={content.body || ''}
          onChange={(e) => handleChange('body', e.target.value)}
          rows={needsLongAnswer ? 2 : 3}
        />
      </div>

      {/* MCQ Options */}
      {needsOptions && type !== 'true_false' && (
        <OptionListEditor
          options={content.options || []}
          onChange={(opts) => handleChange('options', opts)}
          multiSelect={isMultiSelect}
        />
      )}

      {/* True/False options */}
      {type === 'true_false' && (
        <div className="space-y-2">
          <Label>Correct Answer</Label>
          <div className="flex gap-3">
            {['true', 'false'].map((val) => (
              <button
                key={val}
                type="button"
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                  content.correctAnswer === val
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card hover:bg-accent'
                }`}
                onClick={() => handleChange('correctAnswer', val)}
              >
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Match the Column */}
      {needsMatchPairs && (
        <MatchPairBuilder
          pairs={content.matchPairs || []}
          onChange={(pairs) => handleChange('matchPairs', pairs)}
        />
      )}

      {/* Sub-Questions */}
      {needsSubQuestions && (
        <SubQuestionBuilder
          subQuestions={content.subQuestions || []}
          onChange={(sqs) => handleChange('subQuestions', sqs)}
        />
      )}

      {/* Numerical */}
      {needsNumerical && (
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label>Numerical Answer</Label>
            <Input
              type="number"
              placeholder="e.g. 42"
              value={content.numericalAnswer ?? ''}
              onChange={(e) => handleChange('numericalAnswer', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tolerance</Label>
            <Input
              type="number"
              placeholder="e.g. 0.5"
              value={content.numericalTolerance ?? ''}
              onChange={(e) => handleChange('numericalTolerance', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              placeholder="e.g. cm, kg"
              value={content.numericalUnit || ''}
              onChange={(e) => handleChange('numericalUnit', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Blanks for cloze/fill-in-blank */}
      {needsBlanks && type !== 'fill_in_blank' && (
        <div className="space-y-2">
          <Label>Blanks (comma-separated answers)</Label>
          <Input
            placeholder="answer1, answer2, answer3"
            value={(content.blanks || []).join(', ')}
            onChange={(e) => handleChange('blanks', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </div>
      )}

      {/* Correct Answer (text) */}
      {needsCorrectAnswer && type !== 'true_false' && (
        <div className="space-y-2">
          <Label>Correct Answer</Label>
          <Input
            placeholder="Enter the correct answer..."
            value={content.correctAnswer || ''}
            onChange={(e) => handleChange('correctAnswer', e.target.value)}
          />
        </div>
      )}

      {/* Explanation */}
      <div className="space-y-2">
        <Label>Explanation (optional)</Label>
        <Textarea
          placeholder="Explain the answer..."
          value={content.explanation || ''}
          onChange={(e) => handleChange('explanation', e.target.value)}
          rows={2}
        />
      </div>

      {/* Solution */}
      <div className="space-y-2">
        <Label>Solution (optional)</Label>
        <Textarea
          placeholder="Step-by-step solution..."
          value={content.solution || ''}
          onChange={(e) => handleChange('solution', e.target.value)}
          rows={3}
        />
      </div>

      {/* Hints */}
      <div className="space-y-2">
        <Label>Hints (optional, one per line)</Label>
        <Textarea
          placeholder="Enter hints, one per line..."
          value={(content.hints || []).join('\n')}
          onChange={(e) => handleChange('hints', e.target.value.split('\n').filter(Boolean))}
          rows={2}
        />
      </div>
    </div>
  );
}
