import React, { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import allenSollyImg from "../../assets/allenSolly.jpeg"; 

const SALE_END = new Date(Date.now() + (6 * 3600 + 20 * 60 + 10) * 1000);
const pad = (n: number) => String(n).padStart(2, "0");

function getTimeLeft(t: Date) {
  const d = Math.max(0, t.getTime() - Date.now());
  return {
    h: Math.floor(d / 3_600_000),
    m: Math.floor((d % 3_600_000) / 60_000),
    s: Math.floor((d % 60_000) / 1_000),
  };
}

export default function AllenSollyHero() {
  const [tl, setTl] = useState(getTimeLeft(SALE_END));
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTl(getTimeLeft(SALE_END)), 1000);
    return () => clearInterval(id);
  }, []);

  const handleShop = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="bg-[#f4f6f8] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[520px] relative">

      {/* subtle luxury background */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-black/5 -top-32 right-24 blur-2xl" />
      <div className="absolute w-[280px] h-[280px] rounded-full bg-gray-400/10 -bottom-24 left-10 blur-2xl" />

      {/* LEFT — Fashion Copy */}
      <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 md:px-14 py-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-black/5 text-black text-[10px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full w-fit mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          Allen Solly — Smart Casual Collection
        </div>

        {/* Heading */}
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-[0.2em] mb-2">
            Men's Fashion
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            Smart
          </h1>
          <h1 className="text-4xl md:text-5xl font-light italic text-gray-500 leading-tight">
            Casual
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            Essentials
          </h1>
        </div>

        <p className="text-sm text-gray-600 max-w-[340px] leading-relaxed mb-4">
          Premium shirts, chinos & blazers designed for modern professionals — effortless style from office to evening.
        </p>

        {/* Timer */}
        <div className="flex items-center gap-2 text-black font-mono text-sm mb-6">
          {[["h", "hrs"], ["m", "min"], ["s", "sec"]].map(([key, lbl], i) => (
            <React.Fragment key={key}>
              {i > 0 && <span className="text-gray-400">:</span>}
              <div className="flex flex-col items-center min-w-[40px]">
                <span className="text-xl font-bold">
                  {pad(tl[key as "h" | "m" | "s"])}
                </span>
                <span className="text-[10px] text-gray-500 uppercase">
                  {lbl}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleShop}
            className={`px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wide transition active:scale-95
            ${added ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"}`}
          >
            {added ? (
              <>
                <Check size={16} className="inline mr-1" /> Added
              </>
            ) : (
              <>
                Shop Collection <ArrowRight size={16} className="inline ml-1" />
              </>
            )}
          </button>

          <button className="px-6 py-3 rounded-full text-sm font-medium border border-black text-black hover:bg-black hover:text-white transition">
            Explore Styles
          </button>
        </div>

        {/* Trust */}
        <div className="flex flex-wrap gap-5 text-xs text-gray-500">
          {["Premium fabrics", "Office to casual wear", "Tailored fit"].map(t => (
            <div key={t} className="flex items-center gap-1">
              <Check size={12} />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Image */}
      <div className="relative overflow-hidden flex items-center justify-center">
        <img
          src={allenSollyImg}
          alt="Allen Solly Collection"
          className="w-full h-full object-cover object-center scale-105"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/70 via-transparent to-transparent" />

        {/* discount badge */}
        <div className="absolute top-5 right-5 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-200 text-center">
          <div className="text-lg font-bold">-35%</div>
          <div className="text-[10px] text-gray-500 uppercase">Season Offer</div>
        </div>

        {/* review card */}
        <div className="absolute bottom-6 right-5 bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-gray-200 max-w-[180px]">
          <div className="text-sm font-semibold">4.6 ★</div>
          <p className="text-[11px] text-gray-500">
            “Perfect office wear — premium fit and comfort.”
          </p>
        </div>
      </div>
    </section>
  );
}