import React, { useState } from "react";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BrandedProduct {
  id: number;
  title: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage?: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSustainable?: boolean;
  colors?: string[];
  sizes?: string[];
}

const hmProducts: BrandedProduct[] = [
  {
    id: 1,
    title: "Oversized Fit Hoodie",
    brand: "H&M",
    price: 1299,
    oldPrice: 2499,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    hoverImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80",
    rating: 4.7,
    reviewCount: 2341,
    isNew: true,
    colors: ["#1a1a1a", "#4a4a4a", "#8b4513"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    title: "Linen Blend Blazer",
    brand: "H&M",
    price: 2999,
    oldPrice: 4999,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4b09?w=500&q=80",
    hoverImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    rating: 4.9,
    reviewCount: 892,
    isSustainable: true,
    colors: ["#f5f5dc", "#2c2c2c"],
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 3,
    title: "Cropped Cardigan",
    brand: "H&M",
    price: 899,
    oldPrice: 1599,
    image: "https://images.unsplash.com/photo-1434389670765-91dd6d1d7eb3?w=500&q=80",
    hoverImage: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500&q=80",
    rating: 4.6,
    reviewCount: 1567,
    colors: ["#f4a460", "#8b4513", "#2f4f4f"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 4,
    title: "Relaxed Straight Jeans",
    brand: "H&M",
    price: 1599,
    oldPrice: 2799,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
    hoverImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
    rating: 4.8,
    reviewCount: 3421,
    isNew: true,
    colors: ["#4169e1", "#2c2c2c", "#696969"],
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 5,
    title: "Silk Midi Dress",
    brand: "H&M",
    price: 2499,
    oldPrice: 3999,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&q=80",
    hoverImage: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&q=80",
    rating: 4.9,
    reviewCount: 978,
    isSustainable: true,
    colors: ["#ffb6c1", "#ff69b4", "#2f4f4f"],
    sizes: ["XS", "S", "M", "L"]
  }
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3 h-3"
          fill={i <= Math.round(rating) ? "#f59e0b" : "transparent"}
          stroke={i <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

const BrandedProductCard: React.FC<{ 
  product: BrandedProduct; 
  onBrandClick: (brand: string) => void;
}> = ({ product, onBrandClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2]);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-black text-white text-[10px] font-semibold px-2 py-1 rounded-full tracking-wide">
              NEW IN
            </span>
          )}
          {product.isSustainable && (
            <span className="bg-green-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full tracking-wide flex items-center gap-1">
              🌱 SUSTAINABLE
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all hover:scale-110"
          >
            <Heart
              className="w-4 h-4"
              fill={isWishlisted ? "#e11d48" : "none"}
              stroke={isWishlisted ? "#e11d48" : "#1a1a1a"}
              strokeWidth={1.5}
            />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all hover:scale-110">
            <Eye className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button className="w-full bg-white text-gray-900 font-semibold py-2.5 rounded-full text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Quick Add
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p
            onClick={() => onBrandClick(product.brand)}
            className="text-xs font-semibold text-gray-500 tracking-wide uppercase cursor-pointer hover:text-black transition"
          >
            {product.brand}
          </p>
          <h3 className="text-sm font-medium text-gray-900 mt-0.5 line-clamp-1">
            {product.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-[11px] text-gray-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.oldPrice.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-red-600">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {product.colors && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-gray-900 scale-110"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color ${idx + 1}`}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-gray-500">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {product.sizes && isHovered && (
          <div className="pt-2 border-t border-gray-100 animate-slideDown">
            <p className="text-[10px] font-medium text-gray-500 mb-1.5">SELECT SIZE</p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    selectedSize === size
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 text-gray-600 hover:border-gray-900"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BrandedProductGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brand: string) => {
    navigate("/search", { state: { brand } });
  };

  return (
    <div className="px-4 md:px-10 py-10 bg-gray-50/30">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">H&M</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Editor's Pick</h2>
              <p className="text-sm text-gray-500">Sustainable fashion for everyone</p>
            </div>
          </div>
        </div>
        <button className="text-sm font-semibold text-gray-900 border-b-2 border-gray-900 hover:border-gray-400 transition-colors pb-0.5">
          Shop All →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {hmProducts.map((product) => (
          <BrandedProductCard
            key={product.id}
            product={product}
            onBrandClick={handleBrandClick}
          />
        ))}
      </div>

      <div className="mt-10 bg-black text-white rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-lg">🌱</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Conscious Choice</p>
            <p className="text-xs text-gray-300">Made with sustainable materials</p>
          </div>
        </div>
        <button className="text-sm border border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default BrandedProductGrid;