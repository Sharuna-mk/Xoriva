import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────

const offerCards = [
  { id: 1, tag: "FLAT DEAL",  title: "Flat ₹300 off on ₹999+",       desc: "Code: SAVE300",          btn: "Claim →",     color: "blue"   },
  { id: 2, tag: "BANK OFFER", title: "Extra 10% off with SBI cards",  desc: "T&C apply",              btn: "Know more →", color: "indigo" },
  { id: 3, tag: "BUNDLE",     title: "Buy 2 get 1 free on tees",      desc: "Selected styles only",   btn: "Shop now →",  color: "sky"    },
  { id: 4, tag: "LOYALTY",    title: "Earn 3× coins this weekend",    desc: "Members only",           btn: "Join free →", color: "slate"  },
];

const genderCards = [
  {
    id: "women",
    label: "WOMEN'S EDIT",
    title: "For her",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=80",
  },
  {
    id: "men",
    label: "MEN'S EDIT",
    title: "For him",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=700&q=80",
  },
];

const categories = [
  { id: 1, name: "Footwear",    count: "1.2k+", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80"   },
  { id: 2, name: "Tops & Tees", count: "840+",  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&q=80" },
  { id: 3, name: "Dresses",     count: "560+",  image: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=120&q=80"   },
  { id: 4, name: "Bags",        count: "320+",  image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=120&q=80" },
  { id: 5, name: "Accessories", count: "980+",  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&q=80"   },
  { id: 6, name: "Bottoms",     count: "720+",  image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4b09?w=120&q=80" },
];

const dealProducts = [
  { id: 1, name: "Oversized Hoodie", price: 999,  oldPrice: 1499, image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300&q=80" },
  { id: 2, name: "Denim Jacket",     price: 1799, oldPrice: 2299, image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?w=300&q=80" },
  { id: 3, name: "Basic T-Shirt",    price: 499,  oldPrice: 799,  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80" },
];

const products = [
  { id: 1, title: "Oversized Hoodie",  price: 999,  oldPrice: 1499, image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&q=80", rating: 4.5, isNew: true  },
  { id: 2, title: "Casual Sneakers",   price: 1999, oldPrice: 2499, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",    rating: 4.2, isNew: true  },
  { id: 3, title: "Denim Jacket",      price: 1799, oldPrice: 2299, image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?w=400&q=80",  rating: 4.7, isNew: false },
  { id: 4, title: "Basic T-Shirt",     price: 499,  oldPrice: 799,  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",  rating: 4.3, isNew: true  },
  { id: 5, title: "Linen Trousers",    price: 1299, oldPrice: 1899, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4b09?w=400&q=80",  rating: 4.6, isNew: true  },
];

const heroImages = [
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=200&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027affff?w=200&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&q=80",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const discount = (price:number, oldPrice:number) =>
  Math.round(((oldPrice - price) / oldPrice) * 100);

const pad = (n:any) => String(n).padStart(2, "0");

// ── Sub-components ───────────────────────────────────────────────────────────

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className="w-3 h-3"
        fill={i <= Math.round(rating) ? "#f59e0b" : "transparent"}
        stroke={i <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const SectionHeader = ({ title, btnLabel = "See all" }) => (
  <div className="flex items-baseline justify-between mb-4">
    <h2 className="text-xl font-medium text-gray-900">{title}</h2>
    <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 active:bg-blue-100 transition-colors">
      {btnLabel}
    </button>
  </div>
);

// ── Offer strip ──────────────────────────────────────────────────────────────

const OfferStrip = () => (
  <div className="bg-blue-700 text-white flex items-center justify-center gap-8 px-4 py-2 flex-wrap text-xs font-medium tracking-wide">
    {["Free delivery above ₹499", "Use code FIRST20 for 20% off", "Easy 30-day returns", "New drops every Friday"].map(
      (msg, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0" />
          {msg}
        </span>
      )
    )}
  </div>
);

// ── Hero ─────────────────────────────────────────────────────────────────────

const Hero = () => (
 <div className="relative overflow-hidden h-[420px] sm:h-80 bg-blue-700 flex items-center">
    {/* Decorative circles */}
    <div className="absolute w-80 h-80 rounded-full bg-white/5 -top-20 right-20 pointer-events-none" />
    <div className="absolute w-48 h-48 rounded-full bg-white/5 -bottom-12 right-24 pointer-events-none" />

    {/* Left copy */}
  <div className="relative z-10 px-5 sm:px-10 flex-1">
      <span className="inline-block bg-white/15 text-blue-200 text-[10px] font-medium tracking-widest px-3 py-1 rounded-full mb-3">
        SEASON SALE — UP TO 60% OFF
      </span>
  <h1 className="text-2xl sm:text-4xl font-medium text-white leading-tight mb-2">
        Dress for{" "}
        <em className="not-italic text-blue-300">every<br />moment</em>
      </h1>
      <p className="text-sm text-blue-200 mb-5">
        Curated styles for him & her — fresh arrivals daily
      </p>
      <button className="bg-white text-blue-700 text-sm font-medium px-6 py-2.5 rounded-full hover:bg-blue-50 active:bg-blue-100 transition-colors">
        Shop the collection →
      </button>
    </div>

    {/* Right model images */}
    <div className="absolute right-0 bottom-0 hidden sm:flex items-end">
      {heroImages.map((src, i) => (
        <div
          key={i}
          className="overflow-hidden"
          style={{
            width: 130,
            height: i === 1 ? 280 : 240,
            opacity: i === 0 || i === 2 ? 0.85 : 1,
          }}
        >
          <img src={src} alt="fashion model" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>

    {/* Trending badge */}
    <div className="absolute top-5 right-5 bg-yellow-400 text-yellow-900 text-[11px] font-medium px-3 py-1 rounded-full">
      TRENDING NOW
    </div>
  </div>
);

// ── Offer cards ───────────────────────────────────────────────────────────────

const offerStyles = {
  blue:   { wrap: "bg-blue-50",   tag: "bg-blue-200 text-blue-900"   },
  indigo: { wrap: "bg-indigo-50", tag: "bg-indigo-200 text-indigo-900" },
  sky:    { wrap: "bg-sky-50",    tag: "bg-sky-200 text-sky-900"      },
  slate:  { wrap: "bg-slate-50 border border-gray-100", tag: "bg-slate-200 text-slate-700" },
};

const TodayOffers = () => (
  <section className="px-6 pt-7">
    <SectionHeader title="Today's offers" btnLabel="View all" />
    <div className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {offerCards.map((c) => {
        const s = offerStyles[c.color];
        return (
          <div key={c.id} className={`${s.wrap} rounded-2xl p-4 flex flex-col gap-2 cursor-pointer`}>
            <span className={`${s.tag} text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full w-fit`}>
              {c.tag}
            </span>
            <p className="text-sm font-medium text-gray-900 leading-snug">{c.title}</p>
            <p className="text-xs text-gray-500">{c.desc}</p>
            <button className="text-xs font-medium text-blue-600 text-left mt-1 hover:underline">
              {c.btn}
            </button>
          </div>
        );
      })}
    </div>
  </section>
);

// ── Gender section ────────────────────────────────────────────────────────────

const GenderSection = () => (
  <section className="px-6 pt-7">
    <SectionHeader title="Shop by gender" btnLabel="Browse all" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {genderCards.map((g) => (
        <div key={g.id} className="relative rounded-2xl overflow-hidden cursor-pointer h-44 sm:h-52 group">
          <img
            src={g.image}
            alt={g.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex flex-col justify-end p-5">
            <p className="text-[11px] font-medium text-blue-300 tracking-wide mb-1">{g.label}</p>
            <p className="text-xl font-medium text-white mb-2.5">{g.title}</p>
            <button className="w-fit text-xs font-medium text-white border border-white/50 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-colors">
              Explore →
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ── Top categories ────────────────────────────────────────────────────────────

const TopCategories = () => (
  <section className="px-4 sm:px-6 pt-7">
    <SectionHeader title="Top categories" />
    <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="flex flex-col items-center gap-2 cursor-pointer group w-[30%] sm:w-auto"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-indigo-100 group-hover:border-blue-600 transition-colors">
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          </div>
          <p className="text-xs font-medium text-gray-900 text-center">{cat.name}</p>
          <p className="text-[10px] text-gray-400">{cat.count} styles</p>
        </div>
      ))}
    </div>
  </section>
);
// ── Countdown timer ───────────────────────────────────────────────────────────

const useCountdown = (initialSeconds) => {
  const [total, setTotal] = useState(initialSeconds);
  useEffect(() => {
    const id = setInterval(() => setTotal((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  return {
    h: pad(Math.floor(total / 3600)),
    m: pad(Math.floor((total % 3600) / 60)),
    s: pad(total % 60),
  };
};

const TimerBlock = ({ value, label }) => (
  <div className="bg-white/15 rounded-lg px-3 py-1.5 text-center min-w-[44px]">
    <span className="block text-lg font-medium text-white">{value}</span>
    <span className="text-[9px] text-blue-300 tracking-wide">{label}</span>
  </div>
);

// ── Deals of the day ──────────────────────────────────────────────────────────

const DealsSection = () => {
  const { h, m, s } = useCountdown(5 * 3600 + 42 * 60 + 17);

  return (
    <section className="px-6 pt-7">
      <SectionHeader title="Deals of the day" btnLabel="More deals" />
      <div className="grid-cols-1 md:grid-cols-5">
        {/* Timer card */}
        <div className="md:col-span-2 bg-blue-900 rounded-2xl p-4 sm:p-6  flex flex-col justify-between relative overflow-hidden min-h-[220px]">
          <div className="absolute w-40 h-40 rounded-full bg-white/5 -bottom-8 -right-8 pointer-events-none" />
          <div>
            <p className="text-[11px] font-medium text-blue-300 tracking-wide mb-1">DAILY DROPS</p>
            <p className="text-xl font-medium text-white leading-snug mt-1">Flash sale<br />ends in</p>
            <div className="flex items-center gap-2 mt-3">
              <TimerBlock value={h} label="HRS" />
              <span className="text-lg text-blue-300 font-medium">:</span>
              <TimerBlock value={m} label="MIN" />
              <span className="text-lg text-blue-300 font-medium">:</span>
              <TimerBlock value={s} label="SEC" />
            </div>
          </div>
          <button className="w-fit mt-4 bg-white text-blue-700 text-xs font-medium px-5 py-2 rounded-full hover:bg-blue-50 transition-colors">
            Grab deals →
          </button>
        </div>

        {/* Deal product cards */}
      <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {dealProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer group hover:border-gray-200 transition-colors"
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-gray-900 mb-1 truncate">{p.name}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">₹{p.price.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 line-through">₹{p.oldPrice.toLocaleString()}</span>
                  <span className="text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                    {discount(p.price, p.oldPrice)}% off
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const NewArrivals = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  return (
    <section className="px-4 sm:px-6 pt-7 pb-10">
      <SectionHeader title="New arrivals" btnLabel="See all →" />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const pct = discount(product.price, product.oldPrice);
          const wishlisted = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:border-gray-200 transition-all duration-200 cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {product.isNew && (
                  <span className="absolute top-2.5 left-2.5 bg-blue-700 text-blue-50 text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wide">
                    NEW
                  </span>
                )}

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Heart
                    className="w-3.5 h-3.5"
                    fill={wishlisted ? "#e11d48" : "none"}
                    stroke={wishlisted ? "#e11d48" : "#9ca3af"}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* Details */}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate mb-1">
                  {product.title}
                </p>

                <div className="flex items-center gap-1.5 mb-2.5">
                  <StarRating rating={product.rating} />
                  <span className="text-[11px] text-gray-400">
                    {product.rating}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-400 line-through">
                    ₹{product.oldPrice.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                    {pct}% off
                  </span>
                </div>

                <button className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium py-2 rounded-full transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};



const FashionPage = () => (
  <div className="bg-gray-50 min-h-screen">
    <OfferStrip />
    <Hero />
    {/* <TodayOffers /> */}
    <GenderSection />
    <TopCategories />
    <DealsSection />
    <NewArrivals />
  </div>
);

export default FashionPage;