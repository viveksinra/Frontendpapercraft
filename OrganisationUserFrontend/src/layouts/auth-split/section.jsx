import { CONFIG } from 'src/global-config';

export function AuthSplitSection({
  title = 'Welcome to PaperCraft',
  subtitle = 'Assessment platform for 11+ exam preparation.',
  imgUrl = `${CONFIG.assetsDir}/assets/illustrations/illustration-dashboard.webp`,
}) {
  return (
    <div className="relative hidden w-full max-w-[480px] flex-col items-center justify-center gap-8 bg-muted/50 px-6 py-12 md:flex">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <img
        alt="Dashboard illustration"
        src={imgUrl}
        className="aspect-[4/3] w-full object-cover"
      />
    </div>
  );
}
