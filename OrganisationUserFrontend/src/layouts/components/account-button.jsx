export function AccountButton({ photoURL, displayName, className, ...other }) {
  return (
    <button
      className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-primary/20 transition-all hover:ring-primary/40 focus:outline-none ${className || ''}`}
      aria-label="Account button"
      {...other}
    >
      {photoURL ? (
        <img src={photoURL} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          {displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
    </button>
  );
}
