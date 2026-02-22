'use client';

// ─────────────────────────────────────────────────────────────────

function formatAmount(amount, currency) {
  const symbol = currency === 'inr' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount / 100).toFixed(2)}`;
}

export default function StripeBalanceCard({ balance }) {
  if (!balance) return null;

  const available = balance.available || [];
  const pending = balance.pending || [];

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Balance</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Available</span>
          {available.length > 0 ? (
            available.map((b) => (
              <span key={b.currency} className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatAmount(b.amount, b.currency)}
              </span>
            ))
          ) : (
            <span className="text-2xl font-bold text-muted-foreground">{'\u00A3'}0.00</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Pending</span>
          {pending.length > 0 ? (
            pending.map((b) => (
              <span key={b.currency} className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatAmount(b.amount, b.currency)}
              </span>
            ))
          ) : (
            <span className="text-2xl font-bold text-muted-foreground">{'\u00A3'}0.00</span>
          )}
        </div>
      </div>
    </div>
  );
}
