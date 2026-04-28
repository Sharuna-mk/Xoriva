import { useState, useRef, useEffect } from "react";

function useInView(ref: React.RefObject<Element>, threshold = 0.1) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return visible;
}

interface Style {
  id: number;
  name: string;
  tag: string;
  tagline: string;
  featured?: boolean;
  accentColor: string;
  patternType: string;
  items: number;
}

const STYLES: Style[] = [
  { id: 1, name: "Streetwear", tag: "BOLD DROP", tagline: "Urban edge, oversized fits", accentColor: "#ff4d4d", patternType: "cross", 
    image:'https://i.pinimg.com/736x/38/f7/16/38f716e1b11848d7db666d63ea29859b.jpg' ,
    items: 128 },
  { id: 2, name: "Y2K", tag: "EDITOR'S PICK", tagline: "Retro futurism, bold energy", accentColor: "#fff", patternType: "diagonal",
    image:'https://i.pinimg.com/736x/34/19/9c/34199c864caa8f0640b9c1574fc47f60.jpg',
    items: 94, featured: true },
  { id: 3, name: "Minimalist", tag: "CURATED", tagline: "Clean lines, neutral tones", accentColor: "#999", patternType: "dots", 
    image:'https://sfconservatoryofdance.org/wp-content/uploads/2024/12/Minimalist-Dress-to-Impress-Outfit-Idea-for-a-Clean-Aesthetic_33.jpeg',
    items: 76 },
  { id: 4, name: "Vintage 90s", tag: "TIMELESS", tagline: "Thrift classics reimagined", accentColor: "#c8a24a", 
    image:'https://www.fashionacy.com/wp-content/uploads/2025/01/Casual-Gen-Z-Outfits.webp',
    patternType: "grid", items: 112 },
  { id: 5, name: "Office Wear", tag: "REFINED", tagline: "Sharp structured elegance", accentColor: "#4da3ff", 
    image:'https://th.bing.com/th/id/OIP.G4vhrWY190vPGQ9fU0ooCwHaLH?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'
    ,patternType: "wave", items: 63 },
  { id: 6, name: "Korean Style", tag: "TRENDING", tagline: "Soft layering aesthetics", accentColor: "#c77dff", 
    image:'https://i.pinimg.com/736x/9c/3a/b8/9c3ab85a0a2c2c001767772e1bd82a80.jpg',
    patternType: "chevron", items: 89 },
];

function StyleCard({ s, inView }: any) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border border-white/10
        bg-white/5 backdrop-blur-md
        p-4 sm:p-6
        transition-all duration-500
        hover:-translate-y-2 hover:scale-[1.02]
        hover:shadow-2xl
        aspect-[3/4]
        group
      `}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/* IMAGE BACKGROUND */}
      <img
        src={s.image}
        alt={s.name}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition duration-500"
      />

      {/* DARK OVERLAY FOR TEXT READABILITY */}
      <div className="absolute inset-0 bg-black/50" />



      {/* accent glow */}
      <div
        className="absolute inset-0 opacity-20 blur-2xl"
        
      />

      {/* CONTENT */}
      <div className="relative z-10">
        {/* tag */}
        <div className="text-[10px] tracking-[0.2em] text-white/60">
          {s.tag}
        </div>

        {/* title */}
        <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-widest text-white">
          {s.name}
        </h2>

        {/* tagline */}
        <p className="mt-2 text-xs sm:text-sm text-white/50">
          {s.tagline}
        </p>
      </div>

      {/* items */}
      <div className="absolute bottom-3 right-3 text-xs text-white/40 z-10">
        {s.items} items
      </div>

      {/* bottom bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300"
        style={{ background: s.accentColor }}
      />
    </div>
  );
}

export default function ShopByStyle() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-10 py-12">
      
      {/* HEADER */}
      <div ref={ref} className="text-center mb-10">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-[0.2em]">
          SHOP BY STYLE
        </h1>
        <p className="text-white/50 mt-2 text-sm sm:text-base">
          Find your aesthetic. Build your identity.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {STYLES.map((s) => (
          <StyleCard key={s.id} s={s} inView={inView} />
        ))}
      </div>
    </div>
  );
}