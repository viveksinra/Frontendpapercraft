'use client';

import { useState, useEffect } from 'react';
import { Bold, List, Italic, Heading1, Heading2, Link as LinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function RichTextLessonEditor({ value = '', onChange }) {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  function handleChange(e) {
    const newVal = e.target.innerHTML;
    setContent(newVal);
    onChange?.(newVal);
  }

  function exec(cmd, val = null) {
    document.execCommand(cmd, false, val);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border rounded-md p-1">
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => exec('bold')}>
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => exec('italic')}>
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => exec('formatBlock', 'h1')}>
          <Heading1 className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => exec('formatBlock', 'h2')}>
          <Heading2 className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => exec('insertUnorderedList')}>
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) exec('createLink', url);
          }}
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Editor area */}
      <div
        contentEditable
        className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleChange}
      />
    </div>
  );
}
