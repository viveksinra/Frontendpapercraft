'use client';

import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { listTemplates } from 'src/lib/paper-template-api';
import { listBlueprints } from 'src/lib/paper-blueprint-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

export default function BlueprintSelector({ title, onTitleChange, selectedBlueprintId, onSelectBlueprint, selectedTemplateId, onSelectTemplate }) {
  const companyId = getActiveCompanyIdFromCookie();
  const [blueprints, setBlueprints] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    Promise.all([
      listBlueprints(companyId),
      listTemplates(companyId),
    ])
      .then(([bpData, tplData]) => {
        setBlueprints(bpData.blueprints || bpData.data || []);
        setTemplates(tplData.templates || tplData.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Paper Title</Label>
        <Input value={title} onChange={(e) => onTitleChange(e.target.value)} placeholder="e.g. Auto-Generated FSCE Mock" />
      </div>

      <div>
        <Label>Select Blueprint</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {blueprints.map((bp) => {
            const id = bp._id || bp.id;
            const isSelected = selectedBlueprintId === id;
            return (
              <Card
                key={id}
                className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
                onClick={() => onSelectBlueprint(id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{bp.name}</h3>
                    {bp.isPreBuilt && <Badge variant="secondary" className="text-[10px]">Pre-built</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {bp.sections?.length || 0} sections &middot; {bp.totalMarks || 0} marks &middot; {bp.totalTimeMinutes || 0} min
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {blueprints.length === 0 && (
          <p className="text-center py-8 text-muted-foreground text-sm">No blueprints available.</p>
        )}
      </div>

      <div>
        <Label>Select Template</Label>
        <Select value={selectedTemplateId || ''} onValueChange={onSelectTemplate}>
          <SelectTrigger className="w-full sm:w-[300px] mt-2">
            <SelectValue placeholder="Choose a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((t) => (
              <SelectItem key={t._id || t.id} value={t._id || t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
