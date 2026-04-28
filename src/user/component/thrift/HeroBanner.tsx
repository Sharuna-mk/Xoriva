import { useState, useEffect, useRef } from "react";
import retro from '../../../assets/retro.png'

const WORDS = ["Thrift it.", "Flip it.", "Flex it."];
const TAGS = ["Y2K", "Vintage", "Grunge", "Streetwear", "Cottagecore", "Dark Academia", "Indie", "90s Fits"];

export default function HeroBanner() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeWord, setActiveWord] = useState(0);
  const [tagIndex, setTagIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = setInterval(() => setActiveWord((p) => (p + 1) % WORDS.length), 1800);
    const t = setInterval(() => setTagIndex((p) => (p + 1) % TAGS.length), 1200);
    return () => {
      clearInterval(w);
      clearInterval(t);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = bannerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 12,
    });
  };

  return (
    <div
      ref={bannerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative min-h-screen w-full overflow-hidden bg-black text-white cursor-none"
    >
      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

      {/* vignette */}
      <div className="absolute inset-0 bg-radial-gradient opacity-60" />

      {/* grain */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* CURSOR */}
      <div
        className="fixed top-1/2 left-1/2 pointer-events-none z-[999]"
        style={{
          width: hovering ? 48 : 12,
          height: hovering ? 48 : 12,
          transform: `translate(calc(-50% + ${mousePos.x * 18}px), calc(-50% + ${mousePos.y * 10}px))`,
          border: "1px solid rgba(255,0,0,0.6)",
          borderRadius: "50%",
          transition: "0.2s ease",
        }}
      />

      {/* LAYOUT */}
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 px-6 py-24 items-center">

        {/* LEFT */}
        <div className="space-y-6">
          <div className="relative h-[220px] sm:h-[300px] lg:h-[360px]">
            {WORDS.map((word, i) =>
              i === activeWord ? (
                <h1
                  key={word}
                  className="absolute inset-0 flex items-center font-bold text-red-500 text-[clamp(60px,9vw,130px)] leading-none tracking-tight drop-shadow-[0_0_40px_rgba(255,0,0,0.25)]"
                >
                  {word}
                </h1>
              ) : null
            )}
          </div>

          <p className="text-gray-400 italic">
            Sustainable style that hits different — without breaking your wallet.
          </p>

          {/* TAGS */}
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em]">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-gray-500">Trending:</span>
            <span className="text-red-400 font-medium">{TAGS[tagIndex]}</span>
          </div>

          {/* STATS */}
          <div className="flex gap-10 pt-6">
            {[
              ["312+", "Pieces live"],
              ["48h", "Drop cycle"],
              ["100%", "Hand-picked"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-3xl font-bold text-white">{num}</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER IMAGE */}
        <div
          className="relative h-[500px] lg:h-[650px]"
          style={{
            transform: `perspective(900px) rotateY(${mousePos.x * 0.25}deg) rotateX(${-mousePos.y * 0.2}deg)`,
          }}
        >
          {/* glow */}
          <div className="absolute -inset-10 bg-red-600/20 blur-3xl rounded-full" />

          <img
            src={retro}
            className="relative z-10 w-full h-full object-fit rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
          />

          <div className="absolute bottom-[-12px] left-10 right-10 h-[2px] bg-red-600 opacity-70" />
        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          {/* TOP CARD */}
          <div className="relative h-[260px] bg-zinc-950 border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-black" />

            <div className="absolute top-6 left-6 text-xs uppercase tracking-[0.3em] text-red-400">
              New Drop
            </div>

            <div className="absolute bottom-6 left-6 text-3xl font-bold tracking-wider">
              OPEN
            </div>

            <div className="absolute inset-0 grid grid-cols-8 opacity-10">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="border border-white/10" />
              ))}
            </div>
          </div>

          {/* BOTTOM CARD */}
          <div className="h-[240px] bg-black border border-red-500/20 p-5 relative shadow-[0_0_60px_rgba(255,0,0,0.08)]">
            <div className="text-3xl font-bold">
              LAST <span className="text-red-500">DROP</span>
            </div>

            <div className="mt-8">
              <div className="h-1 bg-white/10">
                <div className="h-full w-[65%] bg-red-500" />
              </div>

              <div className="flex justify-between text-[10px] mt-2 text-gray-500">
                <span>67% claimed</span>
                <span>48h left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="absolute bottom-0 w-full h-10 overflow-hidden border-t border-white/10 bg-black/60 backdrop-blur">
        <div className="flex whitespace-nowrap animate-marquee text-xs tracking-[0.3em] text-gray-500">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="pr-16">
              THRIFT IT · FLIP IT · FLEX IT · Y2K · VINTAGE · STREETWEAR · CURATED DROPS ·
            </span>
          ))}
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33%); }
        }

        .animate-marquee {
          animation: marquee 18s linear infinite;
        }

        .bg-radial-gradient {
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 70%, black 100%);
        }
      `}</style>
    </div>
  );
}