'use client';

import { Star, Users, Clock, BookOpen, TrendingUp, CheckCircle2 } from 'lucide-react';

function KPICard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

export default function CourseKPICards({ analytics }) {
  const a = analytics || {};
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard icon={Users} label="Enrolled" value={a.enrollmentCount || 0} />
      <KPICard icon={CheckCircle2} label="Completed" value={`${(a.completionRate || 0).toFixed(0)}%`} />
      <KPICard icon={TrendingUp} label="Avg Progress" value={`${(a.avgProgress || 0).toFixed(0)}%`} />
      <KPICard icon={Star} label="Avg Rating" value={a.avgRating ? a.avgRating.toFixed(1) : '-'} />
      <KPICard icon={Clock} label="Avg Time" value={`${Math.round((a.avgTimeSpent || 0) / 60)} min`} />
      <KPICard icon={BookOpen} label="Total Lessons" value={a.totalLessons || 0} />
    </div>
  );
}
