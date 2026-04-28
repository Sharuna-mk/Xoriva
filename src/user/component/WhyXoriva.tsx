import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ShieldCheck, Truck, Heart, BadgeCheck } from "lucide-react";

/* ── counter hook ── */
function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;

    const step = (t: number) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

/* ── stat card ── */
const StatCard = ({ icon: Icon, statTarget, suffix, name, desc, barWidth, delay, inView }: any) => {
  const count = useCountUp(statTarget, 1200, inView);

  return (
    <div
      className="group relative p-5 md:p-6 rounded-2xl border border-white/10 bg-white/60 backdrop-blur-md
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{
        animation: `fadeUp .5s ease ${delay}s both`,
      }}
    >
      {/* icon */}
      <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center mb-4">
        <Icon className="w-5 h-5" />
      </div>

      {/* number */}
      <p className="text-3xl md:text-4xl font-bold text-black">
        {count}
        <span className="text-black">{suffix}</span>
      </p>

      {/* title */}
      <p className="text-sm font-semibold text-gray-700 mt-1">{name}</p>

      {/* desc */}
      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{desc}</p>

      {/* bar */}
      <div className="h-1 w-full bg-gray-200 rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all duration-1000"
          style={{ width: inView ? barWidth : "0%" }}
        />
      </div>
    </div>
  );
};

/* ── data ── */
const STATS = [
  {
    statTarget: 500,
    suffix: "+",
    name: "Verified brands",
    desc: "Only trusted fashion partners on our platform.",
    barWidth: "65%",
    icon: ShieldCheck,
  },
  {
    statTarget: 2,
    suffix: " day",
    name: "Fast delivery",
    desc: "Quick shipping across India with tracking.",
    barWidth: "80%",
    icon: Truck,
  },
  {
    statTarget: 98,
    suffix: "%",
    name: "Happy customers",
    desc: "High satisfaction from real buyers.",
    barWidth: "95%",
    icon: Heart,
  },
  {
    statTarget: 100,
    suffix: "%",
    name: "Quality assured",
    desc: "Every product is quality-checked before dispatch.",
    barWidth: "100%",
    icon: BadgeCheck,
  },
];

/* ── main ── */
export default function WhyXoriva() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative px-4 md:px-10 py-16 md:py-24 bg-[#f7f7f7] overflow-hidden">

      {/* background blur */}
      <div className="absolute w-[500px] h-[500px] bg-black/5 rounded-full blur-3xl -top-40 -right-40" />
      <div className="absolute w-[400px] h-[400px] bg-black/5 rounded-full blur-3xl -bottom-40 -left-40" />

      {/* header */}
      <div className="text-center mb-12 relative z-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
          Why choose us
        </p>

        <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight">
          Built for{" "}
          <span className="underline decoration-black/30">trust</span> & style
        </h2>

        <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
          Every number reflects real customers, real delivery, and real fashion quality.
        </p>
      </div>

      {/* grid */}
      <div
        ref={ref}
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto"
      >
        {STATS.map((s, i) => (
          <StatCard key={s.name} {...s} delay={i * 0.1} inView={inView} />
        ))}
      </div>

      {/* bottom strip */}
      <div className="relative z-10 mt-12 text-center text-xs text-gray-500">
        Trusted by 12,000+ customers · Premium fashion marketplace
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}