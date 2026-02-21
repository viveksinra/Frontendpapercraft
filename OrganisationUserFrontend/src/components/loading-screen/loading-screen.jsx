'use client';

export function LoadingScreen() {
  return (
    <div className="flex min-h-full w-full flex-1 items-center justify-center px-5">
      <div className="h-1 w-full max-w-[360px] overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  );
}
