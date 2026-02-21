'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';

import HeaderEditor from './HeaderEditor';
import FooterEditor from './FooterEditor';
import FormattingEditor from './FormattingEditor';
import TemplatePreview from './TemplatePreview';

export default function TemplateEditor({ open, onOpenChange, template, onSave, saving = false }) {
  const isEdit = !!template?._id || !!template?.id;
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [layout, setLayout] = useState(template?.layout || {});

  const updateLayout = (section, value) => {
    setLayout((prev) => ({ ...prev, [section]: value }));
  };

  const handleSave = () => {
    onSave?.({ name, description, layout });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Template' : 'Create Template'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Template" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
            </div>

            <Tabs defaultValue="header" className="mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="header" className="flex-1">Header</TabsTrigger>
                <TabsTrigger value="instructions" className="flex-1">Instructions</TabsTrigger>
                <TabsTrigger value="footer" className="flex-1">Footer</TabsTrigger>
                <TabsTrigger value="formatting" className="flex-1">Format</TabsTrigger>
              </TabsList>
              <TabsContent value="header" className="mt-4">
                <HeaderEditor header={layout.header} onChange={(v) => updateLayout('header', v)} />
              </TabsContent>
              <TabsContent value="instructions" className="mt-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Instructions</h4>
                  <div>
                    <Label>Position</Label>
                    <Input value={layout.instructions?.position || 'top'} onChange={(e) => updateLayout('instructions', { ...layout.instructions, position: e.target.value })} />
                  </div>
                  <div>
                    <Label>Text</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={layout.instructions?.text || ''}
                      onChange={(e) => updateLayout('instructions', { ...layout.instructions, text: e.target.value })}
                      placeholder="Answer all questions..."
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="footer" className="mt-4">
                <FooterEditor footer={layout.footer} onChange={(v) => updateLayout('footer', v)} />
              </TabsContent>
              <TabsContent value="formatting" className="mt-4">
                <FormattingEditor formatting={layout.formatting} onChange={(v) => updateLayout('formatting', v)} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div className="hidden lg:block">
            <TemplatePreview layout={layout} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? 'Saving...' : isEdit ? 'Update Template' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
