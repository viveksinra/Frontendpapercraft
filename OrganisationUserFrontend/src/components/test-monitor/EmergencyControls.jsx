'use client';

import { useState } from 'react';
import { Play, Clock, Pause, StopCircle, AlertTriangle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

export default function EmergencyControls({
  test,
  onExtendTime,
  onEndTest,
  onPause,
  onResume,
}) {
  const [extendMinutes, setExtendMinutes] = useState(10);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [extending, setExtending] = useState(false);
  const [ending, setEnding] = useState(false);

  const isClassroom = test?.mode === 'classroom';
  const isPaused = test?.isPaused ?? false;

  const handleExtendTime = async () => {
    if (!onExtendTime || extendMinutes <= 0) return;
    setExtending(true);
    try {
      await onExtendTime(extendMinutes);
    } finally {
      setExtending(false);
    }
  };

  const handleEndTest = async () => {
    if (!onEndTest) return;
    setEnding(true);
    try {
      await onEndTest();
    } finally {
      setEnding(false);
      setShowEndConfirm(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Extend Time */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={180}
          value={extendMinutes}
          onChange={(e) => setExtendMinutes(Number(e.target.value))}
          className="w-20"
          placeholder="Min"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleExtendTime}
          disabled={extending || extendMinutes <= 0}
        >
          <Clock className="h-4 w-4" />
          {extending ? 'Extending...' : 'Extend Time'}
        </Button>
      </div>

      {/* Pause / Resume (classroom only) */}
      {isClassroom && (
        isPaused ? (
          <Button variant="outline" size="sm" onClick={onResume}>
            <Play className="h-4 w-4" />
            Resume
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={onPause}>
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        )
      )}

      {/* End Test */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowEndConfirm(true)}
      >
        <StopCircle className="h-4 w-4" />
        End Test
      </Button>

      {/* End Test Confirmation Dialog */}
      <Dialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              End Test Now?
            </DialogTitle>
            <DialogDescription>
              This will immediately end the test for all students. Any unanswered questions
              will be marked as not attempted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEndConfirm(false)}
              disabled={ending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleEndTest}
              disabled={ending}
            >
              {ending ? 'Ending...' : 'Yes, End Test'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
