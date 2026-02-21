// ----------------------------------------------------------------------

export function FormResendCode({ value, disabled, onResendCode }) {
  return (
    <p className="mt-4 self-center text-sm">
      {`Don't have a code? `}
      <button
        type="button"
        onClick={onResendCode}
        disabled={disabled}
        className="font-semibold hover:underline disabled:pointer-events-none disabled:text-muted-foreground"
      >
        Resend {disabled && value > 0 && `(${value}s)`}
      </button>
    </p>
  );
}
