import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import carousel1 from "../../assets/carousel1.png";
import carousel2 from "../../assets/carousel2.png";

const autoplayPlugin = Autoplay({ delay: 4500, stopOnInteraction: true });

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplayPlugin,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
  
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">

          {/* Slide 1 */}
          <div className="relative min-w-full">
            <div className="relative h-[320px] sm:h-[420px] md:h-[600px] w-full">
              <img
                src={carousel1}
                alt="Limited Time"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-16">
                <div className="max-w-md">
                  <span className="inline-block text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4 bg-red-600 text-red-50">
                    Limited Time
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3 whitespace-pre-line">
                    Up to 50% off{"\n"}this season
                  </h2>
                  <p className="text-sm sm:text-base text-white/70 mb-6 leading-relaxed">
                    Handpicked styles at prices you'll love. Don't miss out — sale ends Sunday.
                  </p>
                  <button className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-200">
                    Shop the sale
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="absolute top-5 right-5 sm:top-6 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center text-center">
                <span className="text-white text-xs font-bold leading-tight whitespace-pre-line">
                  50%{"\n"}OFF
                </span>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="relative min-w-full">
            <div className="relative h-[320px] sm:h-[420px] md:h-[600px] w-full">
              <img
                src={carousel2}
                alt="Just Dropped"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
            </div>
          </div>

          {/* Slide 3 */}
          <div className="relative min-w-full">
            <div className="relative h-[320px] sm:h-[420px] md:h-[600px] w-full">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80"
                alt="Free Shipping"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-16">
                <div className="max-w-md">
                  <span className="inline-block text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4 bg-blue-700 text-blue-50">
                    Free Shipping
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3 whitespace-pre-line">
                    Free delivery{"\n"}on ₹999+
                  </h2>
                  <p className="text-sm sm:text-base text-white/70 mb-6 leading-relaxed">
                    No code needed. Shop your favourite styles and we'll handle the rest.
                  </p>
                  <button className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-200">
                    Start shopping
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Prev */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/15 border border-white/25 hover:bg-white/28 backdrop-blur-sm"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>

      {/* Next */}
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/15 border border-white/25 hover:bg-white/28 backdrop-blur-sm"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}