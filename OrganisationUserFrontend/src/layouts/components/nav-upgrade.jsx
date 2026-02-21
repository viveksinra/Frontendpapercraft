import { useAuthContext } from 'src/auth/hooks';

export function NavUpgrade({ className, ...other }) {
  const { user } = useAuthContext();

  return (
    <div className={`px-4 py-6 text-center ${className || ''}`} {...other}>
      <div className="flex flex-col items-center">
        <div className="relative">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground">
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <div className="mt-3 w-full">
          <p className="truncate text-sm font-medium">{user?.displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export function UpgradeBlock() {
  return null;
}
