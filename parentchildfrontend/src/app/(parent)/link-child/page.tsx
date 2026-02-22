'use client';

import { useState } from 'react';
import { LinkChildForm } from '@/components/parent/LinkChildForm';
import { CreateChildForm } from '@/components/parent/CreateChildForm';

export default function AddChildPage() {
  const [activeTab, setActiveTab] = useState<'link' | 'create'>('link');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add a Child</h1>
        <p className="mt-1 text-muted-foreground">
          Link an existing child using their student code, or create a new child account.
        </p>
      </div>

      {/* Tab buttons */}
      <div className="mx-auto flex max-w-md overflow-hidden rounded-lg border">
        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'link'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-muted/50'
          }`}
        >
          Link Existing Child
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'create'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-muted/50'
          }`}
        >
          Create New Child
        </button>
      </div>

      {activeTab === 'link' ? <LinkChildForm /> : <CreateChildForm />}
    </div>
  );
}
