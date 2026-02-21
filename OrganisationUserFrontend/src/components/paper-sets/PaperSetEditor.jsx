'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

export default function PaperSetEditor({ paperSet, onSave, onCancel, saving = false }) {
  const [title, setTitle] = useState(paperSet?.title || '');
  const [description, setDescription] = useState(paperSet?.description || '');
  const [examType, setExamType] = useState(paperSet?.examType || '');
  const [yearGroup, setYearGroup] = useState(paperSet?.yearGroup || '');
  const [subjectCategory, setSubjectCategory] = useState(paperSet?.subjectCategory || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({ title, description, examType, yearGroup, subjectCategory });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. FSCE 2026 Paper Set" required />
      </div>
      <div>
        <Label>Description</Label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Exam Type</Label>
          <Select value={examType} onValueChange={setExamType}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="FSCE">FSCE</SelectItem>
              <SelectItem value="CSSE">CSSE</SelectItem>
              <SelectItem value="11+">11+</SelectItem>
              <SelectItem value="Practice">Practice</SelectItem>
              <SelectItem value="Mock">Mock</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Year Group</Label>
          <Input value={yearGroup} onChange={(e) => setYearGroup(e.target.value)} placeholder="e.g. Year 6" />
        </div>
        <div>
          <Label>Subject Category</Label>
          <Input value={subjectCategory} onChange={(e) => setSubjectCategory(e.target.value)} placeholder="e.g. Maths" />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        {onCancel && <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" disabled={saving || !title.trim()}>
          {saving ? 'Saving...' : paperSet?._id || paperSet?.id ? 'Update' : 'Create Paper Set'}
        </Button>
      </div>
    </form>
  );
}
