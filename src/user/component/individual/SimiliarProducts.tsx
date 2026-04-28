import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface SimilarProductsProps {
  products: Product[];
}

export function SimilarProducts({ products }: SimilarProductsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="py-12">
      <h2 className="text-2xl mb-6 uppercase tracking-wider">You May Also Like</h2>
      <div className="relative">
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 shadow-lg transition-all"
        >
          <ChevronLeft className="size-5" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 shadow-lg transition-all"
        >
          <ChevronRight className="size-5" />
        </button>

        <div className="overflow-hidden px-8" ref={emblaRef}>
          <div className="flex gap-4">
            {products.map((product) => (
              <div key={product.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0">
                <div className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-neutral-50 overflow-hidden mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 uppercase tracking-wider">
                      {product.brand}
                    </p>
                    <h3 className="text-sm line-clamp-1">{product.name}</h3>
                    <p className="text-sm">₹{product.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
