'use client';

export function SplashScreen() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    </div>
  );
}
