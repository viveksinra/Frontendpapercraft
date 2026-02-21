// ----------------------------------------------------------------------

export function FormHead({ icon, title, description, className }) {
  return (
    <>
      {icon && (
        <span className="mb-3 mx-auto inline-flex">
          {icon}
        </span>
      )}

      <div className={`mb-8 flex flex-col gap-1.5 whitespace-pre-line text-center md:text-left ${className || ''}`}>
        <h1 className="text-xl font-semibold">{title}</h1>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </>
  );
}
