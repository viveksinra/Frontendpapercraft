'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

const LEVELS = [
  { value: 'subject', label: 'Subject' },
  { value: 'chapter', label: 'Chapter' },
  { value: 'topic', label: 'Topic' },
  { value: 'subtopic', label: 'Subtopic' },
];

export default function SubjectFormDialog({ open, onOpenChange, subject, parentId, onSave, saving }) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('subject');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (subject) {
      setName(subject.name || '');
      setLevel(subject.level || 'subject');
      setDescription(subject.description || '');
    } else {
      setName('');
      setDescription('');
      // Auto-detect level based on parent
      if (!parentId) {
        setLevel('subject');
      } else {
        setLevel('chapter'); // Default, user can change
      }
    }
  }, [subject, parentId, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = { name: name.trim(), level, description: description.trim() };
    if (parentId && !subject) {
      data.parentId = parentId;
    }
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{subject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Mathematics, Algebra, Linear Equations"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? 'Saving...' : subject ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
