import { useState } from 'react';
import { MapPin, Truck } from 'lucide-react';

export function DeliveryCheck() {
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<{
    available: boolean;
    days?: number;
  } | null>(null);

  const handleCheck = () => {
    if (pincode.length === 6) {
      setDeliveryInfo({
        available: true,
        days: Math.floor(Math.random() * 3) + 2,
      });
    }
  };

  return (
    <div className="border border-neutral-200 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Truck className="size-5" />
        <h3 className="text-sm uppercase tracking-wider">Delivery Options</h3>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setPincode(value);
              if (value.length !== 6) setDeliveryInfo(null);
            }}
            className="w-full pl-10 pr-3 py-2 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={pincode.length !== 6}
          className="px-6 py-2 bg-black text-white disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors text-sm uppercase tracking-wider"
        >
          Check
        </button>
      </div>

      {deliveryInfo?.available && (
        <div className="text-sm space-y-1 text-neutral-700">
          <p className="flex items-center gap-2">
            <span className="size-1.5 bg-green-500 rounded-full" />
            Delivery available in {deliveryInfo.days} days
          </p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 bg-green-500 rounded-full" />
            7 days easy return & exchange available
          </p>
        </div>
      )}
    </div>
  );
}
