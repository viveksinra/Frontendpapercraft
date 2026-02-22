export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/50 px-4">
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}
