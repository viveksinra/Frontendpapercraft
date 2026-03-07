'use client';

import { Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

import DifficultyMixEditor from './DifficultyMixEditor';
import TopicDistributionEditor from './TopicDistributionEditor';

export default function BlueprintSectionCard({ section, index, onChange, onRemove }) {
  const update = (field, value) => {
    onChange(index, { ...section, [field]: value });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Section {index + 1}</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onRemove(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Section Name</Label>
            <Input value={section.name || ''} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Section A - MCQ" />
          </div>
          <div>
            <Label>Question Count</Label>
            <Input type="number" min={1} value={section.questionCount || 0} onChange={(e) => update('questionCount', Number(e.target.value))} />
          </div>
          <div>
            <Label>Marks Per Question</Label>
            <Input type="number" min={1} value={section.marksPerQuestion || 1} onChange={(e) => update('marksPerQuestion', Number(e.target.value))} />
          </div>
          <div>
            <Label>Time Limit (min)</Label>
            <Input type="number" min={0} value={section.timeLimitMinutes || ''} onChange={(e) => update('timeLimitMinutes', Number(e.target.value) || undefined)} placeholder="Optional" />
          </div>
          <div className="sm:col-span-2">
            <Label>Question Types (comma-separated)</Label>
            <Input
              value={(section.questionTypes || []).join(', ')}
              onChange={(e) => update('questionTypes', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="e.g. mcq, short-answer"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Instructions</Label>
            <Input value={section.instructions || ''} onChange={(e) => update('instructions', e.target.value)} placeholder="Answer all questions..." />
          </div>
        </div>

        <TopicDistributionEditor
          topics={section.topicDistribution || {}}
          onChange={(v) => update('topicDistribution', v)}
        />

        <DifficultyMixEditor
          mix={section.difficultyMix || { easy: 25, medium: 50, hard: 20, expert: 5 }}
          onChange={(v) => update('difficultyMix', v)}
        />
      </CardContent>
    </Card>
  );
}
