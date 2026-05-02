import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
type Brand = {
  name: string;
  tagline: string;
  logo: string;
  color: string;
};

const brands: Brand[] = [
  {
    name: "Zara",
    tagline: "Timeless fashion essentials",
    logo: "https://1000logos.net/wp-content/uploads/2022/08/Zara-log%D0%BE.png",
    color: "from-black/5 to-black/0",
  },
  {
    name: "H&M",
    tagline: "Modern everyday style",
    logo: "https://tse4.mm.bing.net/th/id/OIP.FPqaiQ5CFCAcFMvmnlxcDwHaE4?rs=1&pid=ImgDetMain&o=7&rm=3",
    color: "from-blue-50 to-transparent",
  },
  {
    name: "Levi’s",
    tagline: "Iconic denim wear",
    logo: "https://tse1.mm.bing.net/th/id/OIP.kv-ORAQLlYeyPbTjFyWTjAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    color: "from-indigo-50 to-transparent",
  },
  {
    name: "Uniqlo",
    tagline: "LifeWear essentials",
    logo: "https://toppng.com/uploads/preview/uniqlo-logo-vector-11573942521rp32cmu2vg.png",
    color: "from-gray-50 to-transparent",
  },
  {
    name: "Nike",
    tagline: "Sport meets lifestyle",
    logo: "https://tse1.mm.bing.net/th/id/OIP.OFAJjiEH5qsHo77r9dY64gHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    color: "from-neutral-50 to-transparent",
  },
  {
    name: "Adidas",
    tagline: "Impossible is nothing",
    logo: "https://tse3.mm.bing.net/th/id/OIP.aw4ynosen6elgMpjUjaUBwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    color: "from-slate-50 to-transparent",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ExploreByCategory: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="px-4 md:px-10 py-14 md:py-20 bg-white">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs md:text-sm font-semibold tracking-[4px] text-gray-500 uppercase">
          Curated Selection
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3">
          Shop by <span className="text-black">Brand</span>
        </h2>
        <p className="text-sm text-gray-500 mt-3">
          Explore premium fashion brands curated for you
        </p>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto"
      >
        {brands.map((brand, i) => (
          <motion.button
            key={brand.name}
            variants={cardVariants}
            onClick={() => navigate("/products", { state: { brand: brand.name } })}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-70`}
            />

            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="absolute -left-1/2 top-0 w-1/2 h-full bg-white/30 rotate-12 group-hover:translate-x-[250%] transition-transform duration-700" />
            </div>

            {/* Content */}
            <div className="relative p-5 flex flex-col items-center text-center gap-3">
              {/* Logo */}
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-20 h-10 object-contain"
                  loading="lazy"
                />
              </div>

              {/* Brand Name */}
              <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-black transition-colors">
                {brand.name}
              </h3>

              {/* Tagline */}
              <p className="text-[10px] md:text-xs text-gray-500 leading-tight">
                {brand.tagline}
              </p>

              {/* CTA (hover only) */}
              <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-black transition-all duration-300">
                Explore →
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
};
export default ExploreByCategory;