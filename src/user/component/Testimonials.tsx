import React, { useRef } from "react";
import { ShoppingBag } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Review = {
  id: number;
  name: string;
  location: string;
  category: string;
  avatar: string;
  rating: number;
  quote: string;
  tag: string;
  date: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Ananya Sharma",
    location: "Mumbai",
    category: "Fashion",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    quote:
      "Ordered a hoodie and it arrived in two days. Quality is insane for the price — super soft, true to size.",
    tag: "Fashion",
    date: "2d ago",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    location: "Delhi",
    category: "Electronics",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    quote:
      "Finally a site I can trust. Earbuds were exactly as described. Fast shipping, zero hassle returns.",
    tag: "Electronics",
    date: "1w ago",
  },
  {
    id: 3,
    name: "Priya Nair",
    location: "Bangalore",
    category: "Skincare",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    quote:
      "The skincare range is absolutely amazing. My skin has never felt better. Xoriva is my go-to now.",
    tag: "Skincare",
    date: "3d ago",
  },
  {
    id: 4,
    name: "Karan Patel",
    location: "Pune",
    category: "Footwear",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    rating: 4,
    quote:
      "Sneakers look even better in person. Solid build, comfortable from day one. Great value.",
    tag: "Footwear",
    date: "5d ago",
  },
  {
    id: 5,
    name: "Sneha Reddy",
    location: "Hyderabad",
    category: "Accessories",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    rating: 5,
    quote:
      "Got a watch as a gift — the recipient was blown away. The presentation box alone is worth it.",
    tag: "Accessories",
    date: "1w ago",
  },
  {
    id: 6,
    name: "Dev Kapoor",
    location: "Chennai",
    category: "Fashion",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 5,
    quote:
      "Denim jacket fit is perfect. I always worry about online sizing but the size guide was spot-on.",
    tag: "Fashion",
    date: "2w ago",
  },
  {
    id: 7,
    name: "Meera Joshi",
    location: "Jaipur",
    category: "Skincare",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    rating: 5,
    quote:
      "Vitamin C serum changed my skin completely. Packaging is premium, arrived safely. 100% recommend.",
    tag: "Skincare",
    date: "4d ago",
  },
  {
    id: 8,
    name: "Arjun Singh",
    location: "Kolkata",
    category: "Sports",
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
    rating: 5,
    quote:
      "The gym gear is outstanding — breathable, well-stitched. Shipped faster than expected.",
    tag: "Sports",
    date: "6d ago",
  },
];

const PLATFORMS = [
  { name: "Google", score: "4.8", color: "#4285F4" },
  { name: "Trustpilot", score: "4.9", color: "#00b67a" },
  { name: "Shopify", score: "5.0", color: "#95bf47" },
];

// ─── Star renderer ────────────────────────────────────────────────────────────
const Stars: React.FC<{ rating: number; size?: number }> = ({
  rating,
  size = 12,
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        viewBox="0 0 24 24"
        style={{ width: size, height: size }}
        className={i <= rating ? "fill-amber-400" : "fill-gray-200"}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

// ─── Individual review card (fixed width for marquee) ─────────────────────────
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div
    className="flex-shrink-0 w-[300px] md:w-[320px] flex flex-col gap-3 p-5 rounded-2xl border border-gray-100 bg-[#fafafa] hover:border-gray-200 hover:bg-white transition-all duration-200 cursor-default"
    aria-label={`Review by ${review.name}`}
  >
    {/* Stars + date */}
    <div className="flex items-center justify-between">
      <Stars rating={review.rating} size={12} />
      <span className="text-[10px] text-gray-300">{review.date}</span>
    </div>

    {/* Quote */}
    <p className="text-[13px] text-zinc-600 leading-relaxed flex-1">
      <span
        className="text-[32px] leading-none align-[-8px] mr-0.5 text-gray-200 font-serif not-italic"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      {review.quote}
    </p>

    {/* User row */}
    <div className="flex items-center gap-2.5 pt-3 border-t border-gray-50">
      <img
        src={review.avatar}
        alt={review.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-100"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='16' fill='%23e4e4e7'/%3E%3C/svg%3E";
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold text-gray-900 truncate">
          {review.name}
        </p>
        <p className="text-[11px] text-gray-400 truncate">
          {review.location} &middot; {review.category}
        </p>
      </div>
      <span className="flex-shrink-0 text-[10px] font-semibold text-zinc-500 bg-gray-100 px-2.5 py-1 rounded-full">
        {review.tag}
      </span>
    </div>
  </div>
);

// ─── Marquee row ──────────────────────────────────────────────────────────────
// Duplicates the items so the loop is seamless
const MarqueeRow: React.FC<{ reviews: Review[]; reverse?: boolean }> = ({
  reviews,
  reverse = false,
}) => (
  <div className="overflow-hidden py-3">
    <div
      className={`flex gap-4 w-max ${
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      } hover:[animation-play-state:paused]`}
    >
      {/* Duplicate for infinite loop */}
      {[...reviews, ...reviews].map((r, i) => (
        <ReviewCard key={`${r.id}-${i}`} review={r} />
      ))}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Testimonials: React.FC = () => {
  const half = Math.ceil(ALL_REVIEWS.length / 2);
  const row1 = ALL_REVIEWS.slice(0, half);
  const row2 = ALL_REVIEWS.slice(half);

  return (
    <>
      {/* Inject keyframes once */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .animate-marquee         { animation: marquee 40s linear infinite; }
        .animate-marquee-reverse { animation: marquee-reverse 40s linear infinite; }
        .hover\\:[animation-play-state\\:paused]:hover { animation-play-state: paused; }
      `}</style>

      <section className="py-16 md:py-24 overflow-hidden bg-white">
        {/* ── Split header ── */}
        <div className="px-4 md:px-10 max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Left: heading */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-zinc-400 mb-3">
              What they say
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Words from
              <br />
              <span className="font-light italic text-zinc-400">
                real shoppers.
              </span>
            </h2>
          </div>

          {/* Right: aggregate score */}
          <div className="flex items-center gap-4 md:pb-1">
            <p className="text-6xl font-extrabold text-gray-900 leading-none tracking-tight">
              4.9
            </p>
            <div className="flex flex-col gap-1">
              <Stars rating={5} size={16} />
              <p className="text-xs text-gray-400">12,400+ reviews</p>
            </div>
          </div>
        </div>

        {/* ── Marquee rows ── */}
        <MarqueeRow reviews={row1} />
        <MarqueeRow reviews={row2} reverse />

        {/* ── Platform scores ── */}
        <div className="px-4 md:px-10 max-w-6xl mx-auto mt-10 flex flex-wrap items-center justify-center gap-3">
          {PLATFORMS.map((p, i) => (
            <React.Fragment key={p.name}>
              {i > 0 && (
                <span className="text-gray-200 text-sm hidden md:inline">
                  ·
                </span>
              )}
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-full bg-gray-50">
                <div
                  className="w-4 h-4 rounded-sm flex items-center justify-center text-white text-[8px] font-black flex-shrink-0"
                  style={{ background: p.color }}
                >
                  {p.name[0]}
                </div>
                <span className="text-[11px] text-gray-500">{p.name}</span>
                <span className="text-[12px] font-bold text-gray-900">
                  {p.score}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
    </>
  );
};

export default Testimonials;