'use client';

import { getQualificationBandColor } from '@papercraft/shared';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ----------------------------------------------------------------------

export default function ElevenPlusPanel({ data }) {
  if (!data) return null;

  const { band, components, cohort } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>11+ Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Qualification Band */}
        {band && (
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Qualification Band</p>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: getQualificationBandColor(band.band) }}
              >
                {band.band || 'N/A'}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Avg Score</p>
              <p className="text-lg font-bold">{band.avgScore?.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Confidence</p>
              <p className="text-sm font-medium capitalize">{band.confidence}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Mock Tests</p>
              <p className="text-sm font-medium">{band.testCount}</p>
            </div>
          </div>
        )}

        {/* Cohort Percentile */}
        {cohort && cohort.cohortSize > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Cohort Percentile</p>
            <p className="text-sm">
              <span className="font-bold">{cohort.percentile}th</span> percentile out of{' '}
              {cohort.cohortSize} students
            </p>
          </div>
        )}

        {/* Component Scores */}
        {components?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Component Scores</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {components.map((c) => (
                <div key={c.component} className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">{c.component}</p>
                  <p className="text-lg font-bold">{c.avgPercentage?.toFixed(1)}%</p>
                  <p className={`text-xs ${c.trend > 0 ? 'text-green-600' : c.trend < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {c.trend > 0 ? `+${c.trend.toFixed(1)}%` : c.trend < 0 ? `${c.trend.toFixed(1)}%` : '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
