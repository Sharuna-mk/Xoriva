import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Category {
  id: number;
  label: string;
  sub: string;
  icon: React.ReactNode;
  featured?: boolean;
}

// ─── SAME ICONS (UNCHANGED) ──────────────────────────────────────────────────
const DressIcon = () => ( <svg width="48" height="48" viewBox="0 0 48 48" fill="none"> <path d="M24 6C21 6 18 8.5 17 12L8 18v4h5v20h22V22h5v-4L31 12C30 8.5 27 6 24 6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/> <path d="M17 12c0 3.5 3.1 7 7 7s7-3.5 7-7" stroke="currentColor" strokeWidth="1.3"/> </svg> ); const TopIcon = () => ( <svg width="48" height="48" viewBox="0 0 48 48" fill="none"> <path d="M16 7L7 14v6h6v21h22V20h6v-6l-9-7c-1 2.5-4.5 5-8 5s-7-2.5-8-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/> </svg> ); const ShirtIcon = () => ( <svg width="48" height="48" viewBox="0 0 48 48" fill="none"> <path d="M16 7L7 14v6h7v21h20V20h7v-6L32 7c-1 3.5-4.5 6-8 6s-7-2.5-8-6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/> <path d="M16 7v11M32 7v11" stroke="currentColor" strokeWidth="1.3"/> <path d="M20 13h8" stroke="currentColor" strokeWidth="1.3"/> </svg> ); const PantsIcon = () => ( <svg width="48" height="48" viewBox="0 0 48 48" fill="none"> <path d="M12 7h24l4 12-4 1v22H26V28h-4v14H14V20l-4-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/> <path d="M20 7v21M28 7v21" stroke="currentColor" strokeWidth="1.3"/> </svg> ); const TeeIcon = () => ( <svg width="48" height="48" viewBox="0 0 48 48" fill="none"> <rect x="16" y="6" width="16" height="6" rx="3" stroke="currentColor" strokeWidth="1.3"/> <path d="M16 12L10 18v4h7v20h14V22h7v-4l-6-6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/> </svg> ); const JacketIcon = () => ( <svg width="48" height="48" viewBox="0 0 48 48" fill="none"> <path d="M17 7L6 16v5h7v21h28V21h-7v-5L17 7zM17 7v11M31 7v11M17 18h14" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/> <path d="M31 7l11 9v5h-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/> <path d="M24 18v16" stroke="currentColor" strokeWidth="1.3"/> </svg> ); const BagIcon = () => ( <svg width="48" height="48" viewBox="0 0 48 48" fill="none"> <path d="M12 18h24v4c0 9-4 16-12 18C16 38 12 31 12 22v-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/> <path d="M12 18C12 14 14.5 10 18 9l6 6 6-6c3.5 1 6 5 6 9" stroke="currentColor" strokeWidth="1.3"/> </svg> ); const StarIcon = () => ( <svg width="48" height="48" viewBox="0 0 48 48" fill="none"> <polygon points="24,5 28,18 42,18 31,27 35,40 24,31 13,40 17,27 6,18 20,18" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/> </svg> );

// ─── DATA ────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: 1, label: "Dresses", sub: "38 pieces", icon: <DressIcon /> },
  { id: 2, label: "Tops", sub: "64 pieces", icon: <TopIcon /> },
  { id: 3, label: "Shirts", sub: "51 pieces", icon: <ShirtIcon /> },
  { id: 4, label: "Pants & Jeans", sub: "47 pieces", icon: <PantsIcon /> },
  { id: 5, label: "Tees", sub: "72 pieces", icon: <TeeIcon /> },
  { id: 6, label: "Jackets", sub: "29 pieces", icon: <JacketIcon /> },
  { id: 7, label: "Accessories", sub: "83 pieces", icon: <BagIcon /> },
  { id: 8, label: "Vintage Picks", sub: "Limited", icon: <StarIcon />, featured: true },
];

// ─── CARD ────────────────────────────────────────────────────────────────────
function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative aspect-[3/4] cursor-pointer overflow-hidden
        border transition-all duration-500
        ${cat.featured ? "bg-zinc-950 border-red-500/30" : "bg-zinc-900 border-white/10"}
        hover:scale-[1.02] hover:border-red-500/40
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
      `}
    >
      {/* 🔥 background glow */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-red-600/10 blur-2xl" />

      {/* grain */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* featured badge */}
      {cat.featured && (
        <div className="absolute top-3 left-3 z-10 text-[8px] tracking-[0.3em] uppercase bg-red-600 text-black px-2 py-1">
          Editor Pick
        </div>
      )}

      {/* ICON */}
      <div
        className={`
          relative z-10 flex justify-center mt-14
          transition-transform duration-500
          ${hovered ? "scale-90 -translate-y-2 text-red-500" : "text-white"}
        `}
      >
        {cat.icon}
      </div>

      {/* TEXT */}
      <div className="relative z-10 text-center mt-6">
        <div className="font-bebas text-xl tracking-[0.25em] text-white">
          {cat.label}
        </div>
        <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1">
          {cat.sub}
        </div>
      </div>

      {/* CTA */}
      <div
        className={`
          absolute bottom-4 left-1/2 -translate-x-1/2
          text-[9px] tracking-[0.3em] uppercase border-b
          transition-all duration-300
          ${hovered ? "opacity-100 text-red-400" : "opacity-0 text-white"}
        `}
      >
        Shop now
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function LastDrop() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden ">

      {/* 🌫 background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
      <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* HEADER */}
      <div className="text-center pt-24 pb-16 relative z-10">
        <div className="text-[10px] tracking-[0.4em] text-gray-500 uppercase">
          Quick Shop
        </div>

        <h1 className="font-bebas text-[clamp(3rem,10vw,8rem)] tracking-[0.2em] text-white leading-none">
          LAST DROP
        </h1>

        <p className="text-gray-400 italic max-w-md mx-auto mt-4">
          Curated thrift essentials made for your next fit
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>

      {/* FLOATING GLOW */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[150px] -translate-x-1/2 -translate-y-1/2" />

      {/* FOOTER */}
      <div className="border-t border-white/10 py-6 text-center text-xs tracking-[0.3em] text-gray-500 uppercase relative z-10">
        New curated drops every week
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .font-bebas {
          font-family: 'Bebas Neue', sans-serif;
        }
      `}</style>
    </div>
  );
}