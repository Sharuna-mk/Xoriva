import React, { useState } from "react";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";

// ─── DATA ─────────────────────────────
const COLUMNS = [
  {
    title: "Shop",
    links: ["New arrivals", "Fashion", "Electronics", "Skincare", "Footwear"],
  },
  {
    title: "Support",
    links: ["Track order", "Returns", "Shipping", "FAQ", "Contact"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Sustainability", "Affiliate"],
  },
];

const LEGAL = ["Privacy", "Terms", "Cookies"];

// ─── MAIN ─────────────────────────────
export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const subscribe = () => {
    if (!email) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 2500);
  };

  return (
    <footer className="bg-[#0b0b0f] text-white overflow-hidden">

      {/* ───────── CTA STRIP ───────── */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#111827] to-[#0b0b0f]">
        <div className="max-w-6xl mx-auto px-4 md:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          <div>
            <p className="text-[10px] tracking-[3px] uppercase text-white/40">
              Newsletter
            </p>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight mt-2">
              Get <span className="text-white/60">exclusive drops</span> first
            </h3>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            {done ? (
              <p className="text-green-400 text-sm font-medium">
                Subscribed successfully
              </p>
            ) : (
              <>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full md:w-64 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                  outline-none focus:border-white/30 text-sm"
                />
                <button
                  onClick={subscribe}
                  className="px-4 py-2.5 rounded-xl bg-white text-black font-medium text-sm
                  hover:scale-[1.02] transition active:scale-95 flex items-center gap-2"
                >
                  Subscribe <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ───────── MAIN LINKS ───────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <h1 className="text-xl font-bold tracking-tight">
            XO<span className="text-white/50">RIVA</span>
          </h1>
          <p className="text-sm text-white/50 mt-4 leading-relaxed">
            Minimal fashion & lifestyle store built for modern shopping.
            Clean design. Premium feel.
          </p>
        </div>

        {/* Links */}
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-[10px] tracking-[3px] uppercase text-white/40 mb-4">
              {col.title}
            </p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ───────── TRUST STRIP ───────── */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} XORIVA. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs text-white/50">

            <div className="flex items-center gap-1.5">
              <Lock size={14} />
              Secure checkout
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Verified store
            </div>

          </div>

          <div className="flex gap-4 text-xs text-white/40">
            {LEGAL.map((l) => (
              <a key={l} href="#" className="hover:text-white transition">
                {l}
              </a>
            ))}
          </div>

        </div>
      </div>

    </footer>
  );
}