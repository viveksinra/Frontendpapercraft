'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Flame, Sparkles } from 'lucide-react';

interface WelcomeCardProps {
  name: string;
  orgName?: string;
  streak?: number;
}

export function WelcomeCard({ name, orgName, streak = 0 }: WelcomeCardProps) {
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back, {name}!
            </h2>
          </div>
          {orgName && (
            <p className="text-sm text-muted-foreground">{orgName}</p>
          )}
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 dark:bg-orange-950">
            <Flame className="h-5 w-5 text-orange-500" />
            <div className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              {streak} day streak
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
