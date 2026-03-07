'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import ConstraintsPanel from './ConstraintsPanel';
import BlueprintSectionCard from './BlueprintSectionCard';

export default function BlueprintEditor({ blueprint, onSave, onCancel, saving = false }) {
  const [name, setName] = useState(blueprint?.name || '');
  const [totalMarks, setTotalMarks] = useState(blueprint?.totalMarks || 100);
  const [totalTimeMinutes, setTotalTimeMinutes] = useState(blueprint?.totalTimeMinutes || 60);
  const [sections, setSections] = useState(blueprint?.sections || []);
  const [constraints, setConstraints] = useState(blueprint?.constraints || {});

  const handleSectionChange = (index, updated) => {
    setSections((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  const handleSectionRemove = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        name: `Section ${prev.length + 1}`,
        questionCount: 10,
        questionTypes: ['mcq'],
        marksPerQuestion: 1,
        difficultyMix: { easy: 25, medium: 50, hard: 20, expert: 5 },
        topicDistribution: {},
      },
    ]);
  };

  const handleSubmit = () => {
    onSave?.({
      name,
      totalMarks,
      totalTimeMinutes,
      sections,
      constraints,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <Label>Blueprint Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. FSCE Mock Test Blueprint" />
            </div>
            <div>
              <Label>Total Marks</Label>
              <Input type="number" min={1} value={totalMarks} onChange={(e) => setTotalMarks(Number(e.target.value))} />
            </div>
            <div>
              <Label>Total Time (minutes)</Label>
              <Input type="number" min={1} value={totalTimeMinutes} onChange={(e) => setTotalTimeMinutes(Number(e.target.value))} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sections ({sections.length})</h3>
        <Button variant="outline" onClick={handleAddSection}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Section
        </Button>
      </div>

      {sections.map((section, i) => (
        <BlueprintSectionCard
          key={i}
          section={section}
          index={i}
          onChange={handleSectionChange}
          onRemove={handleSectionRemove}
        />
      ))}

      {sections.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No sections yet. Add one to get started.
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <ConstraintsPanel constraints={constraints} onChange={setConstraints} />
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button onClick={handleSubmit} disabled={saving || !name.trim()}>
          {saving ? 'Saving...' : blueprint?._id || blueprint?.id ? 'Update Blueprint' : 'Create Blueprint'}
        </Button>
      </div>
    </div>
  );
}
