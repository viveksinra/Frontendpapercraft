'use client';

import { useMemo } from 'react';
import {
  AlertTriangle,
  Save,
  CalendarClock,
  Zap,
  Clock,
  FileText,
  Settings,
  Users,
  CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MODE_LABELS = {
  live_mock: 'Live Mock',
  anytime_mock: 'Anytime Mock',
  practice: 'Practice',
  classroom: 'Classroom',
  section_timed: 'Section Timed',
};

function ReviewSection({ icon: Icon, title, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {title}
      </div>
      <div className="rounded-md border bg-muted/30 p-3 text-sm">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value || '--'}</span>
    </div>
  );
}

export default function TestReviewPanel({
  data,
  onSaveDraft,
  onSchedule,
  onGoLive,
  errors,
}) {
  const {
    title,
    mode,
    sections,
    scheduling,
    options,
    assignment,
    paperId,
  } = data || {};

  const questionCount = useMemo(() => {
    return (sections || []).reduce(
      (sum, s) => sum + (s.questions?.length || 0),
      0
    );
  }, [sections]);

  const totalMarks = useMemo(() => {
    return (sections || []).reduce(
      (sum, s) =>
        sum +
        (s.questions || []).reduce(
          (qSum, q) => qSum + (Number(q.marks) || 0),
          0
        ),
      0
    );
  }, [sections]);

  const enabledOptions = useMemo(() => {
    if (!options) return [];
    return Object.entries(options)
      .filter(([k, v]) => v === true)
      .map(([k]) =>
        k
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (s) => s.toUpperCase())
          .trim()
      );
  }, [options]);

  const validationErrors = errors || [];

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold">Review Test Configuration</h3>

      {/* Validation warnings */}
      {validationErrors.length > 0 && (
        <div className="space-y-2">
          {validationErrors.map((err, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
            >
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">{err}</p>
            </div>
          ))}
        </div>
      )}

      {/* Overview */}
      <ReviewSection icon={FileText} title="Overview">
        <ReviewRow label="Title" value={title} />
        <ReviewRow label="Mode" value={MODE_LABELS[mode] || mode} />
        <ReviewRow
          label="Source"
          value={paperId ? `Paper: ${paperId}` : 'Manual sections'}
        />
      </ReviewSection>

      {/* Sections & Questions */}
      <ReviewSection icon={FileText} title="Sections & Questions">
        <ReviewRow
          label="Sections"
          value={`${(sections || []).length} section(s)`}
        />
        <ReviewRow label="Total Questions" value={questionCount} />
        <ReviewRow label="Total Marks" value={totalMarks || '--'} />
        {(sections || []).length > 0 && (
          <div className="mt-2 pt-2 border-t space-y-1">
            {sections.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <span>{s.name || `Section ${i + 1}`}</span>
                <span className="text-muted-foreground">
                  {s.questions?.length || 0} questions
                  {s.timeLimit ? ` / ${s.timeLimit} min` : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </ReviewSection>

      {/* Timing */}
      <ReviewSection icon={Clock} title="Timing">
        {mode === 'live_mock' && (
          <>
            <ReviewRow label="Start Time" value={scheduling?.startTime} />
            <ReviewRow
              label="Duration"
              value={scheduling?.duration ? `${scheduling.duration} min` : '--'}
            />
          </>
        )}
        {mode === 'anytime_mock' && (
          <>
            <ReviewRow label="Available From" value={scheduling?.availableFrom} />
            <ReviewRow label="End Time" value={scheduling?.endTime} />
            <ReviewRow
              label="Duration"
              value={scheduling?.duration ? `${scheduling.duration} min` : '--'}
            />
          </>
        )}
        {mode === 'practice' && (
          <ReviewRow label="Time Limit" value="None (unlimited)" />
        )}
        {mode === 'classroom' && (
          <ReviewRow
            label="Duration"
            value={scheduling?.duration ? `${scheduling.duration} min` : '--'}
          />
        )}
        {mode === 'section_timed' && (
          <ReviewRow label="Timing" value="Per-section (see above)" />
        )}
        {!mode && <ReviewRow label="Timing" value="Not configured" />}
      </ReviewSection>

      {/* Options */}
      <ReviewSection icon={Settings} title="Options">
        {enabledOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {enabledOptions.map((opt) => (
              <Badge key={opt} variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                {opt}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">No options enabled</p>
        )}
        {options?.maxAttempts !== undefined && (
          <ReviewRow
            label="Max Attempts"
            value={
              options.maxAttempts === 0
                ? 'Unlimited'
                : options.maxAttempts
            }
          />
        )}
        {options?.passingScore !== undefined && options?.passingScore !== '' && (
          <ReviewRow label="Passing Score" value={`${options.passingScore}%`} />
        )}
      </ReviewSection>

      {/* Assignment */}
      <ReviewSection icon={Users} title="Assignment">
        {assignment?.isPublic ? (
          <ReviewRow label="Visibility" value="Public (all students)" />
        ) : (
          <>
            <ReviewRow
              label="Classes"
              value={
                assignment?.classes?.length
                  ? assignment.classes.map((c) => c.name).join(', ')
                  : 'None'
              }
            />
            <ReviewRow
              label="Individual Students"
              value={
                assignment?.students?.length
                  ? `${assignment.students.length} student(s)`
                  : 'None'
              }
            />
          </>
        )}
      </ReviewSection>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onSaveDraft}
        >
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onSchedule}
          disabled={validationErrors.length > 0}
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          Schedule Test
        </Button>
        <Button
          className="flex-1"
          onClick={onGoLive}
          disabled={validationErrors.length > 0}
        >
          <Zap className="mr-2 h-4 w-4" />
          Go Live Now
        </Button>
      </div>
    </div>
  );
}
