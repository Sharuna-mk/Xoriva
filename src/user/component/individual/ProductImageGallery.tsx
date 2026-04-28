import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div
        className="relative bg-neutral-50 aspect-[3/4] mb-4 overflow-hidden group cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="size-full"
          >
            <img
              src={images[selectedIndex]}
              alt={`Product view ${selectedIndex + 1}`}
              className="size-full object-cover"
              style={
                isZoomed
                  ? {
                      transform: 'scale(2)',
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      transition: 'transform 0.1s ease-out',
                    }
                  : undefined
              }
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 p-2 rounded-full">
            <ZoomIn className="size-4" />
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`aspect-[3/4] bg-neutral-50 overflow-hidden transition-all ${
              selectedIndex === index
                ? 'ring-2 ring-black'
                : 'ring-1 ring-neutral-200 hover:ring-neutral-400'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
