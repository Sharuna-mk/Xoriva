import { Star, StarHalf } from 'lucide-react';

interface ProductDetailsProps {
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
}

export function ProductDetails({
  name,
  brand,
  price,
  originalPrice,
  rating,
  reviewCount,
}: ProductDetailsProps) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="size-4 fill-black" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="size-4 fill-black" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="size-4" />);
    }
    return stars;
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm text-neutral-600 uppercase tracking-wider mb-1">
          {brand}
        </h2>
        <h1 className="text-3xl tracking-tight">{name}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">{renderStars()}</div>
        <span className="text-sm text-neutral-600">
          ({reviewCount.toLocaleString()} reviews)
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl">₹{price.toLocaleString()}</span>
        {originalPrice && (
          <>
            <span className="text-xl text-neutral-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
            <span className="text-sm px-2 py-1 bg-black text-white">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      <div className="text-sm text-neutral-600">inclusive of all taxes</div>
    </div>
  );
}
