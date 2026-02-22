'use client';

import { useRef, useState } from 'react';

interface VideoLessonProps {
  videoUrl: string;
  thumbnailUrl?: string;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function VideoLesson({ videoUrl, thumbnailUrl }: VideoLessonProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState(1);

  function handleSpeedChange() {
    const idx = PLAYBACK_SPEEDS.indexOf(speed);
    const next = PLAYBACK_SPEEDS[(idx + 1) % PLAYBACK_SPEEDS.length];
    setSpeed(next);
    if (videoRef.current) {
      videoRef.current.playbackRate = next;
    }
  }

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">Video not available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        controls
        className="w-full rounded-lg aspect-video bg-black"
        controlsList="nodownload"
      />
      <div className="flex justify-end">
        <button
          onClick={handleSpeedChange}
          className="text-xs px-2 py-1 rounded border hover:bg-accent"
        >
          {speed}x
        </button>
      </div>
    </div>
  );
}
