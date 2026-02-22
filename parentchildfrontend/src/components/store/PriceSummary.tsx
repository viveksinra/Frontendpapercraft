'use client';

interface PriceSummaryProps {
  basePrice: number;
  discountPrice?: number | null;
  isFree?: boolean;
  selectedAddOns: { title: string; price: number }[];
  currency?: string;
}

function formatPrice(amount: number, currency: string = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export function PriceSummary({
  basePrice,
  discountPrice,
  isFree,
  selectedAddOns,
  currency = 'GBP',
}: PriceSummaryProps) {
  if (isFree) {
    return (
      <div className="rounded-md border bg-green-50 dark:bg-green-950 p-4">
        <span className="text-lg font-bold text-green-600 dark:text-green-400">FREE</span>
      </div>
    );
  }

  const effectiveBase = discountPrice != null ? discountPrice : basePrice;
  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const total = effectiveBase + addOnTotal;

  return (
    <div className="rounded-md border p-4 space-y-2">
      <h3 className="text-sm font-medium">Price Summary</h3>

      <div className="flex justify-between text-sm">
        <span>
          Base price
          {discountPrice != null && (
            <span className="ml-2 line-through text-muted-foreground">
              {formatPrice(basePrice, currency)}
            </span>
          )}
        </span>
        <span>{formatPrice(effectiveBase, currency)}</span>
      </div>

      {selectedAddOns.map((addOn, i) => (
        <div key={i} className="flex justify-between text-sm text-muted-foreground">
          <span>{addOn.title}</span>
          <span>{formatPrice(addOn.price, currency)}</span>
        </div>
      ))}

      <div className="border-t pt-2 flex justify-between text-sm font-bold">
        <span>Total</span>
        <span>{formatPrice(total, currency)}</span>
      </div>
    </div>
  );
}
