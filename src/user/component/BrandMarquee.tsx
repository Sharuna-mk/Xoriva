import React from "react";

const brands = [
  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nike.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/adidas.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/puma.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/zara.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/reebok.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/samsung.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/newbalance.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/thenorthface.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/underarmour.svg",
   "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/fila.svg",
 

];

function BrandMarquee() {
  return (
    <div className="bg-blue-50 py-12 overflow-hidden">


      <h2 className="text-center text-lg md:text-2xl font-bold text-gray-800 mb-8 tracking-wide">
        Trusted by top brands
      </h2>


      <div className="relative">


        <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-blue-50 to-transparent z-10 pointer-events-none" />


        <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-blue-50 to-transparent z-10 pointer-events-none" />

      
        <div className="flex w-max animate-marquee gap-16 items-center hover:[animation-play-state:paused]">

          {[...brands, ...brands].map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center"
            >
              <img
                src={logo}
                alt="brand"
                className="h-10 md:h-12 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-10/5 ease-out"
              />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default BrandMarquee;