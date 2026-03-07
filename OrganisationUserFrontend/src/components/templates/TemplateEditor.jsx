'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Heading,
  Palette,
  FileText,
  PanelBottom,
  MessageSquareText,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

import HeaderEditor from './HeaderEditor';
import FooterEditor from './FooterEditor';
import TemplatePreview from './TemplatePreview';
import FormattingEditor from './FormattingEditor';

const sections = [
  { id: 'general', label: 'General', icon: FileText },
  { id: 'header', label: 'Header', icon: Heading },
  { id: 'instructions', label: 'Instructions', icon: MessageSquareText },
  { id: 'footer', label: 'Footer', icon: PanelBottom },
  { id: 'formatting', label: 'Format', icon: Palette },
];

export default function TemplateEditor({ open, onOpenChange, template, onSave, saving = false }) {
  const isEdit = !!template?._id || !!template?.id;
  const [activeSection, setActiveSection] = useState('general');
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [layout, setLayout] = useState(template?.layout || {});

  // Reset state when template changes or sheet opens
  useEffect(() => {
    if (open) {
      setActiveSection('general');
      setName(template?.name || '');
      setDescription(template?.description || '');
      setLayout(template?.layout || {});
    }
  }, [open, template]);

  const updateLayout = (section, value) => {
    setLayout((prev) => ({ ...prev, [section]: value }));
  };

  const handleSave = () => {
    onSave?.({ name, description, layout });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-full p-0 gap-0"
      >
        <div className="flex h-full flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenChange?.(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-base font-semibold">
                  {isEdit ? 'Edit Template' : 'Create Template'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Configure your paper template layout and formatting
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving || !name.trim()}>
                {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar nav */}
            <nav className="hidden w-52 shrink-0 border-r bg-muted/30 sm:block">
              <div className="flex flex-col gap-1 p-3">
                {sections.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors text-left',
                      activeSection === id
                        ? 'bg-background font-medium text-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Mobile section tabs */}
            <div className="flex gap-1 overflow-x-auto border-b bg-muted/30 px-2 py-2 sm:hidden">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors',
                    activeSection === id
                      ? 'bg-background font-medium text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Form area */}
            <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="mx-auto max-w-lg">
                  {activeSection === 'general' && (
                    <SectionWrapper
                      title="General"
                      description="Give your template a name and description"
                    >
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Template Name</Label>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Final Exam Paper"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Description</Label>
                          <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description of this template"
                          />
                          <p className="text-xs text-muted-foreground">
                            Helps you identify this template later
                          </p>
                        </div>
                      </div>
                    </SectionWrapper>
                  )}

                  {activeSection === 'header' && (
                    <SectionWrapper
                      title="Header"
                      description="Configure the top section of your paper"
                    >
                      <HeaderEditor
                        header={layout.header}
                        onChange={(v) => updateLayout('header', v)}
                      />
                    </SectionWrapper>
                  )}

                  {activeSection === 'instructions' && (
                    <SectionWrapper
                      title="Instructions"
                      description="Add instructions that appear before the questions"
                    >
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Position</Label>
                          <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={layout.instructions?.position || 'top'}
                            onChange={(e) =>
                              updateLayout('instructions', {
                                ...layout.instructions,
                                position: e.target.value,
                              })
                            }
                          >
                            <option value="top">Top - Before questions</option>
                            <option value="bottom">Bottom - After questions</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Instruction Text</Label>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={layout.instructions?.text || ''}
                            onChange={(e) =>
                              updateLayout('instructions', {
                                ...layout.instructions,
                                text: e.target.value,
                              })
                            }
                            placeholder="e.g. Answer all questions. Write clearly in the space provided."
                          />
                          <p className="text-xs text-muted-foreground">
                            This text will be displayed to students before or after the questions
                          </p>
                        </div>
                      </div>
                    </SectionWrapper>
                  )}

                  {activeSection === 'footer' && (
                    <SectionWrapper
                      title="Footer"
                      description="Configure page numbers, copyright, and watermark"
                    >
                      <FooterEditor
                        footer={layout.footer}
                        onChange={(v) => updateLayout('footer', v)}
                      />
                    </SectionWrapper>
                  )}

                  {activeSection === 'formatting' && (
                    <SectionWrapper
                      title="Formatting"
                      description="Paper size, fonts, and margins"
                    >
                      <FormattingEditor
                        formatting={layout.formatting}
                        onChange={(v) => updateLayout('formatting', v)}
                      />
                    </SectionWrapper>
                  )}
                </div>
              </div>

              {/* Live preview */}
              <div className="hidden shrink-0 border-t bg-muted/20 p-4 lg:block lg:w-[380px] lg:border-t-0 lg:border-l lg:p-6">
                <div className="sticky top-0">
                  <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Live Preview
                  </p>
                  <TemplatePreview layout={layout} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SectionWrapper({ title, description, children }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
