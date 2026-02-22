'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SectionScore {
  sectionName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

interface SectionBreakdownProps {
  sections: SectionScore[];
}

function getBarColor(pct: number): string {
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 60) return 'bg-blue-500';
  if (pct >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function SectionBreakdown({ sections }: SectionBreakdownProps) {
  if (sections.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Section Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section) => (
          <div key={section.sectionName} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{section.sectionName}</span>
              <span className="tabular-nums text-muted-foreground">
                {section.marksObtained}/{section.totalMarks} ({section.percentage.toFixed(0)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${getBarColor(section.percentage)}`}
                style={{ width: `${Math.min(100, section.percentage)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
