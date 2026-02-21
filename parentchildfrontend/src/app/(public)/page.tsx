import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Welcome to PaperCraft
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted-foreground">
        The smarter way to prepare for exams
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild size="lg">
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
