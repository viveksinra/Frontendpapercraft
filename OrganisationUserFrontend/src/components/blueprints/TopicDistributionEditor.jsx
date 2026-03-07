'use client';

import { X, Plus } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function TopicDistributionEditor({ topics = {}, onChange }) {
  const entries = Object.entries(topics);
  const total = entries.reduce((sum, [, v]) => sum + (Number(v) || 0), 0);
  const isValid = total === 100;

  const handleUpdate = (key, value) => {
    onChange({ ...topics, [key]: Number(value) || 0 });
  };

  const handleRemove = (key) => {
    const next = { ...topics };
    delete next[key];
    onChange(next);
  };

  const handleAdd = () => {
    const name = `Topic ${entries.length + 1}`;
    onChange({ ...topics, [name]: 0 });
  };

  const handleRename = (oldKey, newKey) => {
    if (newKey === oldKey || !newKey.trim()) return;
    const next = {};
    for (const [k, v] of entries) {
      next[k === oldKey ? newKey : k] = v;
    }
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Topic Distribution</Label>
        <span className={`text-xs font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          Total: {total}% {isValid ? '' : '(must be 100%)'}
        </span>
      </div>
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <Input
            className="flex-1"
            defaultValue={key}
            onBlur={(e) => handleRename(key, e.target.value)}
            placeholder="Topic name"
          />
          <Input
            type="number"
            min={0}
            max={100}
            className="w-20"
            value={value}
            onChange={(e) => handleUpdate(key, e.target.value)}
          />
          <span className="text-xs text-muted-foreground w-4">%</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleRemove(key)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={handleAdd}>
        <Plus className="mr-1 h-3.5 w-3.5" /> Add Topic
      </Button>
      {/* Visual bar */}
      {entries.length > 0 && (
        <div className="flex h-3 rounded-full overflow-hidden bg-muted">
          {entries.map(([key, value], i) => {
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-red-500'];
            return (
              <div
                key={key}
                className={`${colors[i % colors.length]} transition-all`}
                style={{ width: `${value}%` }}
                title={`${key}: ${value}%`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
