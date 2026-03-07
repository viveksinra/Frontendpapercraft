'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TemplateCard from './TemplateCard';

export default function TemplateGallery({ templates = [], onClone, onEdit, onDelete, onSelect }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = templates.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'prebuilt') return t.isPreBuilt;
    if (tab === 'custom') return !t.isPreBuilt;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({templates.length})</TabsTrigger>
          <TabsTrigger value="prebuilt">Pre-Built ({templates.filter((t) => t.isPreBuilt).length})</TabsTrigger>
          <TabsTrigger value="custom">Custom ({templates.filter((t) => !t.isPreBuilt).length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No templates found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((t) => (
            <TemplateCard
              key={t._id || t.id}
              template={t}
              onClone={onClone}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
