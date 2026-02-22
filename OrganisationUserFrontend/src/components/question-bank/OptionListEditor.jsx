'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

export default function OptionListEditor({ options = [], onChange, multiSelect = false }) {
  const handleAdd = () => {
    const label = String.fromCharCode(65 + options.length);
    onChange([...options, { label, text: '', isCorrect: false, explanation: '' }]);
  };

  const handleRemove = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    // Re-label
    const relabeled = newOptions.map((opt, i) => ({
      ...opt,
      label: String.fromCharCode(65 + i),
    }));
    onChange(relabeled);
  };

  const handleChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };

    // For single-select, uncheck others when one is checked
    if (field === 'isCorrect' && value && !multiSelect) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }

    onChange(newOptions);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Options</label>
      {options.map((opt, index) => (
        <div key={index} className="flex items-start gap-2 p-3 rounded-lg border bg-card">
          <GripVertical className="h-4 w-4 mt-2 text-muted-foreground shrink-0 cursor-grab" />
          <div className="flex items-center gap-2 mt-1.5 shrink-0">
            <Checkbox
              checked={opt.isCorrect}
              onCheckedChange={(checked) => handleChange(index, 'isCorrect', !!checked)}
            />
            <span className="text-sm font-medium w-5">{opt.label}.</span>
          </div>
          <div className="flex-1 space-y-2">
            <Input
              placeholder={`Option ${opt.label} text`}
              value={opt.text}
              onChange={(e) => handleChange(index, 'text', e.target.value)}
            />
            <Textarea
              placeholder="Explanation (optional)"
              value={opt.explanation || ''}
              onChange={(e) => handleChange(index, 'explanation', e.target.value)}
              rows={1}
              className="text-xs resize-none"
            />
          </div>
          <Button variant="ghost" size="sm" className="shrink-0 mt-1" onClick={() => handleRemove(index)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={handleAdd}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Option
      </Button>
    </div>
  );
}
