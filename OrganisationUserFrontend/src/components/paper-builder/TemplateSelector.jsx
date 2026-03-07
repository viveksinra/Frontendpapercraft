'use client';

import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { listTemplates } from 'src/lib/paper-template-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import TemplateCard from 'src/components/templates/TemplateCard';

export default function TemplateSelector({ selectedTemplateId, onSelect }) {
  const companyId = getActiveCompanyIdFromCookie();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    listTemplates(companyId)
      .then((data) => setTemplates(data.templates || data.data || []))
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
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Choose a template for your paper layout:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div
            key={t._id || t.id}
            className={`rounded-lg transition-all ${
              selectedTemplateId === (t._id || t.id)
                ? 'ring-2 ring-primary'
                : ''
            }`}
          >
            <TemplateCard template={t} onSelect={onSelect} />
          </div>
        ))}
      </div>
      {templates.length === 0 && (
        <p className="text-center py-8 text-muted-foreground">No templates available. Create one first.</p>
      )}
    </div>
  );
}
