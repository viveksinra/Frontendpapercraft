'use client';

import { useState } from 'react';
import { FileText, ListChecks, Search, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SourceSelector({ paperId, sections, onChange }) {
  const [sourceType, setSourceType] = useState(paperId ? 'paper' : 'manual');
  const [paperSearch, setPaperSearch] = useState('');

  const handleSourceTypeChange = (type) => {
    setSourceType(type);
    if (type === 'paper') {
      onChange({ paperId: paperId || '', sections: [] });
    } else {
      onChange({
        paperId: null,
        sections: sections?.length
          ? sections
          : [{ name: 'Section 1', questions: [], instructions: '' }],
      });
    }
  };

  const handlePaperSelect = (id) => {
    onChange({ paperId: id, sections: [] });
  };

  const handleAddSection = () => {
    const updated = [
      ...(sections || []),
      { name: `Section ${(sections?.length || 0) + 1}`, questions: [], instructions: '' },
    ];
    onChange({ paperId: null, sections: updated });
  };

  const handleRemoveSection = (index) => {
    const updated = (sections || []).filter((_, i) => i !== index);
    onChange({ paperId: null, sections: updated });
  };

  const handleSectionNameChange = (index, name) => {
    const updated = (sections || []).map((s, i) => (i === index ? { ...s, name } : s));
    onChange({ paperId: null, sections: updated });
  };

  const handleSectionInstructionsChange = (index, instructions) => {
    const updated = (sections || []).map((s, i) =>
      i === index ? { ...s, instructions } : s
    );
    onChange({ paperId: null, sections: updated });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Question Source</h3>

      {/* Source type selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleSourceTypeChange('paper')}
          className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
            sourceType === 'paper'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40'
          }`}
        >
          <FileText className={`h-5 w-5 mt-0.5 ${sourceType === 'paper' ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <p className="font-medium text-sm">From existing paper</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Use all questions from a published paper
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSourceTypeChange('manual')}
          className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
            sourceType === 'manual'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40'
          }`}
        >
          <ListChecks className={`h-5 w-5 mt-0.5 ${sourceType === 'manual' ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <p className="font-medium text-sm">Pick questions manually</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Build sections and select individual questions
            </p>
          </div>
        </button>
      </div>

      {/* Paper search / select */}
      {sourceType === 'paper' && (
        <div className="space-y-3 rounded-lg border p-4">
          <Label>Search Papers</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by paper title..."
              value={paperSearch}
              onChange={(e) => setPaperSearch(e.target.value)}
            />
          </div>
          {paperId && (
            <div className="flex items-center gap-2 rounded-md bg-primary/5 border border-primary/20 px-3 py-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Paper selected: {paperId}</span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="ml-auto"
                onClick={() => handlePaperSelect('')}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
          {!paperId && (
            <p className="text-xs text-muted-foreground">
              Search and select a paper above. All questions from that paper will be used.
            </p>
          )}
        </div>
      )}

      {/* Manual section builder */}
      {sourceType === 'manual' && (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Label>Sections</Label>
            <Button variant="outline" size="sm" onClick={handleAddSection}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Section
            </Button>
          </div>
          <div className="space-y-3">
            {(sections || []).map((section, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-md border bg-muted/30 p-3"
              >
                <div className="flex-1 space-y-2">
                  <Input
                    value={section.name}
                    onChange={(e) => handleSectionNameChange(index, e.target.value)}
                    placeholder="Section name"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={section.instructions || ''}
                    onChange={(e) => handleSectionInstructionsChange(index, e.target.value)}
                    placeholder="Instructions (optional)"
                    className="h-8 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {section.questions?.length || 0} question(s)
                  </p>
                </div>
                {(sections || []).length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="mt-1 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveSection(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
