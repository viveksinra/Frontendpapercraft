'use client';

import { Clock, Info } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import SectionTimedConfigurator from './SectionTimedConfigurator';

export default function TimingConfigurator({ mode, scheduling, sections, onChange }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...scheduling, [field]: value });
  };

  if (mode === 'practice') {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Timing</h3>
        <div className="flex items-center gap-3 rounded-lg border border-dashed p-6">
          <Info className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium">No time limit</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Practice mode allows students to take as long as they need. They can
              attempt the test multiple times.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'section_timed') {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Per-Section Timing</h3>
        <SectionTimedConfigurator
          sections={sections}
          onChange={(updatedSections) =>
            onChange({ ...scheduling, sectionTimers: updatedSections })
          }
        />
      </div>
    );
  }

  if (mode === 'live_mock') {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Live Mock Timing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input
              type="datetime-local"
              value={scheduling?.startTime || ''}
              onChange={(e) => handleFieldChange('startTime', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              All students start at this exact time
            </p>
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                className="pl-9"
                value={scheduling?.duration || ''}
                onChange={(e) => handleFieldChange('duration', e.target.value)}
                placeholder="e.g. 60"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'anytime_mock') {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Availability Window</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Available From</Label>
            <Input
              type="datetime-local"
              value={scheduling?.availableFrom || ''}
              onChange={(e) => handleFieldChange('availableFrom', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Students can start the test from this time
            </p>
          </div>
          <div className="space-y-2">
            <Label>End Time</Label>
            <Input
              type="datetime-local"
              value={scheduling?.endTime || ''}
              onChange={(e) => handleFieldChange('endTime', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Test must be completed before this time
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <div className="relative w-48">
            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              className="pl-9"
              value={scheduling?.duration || ''}
              onChange={(e) => handleFieldChange('duration', e.target.value)}
              placeholder="e.g. 45"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Time allowed once a student starts the test
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'classroom') {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Classroom Timing</h3>
        <div className="space-y-2">
          <Label>Total Duration (minutes)</Label>
          <div className="relative w-48">
            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              className="pl-9"
              value={scheduling?.duration || ''}
              onChange={(e) => handleFieldChange('duration', e.target.value)}
              placeholder="e.g. 90"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            You can pause and resume the test during this period
          </p>
        </div>
      </div>
    );
  }

  // Fallback: no mode selected yet
  return (
    <div className="rounded-lg border border-dashed p-6 text-center">
      <p className="text-sm text-muted-foreground">
        Select a test mode first to configure timing.
      </p>
    </div>
  );
}
