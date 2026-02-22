'use client';

export default function CompletionFunnelChart({ lessonStats = [] }) {
  if (!lessonStats.length) {
    return <p className="text-sm text-muted-foreground">No lesson data available.</p>;
  }

  const maxCount = Math.max(...lessonStats.map((l) => l.completions || 0), 1);

  // Find biggest drop-off
  let biggestDrop = { index: -1, drop: 0 };
  for (let i = 1; i < lessonStats.length; i++) {
    const drop = (lessonStats[i - 1].completions || 0) - (lessonStats[i].completions || 0);
    if (drop > biggestDrop.drop) {
      biggestDrop = { index: i, drop };
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {lessonStats.map((lesson, i) => {
        const pct = maxCount > 0 ? ((lesson.completions || 0) / maxCount) * 100 : 0;
        const isDropOff = i === biggestDrop.index && biggestDrop.drop > 0;

        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-32 truncate">{lesson.title}</span>
            <div className="flex-1 bg-muted rounded-full h-4 relative">
              <div
                className={`h-4 rounded-full ${isDropOff ? 'bg-red-500' : 'bg-primary'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-12 text-right">{lesson.completions || 0}</span>
          </div>
        );
      })}

      {biggestDrop.index >= 0 && biggestDrop.drop > 0 && (
        <div className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
          Biggest drop-off: <strong>{lessonStats[biggestDrop.index]?.title}</strong> (-{biggestDrop.drop} completions)
        </div>
      )}
    </div>
  );
}
