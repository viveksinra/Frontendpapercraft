'use client';

interface AddOn {
  _id?: string;
  type: string;
  title: string;
  description?: string;
  price: number;
}

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  currency?: string;
}

function formatPrice(amount: number, currency: string = 'GBP') {
  const symbol = currency === 'INR' ? '\u20B9' : '\u00A3';
  return `${symbol}${(amount || 0).toFixed(2)}`;
}

export function AddOnSelector({ addOns, selectedIds, onToggle, currency = 'GBP' }: AddOnSelectorProps) {
  if (!addOns || addOns.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Add-on Services</h3>
      {addOns.map((addOn, i) => {
        const id = addOn._id || String(i);
        const isSelected = selectedIds.includes(id);
        return (
          <label
            key={id}
            className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
              isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(id)}
              className="h-4 w-4 rounded border-input"
            />
            <div className="flex-1">
              <span className="text-sm font-medium">{addOn.title}</span>
              {addOn.description && (
                <p className="text-xs text-muted-foreground">{addOn.description}</p>
              )}
            </div>
            <span className="text-sm font-medium">{formatPrice(addOn.price, currency)}</span>
          </label>
        );
      })}
    </div>
  );
}
