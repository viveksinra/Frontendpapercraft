'use client';

import { Plus, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────

export default function AddOnEditor({ addOns = [], onChange }) {
  function addItem() {
    onChange([...addOns, { type: 'marking', title: '', description: '', price: '' }]);
  }

  function updateItem(index, field, value) {
    const updated = addOns.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  }

  function removeItem(index) {
    onChange(addOns.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Add-on Services</h4>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add
        </Button>
      </div>

      {addOns.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No add-ons yet. Add optional services like marking or feedback.
        </p>
      )}

      {addOns.map((addOn, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-md border bg-muted/30 p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Type</Label>
              <select
                value={addOn.type || 'marking'}
                onChange={(e) => updateItem(index, 'type', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="marking">Marking</option>
                <option value="feedback">Feedback</option>
                <option value="tutoring">Tutoring</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Title</Label>
              <Input
                placeholder="e.g. Expert Marking"
                value={addOn.title || ''}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 9.99"
                value={addOn.price ?? ''}
                onChange={(e) =>
                  updateItem(index, 'price', e.target.value ? parseFloat(e.target.value) : '')
                }
              />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <Label className="text-xs">Description</Label>
              <Input
                placeholder="Brief description..."
                value={addOn.description || ''}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
              />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
