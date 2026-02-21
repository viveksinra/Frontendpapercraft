'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];
const COLORS = {
  easy: 'bg-green-500',
  medium: 'bg-blue-500',
  hard: 'bg-orange-500',
  expert: 'bg-red-500',
};

export default function DifficultyMixEditor({ mix = {}, onChange }) {
  const total = DIFFICULTIES.reduce((sum, d) => sum + (Number(mix[d]) || 0), 0);
  const isValid = total === 100;

  const handleUpdate = (key, value) => {
    onChange({ ...mix, [key]: Number(value) || 0 });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Difficulty Mix</Label>
        <span className={`text-xs font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          Total: {total}% {isValid ? '' : '(must be 100%)'}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DIFFICULTIES.map((d) => (
          <div key={d}>
            <label className="text-xs font-medium capitalize text-muted-foreground">{d}</label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={0}
                max={100}
                value={mix[d] || 0}
                onChange={(e) => handleUpdate(d, e.target.value)}
                className="text-center"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
        ))}
      </div>
      {/* Pie chart approximation using a stacked bar */}
      <div className="flex h-4 rounded-full overflow-hidden bg-muted">
        {DIFFICULTIES.map((d) => (
          <div
            key={d}
            className={`${COLORS[d]} transition-all`}
            style={{ width: `${mix[d] || 0}%` }}
            title={`${d}: ${mix[d] || 0}%`}
          />
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {DIFFICULTIES.map((d) => (
          <div key={d} className="flex items-center gap-1.5 text-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${COLORS[d]}`} />
            <span className="capitalize">{d}: {mix[d] || 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
