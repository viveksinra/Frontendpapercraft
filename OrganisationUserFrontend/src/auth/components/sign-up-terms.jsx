// ----------------------------------------------------------------------

export function SignUpTerms() {
  return (
    <span className="mt-4 block text-center text-xs text-muted-foreground">
      {'By signing up, I agree to '}
      <a href="#" className="underline text-foreground hover:text-foreground/80">
        Terms of service
      </a>
      {' and '}
      <a href="#" className="underline text-foreground hover:text-foreground/80">
        Privacy policy
      </a>
      .
    </span>
  );
}
