'use client';

import { Wifi, Play, Send, Clock, UserX } from 'lucide-react';

import { Card } from '@/components/ui/card';

const STAT_ITEMS = [
  { key: 'connected', label: 'Connected', icon: Wifi, color: 'text-green-600' },
  { key: 'started', label: 'Started', icon: Play, color: 'text-blue-600' },
  { key: 'submitted', label: 'Submitted', icon: Send, color: 'text-purple-600' },
  { key: 'inProgress', label: 'In Progress', icon: Clock, color: 'text-orange-600' },
  { key: 'missing', label: 'Missing', icon: UserX, color: 'text-red-600' },
];

export default function MonitorStatsBar({ stats = {} }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {STAT_ITEMS.map(({ key, label, icon: Icon, color }) => (
        <Card key={key} className="p-4">
          <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 ${color}`} />
            <div>
              <p className="text-xl font-bold">{stats[key] ?? 0}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
