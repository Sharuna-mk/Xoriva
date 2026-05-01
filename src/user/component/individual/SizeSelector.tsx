import { motion } from "motion/react";

interface Size {
  label: string;
  available: boolean;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
}: SizeSelectorProps) {

  const handleSizeClick = (size: Size) => {
    if (!size.available) return;
    onSizeSelect(size.label);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-wider">Select Size</h3>
        <button className="text-sm text-neutral-600 hover:text-black underline">
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {sizes.map((size) => (
          <motion.button
            key={size.label}
            onClick={() => handleSizeClick(size)}
            disabled={!size.available}
            whileTap={size.available ? { scale: 0.95 } : undefined}
            className={`
              relative aspect-square flex items-center justify-center border transition-all
              ${selectedSize === size.label
                ? "border-black bg-black text-white border-2"
                : size.available
                  ? "border-neutral-300 hover:border-black bg-white"
                  : "border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed"
              }
            `}
          >
            <span className="text-sm">{size.label}</span>

          </motion.button>
        ))}
      </div>

      {selectedSize && sizes.find(s => s.label === selectedSize)?.available === false && (
        <p className="text-sm text-red-500">This size is out of stock</p>
      )}

      {!selectedSize && (
        <p className="text-sm text-red-500">Please select a size</p>
      )}
    </div>
  );
}