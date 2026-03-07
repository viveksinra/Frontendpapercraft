'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

import SectionEditor from './SectionEditor';

export default function SectionList({ sections = [], onChange }) {
  const handleSectionUpdate = (index, updated) => {
    const next = sections.map((s, i) => (i === index ? updated : s));
    onChange(next);
  };

  const handleRemove = (index) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([
      ...sections,
      { name: `Section ${String.fromCharCode(65 + sections.length)}`, questions: [], instructions: '' },
    ]);
  };

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Section {i + 1}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleRemove(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SectionEditor section={section} onChange={(updated) => handleSectionUpdate(i, updated)} />
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={handleAdd}>
        <Plus className="mr-1.5 h-4 w-4" /> Add Section
      </Button>
    </div>
  );
}
