'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

export default function MappingStep({ subjects = [], subjectMapping, onSubjectMappingChange, defaultMetadata, onDefaultMetadataChange }) {
  const topLevel = subjects.filter((s) => !s.parentId);
  const chapters = subjects.filter((s) => s.parentId === subjectMapping.subjectId);
  const topics = subjects.filter((s) => s.parentId === subjectMapping.chapterId);

  const handleSubjectChange = (field, value) => {
    const actual = value === '__none__' ? '' : value;
    const updated = { ...subjectMapping, [field]: actual };
    if (field === 'subjectId') { updated.chapterId = ''; updated.topicId = ''; }
    if (field === 'chapterId') { updated.topicId = ''; }
    onSubjectMappingChange(updated);
  };

  const handleMetaChange = (field, value) => {
    onDefaultMetadataChange({ ...defaultMetadata, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Subject Mapping</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Assign all imported questions to a subject hierarchy. Individual question subjects from the file will override this.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Subject</Label>
            <Select value={subjectMapping.subjectId || ''} onValueChange={(val) => handleSubjectChange('subjectId', val)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {topLevel.map((s) => (
                  <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {chapters.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs">Chapter</Label>
              <Select value={subjectMapping.chapterId || ''} onValueChange={(val) => handleSubjectChange('chapterId', val)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
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
              <Select value={subjectMapping.topicId || ''} onValueChange={(val) => handleSubjectChange('topicId', val)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {topics.map((s) => (
                    <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Default Metadata</h3>
        <p className="text-xs text-muted-foreground mb-4">
          These defaults apply to questions that don't have metadata set in the file.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Default Difficulty</Label>
            <Select value={defaultMetadata.difficulty || 'medium'} onValueChange={(val) => handleMetaChange('difficulty', val)}>
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
          <div className="space-y-2">
            <Label className="text-xs">Default Marks</Label>
            <Input
              type="number"
              min="0"
              className="h-8 text-xs"
              value={defaultMetadata.marks ?? 1}
              onChange={(e) => handleMetaChange('marks', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Tags (comma-separated)</Label>
            <Input
              className="h-8 text-xs"
              placeholder="tag1, tag2"
              value={(defaultMetadata.tags || []).join(', ')}
              onChange={(e) => handleMetaChange('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
