'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'very_hard', label: 'Very Hard' },
];

export default function MetadataSidebar({ metadata, onChange, subjects = [] }) {
  const [tagInput, setTagInput] = useState('');

  // Build cascading selects from flat subjects
  const topLevelSubjects = subjects.filter((s) => !s.parentId);
  const chapters = subjects.filter((s) => s.parentId && s.parentId === metadata.subjectId);
  const topics = subjects.filter((s) => s.parentId && s.parentId === metadata.chapterId);
  const subtopics = subjects.filter((s) => s.parentId && s.parentId === metadata.topicId);

  const handleChange = (field, value) => {
    const updated = { ...metadata, [field]: value };
    // Clear child selections when parent changes
    if (field === 'subjectId') {
      updated.chapterId = '';
      updated.topicId = '';
      updated.subtopicId = '';
    } else if (field === 'chapterId') {
      updated.topicId = '';
      updated.subtopicId = '';
    } else if (field === 'topicId') {
      updated.subtopicId = '';
    }
    onChange(updated);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...(metadata.tags || []), tagInput.trim().toLowerCase()];
      onChange({ ...metadata, tags: [...new Set(newTags)] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    onChange({ ...metadata, tags: (metadata.tags || []).filter((t) => t !== tag) });
  };

  return (
    <div className="w-72 shrink-0 space-y-4 border-l pl-6">
      <h3 className="text-sm font-semibold">Metadata</h3>

      {/* Subject Hierarchy */}
      <div className="space-y-2">
        <Label className="text-xs">Subject</Label>
        <Select value={metadata.subjectId || ''} onValueChange={(val) => handleChange('subjectId', val)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {topLevelSubjects.map((s) => (
              <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {chapters.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs">Chapter</Label>
          <Select value={metadata.chapterId || ''} onValueChange={(val) => handleChange('chapterId', val)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select chapter" />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((s) => (
                <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {topics.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs">Topic</Label>
          <Select value={metadata.topicId || ''} onValueChange={(val) => handleChange('topicId', val)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((s) => (
                <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Difficulty */}
      <div className="space-y-2">
        <Label className="text-xs">Difficulty</Label>
        <Select value={metadata.difficulty || 'medium'} onValueChange={(val) => handleChange('difficulty', val)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Marks */}
      <div className="space-y-2">
        <Label className="text-xs">Marks</Label>
        <Input
          type="number"
          min="0"
          max="100"
          className="h-8 text-xs"
          value={metadata.marks ?? 1}
          onChange={(e) => handleChange('marks', parseFloat(e.target.value) || 0)}
        />
      </div>

      {/* Negative Marks */}
      <div className="space-y-2">
        <Label className="text-xs">Negative Marks</Label>
        <Input
          type="number"
          min="0"
          max="100"
          className="h-8 text-xs"
          value={metadata.negativeMarks ?? 0}
          onChange={(e) => handleChange('negativeMarks', parseFloat(e.target.value) || 0)}
        />
      </div>

      {/* Expected Time */}
      <div className="space-y-2">
        <Label className="text-xs">Expected Time (seconds)</Label>
        <Input
          type="number"
          min="0"
          className="h-8 text-xs"
          value={metadata.expectedTime ?? 60}
          onChange={(e) => handleChange('expectedTime', parseInt(e.target.value) || 0)}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-xs">Tags</Label>
        <Input
          placeholder="Press Enter to add tag"
          className="h-8 text-xs"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
        />
        <div className="flex flex-wrap gap-1">
          {(metadata.tags || []).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs gap-1">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
