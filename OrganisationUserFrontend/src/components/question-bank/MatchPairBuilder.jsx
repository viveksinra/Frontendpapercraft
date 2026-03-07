'use client';

import { Plus, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MatchPairBuilder({ pairs = [], onChange }) {
  const handleAdd = () => {
    onChange([...pairs, { left: '', right: '' }]);
  };

  const handleRemove = (index) => {
    onChange(pairs.filter((_, i) => i !== index));
  };

  const handleChange = (index, side, value) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [side]: value };
    onChange(newPairs);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Match Pairs</label>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center text-xs font-medium text-muted-foreground">
        <span>Column A</span>
        <span>Column B</span>
        <span className="w-8" />
      </div>
      {pairs.map((pair, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <Input
            placeholder={`Item ${index + 1}`}
            value={pair.left}
            onChange={(e) => handleChange(index, 'left', e.target.value)}
          />
          <Input
            placeholder={`Match ${index + 1}`}
            value={pair.right}
            onChange={(e) => handleChange(index, 'right', e.target.value)}
          />
          <Button variant="ghost" size="sm" onClick={() => handleRemove(index)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={handleAdd}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Pair
      </Button>
    </div>
  );
}
