'use client';

import { Circle, CheckCircle2, WifiOff } from 'lucide-react';

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function StatusIcon({ status }) {
  switch (status) {
    case 'connected':
    case 'in_progress':
      return <Circle className="h-3 w-3 fill-green-500 text-green-500" />;
    case 'submitted':
      return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
    case 'disconnected':
    default:
      return <WifiOff className="h-3 w-3 text-gray-400" />;
  }
}

function statusLabel(status) {
  switch (status) {
    case 'connected':
      return 'Connected';
    case 'in_progress':
      return 'In Progress';
    case 'submitted':
      return 'Submitted';
    case 'disconnected':
      return 'Disconnected';
    default:
      return status || 'Unknown';
  }
}

export default function StudentProgressRow({ student }) {
  if (!student) return null;

  const answered = student.answeredCount ?? 0;
  const total = student.totalQuestions ?? 0;
  const progressPct = total > 0 ? ((answered / total) * 100).toFixed(0) : 0;

  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-2 align-middle">
        <div className="flex items-center gap-2">
          <StatusIcon status={student.status} />
          <span className="font-medium text-sm">
            {student.studentName || student.studentEmail || 'Unknown'}
          </span>
        </div>
      </td>
      <td className="p-2 align-middle">
        <span className="text-sm text-muted-foreground capitalize">
          {statusLabel(student.status)}
        </span>
      </td>
      <td className="p-2 align-middle">
        <span className="text-sm text-muted-foreground">
          {student.currentSection ?? '--'}
        </span>
      </td>
      <td className="p-2 align-middle">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-12">
            {answered}/{total}
          </span>
        </div>
      </td>
      <td className="p-2 align-middle text-right">
        <span className="text-sm text-muted-foreground">
          {formatTime(student.timeRemaining ?? student.elapsedTime)}
        </span>
      </td>
    </tr>
  );
}
