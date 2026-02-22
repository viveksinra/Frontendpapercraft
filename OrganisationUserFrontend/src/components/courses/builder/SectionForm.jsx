'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SectionForm({ initialTitle = '', onSubmit, onCancel, saving = false }) {
  const [title, setTitle] = useState(initialTitle);

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim()) onSubmit(title.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        placeholder="Section title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        className="flex-1"
      />
      <Button type="submit" size="sm" disabled={!title.trim() || saving}>
        {saving && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
        Save
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
}
