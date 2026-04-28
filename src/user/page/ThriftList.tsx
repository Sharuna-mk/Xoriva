import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Condition = "New" | "Like New" | "Good" | "Used";
type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Custom";

const CATEGORIES = [
  "Streetwear","Y2K","Minimalist","Vintage 90s","Office Wear","Korean Style",
  "Dresses","Tops","Shirts","Pants / Jeans","Tees","Jackets / Outerwear","Accessories",
];
const SIZES: Size[] = ["XS","S","M","L","XL","XXL","Custom"];
const CONDITIONS: Condition[] = ["New","Like New","Good","Used"];
const CONDITION_DESC: Record<Condition,string> = {
  New: "Tags on, never worn",
  "Like New": "Worn once or twice",
  Good: "Normal wear, no damage",
  Used: "Visible wear, noted in desc",
};
const DECADES = ["1970s","1980s","1990s","2000s","2010s","2020s"];

// ─── Floating Label Input ─────────────────────────────────────────────────────
function FloatInput({
  label, value, onChange, type = "text", prefix, error, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; prefix?: string; error?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;
  return (
    <div className="relative mb-2">
      <label className={`absolute ${prefix ? 'left-7' : 'left-0'} transition-all duration-200 pointer-events-none z-10 font-['DM_Sans'] ${
        raised ? '-top-px text-[9px] tracking-[0.18em] uppercase font-medium' : 'top-3.5 text-[13px] tracking-[0.04em] font-normal'
      } ${focused ? 'text-[#0a0a0a]' : error ? 'text-[#C0392B]' : 'text-[#aaa]'}`}>
        {label}
      </label>
      <div className="flex items-center gap-1">
        {prefix && (
          <span className={`font-['DM_Sans'] text-[15px] transition-colors duration-200 mt-3.5 ${focused ? 'text-[#0a0a0a]' : 'text-[#bbb]'}`}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent border-none border-b-[1.5px] outline-none pt-[18px] pb-2 font-['DM_Sans'] text-[14px] text-[#0a0a0a] tracking-[0.02em] transition-colors duration-200 ${
            error ? 'border-b-[#C0392B]' : focused ? 'border-b-[#0a0a0a]' : 'border-b-[#e0e0e0]'
          }`}
        />
      </div>
      {(error || hint) && (
        <div className={`font-['DM_Sans'] text-[9px] tracking-[0.1em] mt-1 ${error ? 'text-[#C0392B]' : 'text-[#bbb]'}`}>
          {error || hint}
        </div>
      )}
    </div>
  );
}

// ─── Image Upload Slot ────────────────────────────────────────────────────────
function UploadSlot({
  main, image, onFile, onRemove,
}: {
  main?: boolean; image?: string; onFile: (f: File) => void; onRemove?: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  }, [onFile]);

  return (
    <div
      onClick={() => !image && inputRef.current?.click()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-[2px] overflow-hidden flex flex-col items-center justify-center transition-all duration-200 ${
        image ? 'bg-transparent' : dragging ? 'bg-[#f0eeeb]' : hover ? 'bg-[#f5f3f0]' : 'bg-[#FAFAFA]'
      } ${
        main 
          ? `border-[1.5px] ${image ? 'border-solid border-[#e0e0e0]' : `border-dashed ${dragging ? 'border-[#0a0a0a]' : hover ? 'border-[#aaa]' : 'border-[#d0d0d0]'}`} aspect-[4/5]`
          : `border-[1px] ${image ? 'border-solid border-[#e0e0e0]' : `border-dashed ${dragging ? 'border-[#0a0a0a]' : hover ? 'border-[#aaa]' : 'border-[#d0d0d0]'}`} aspect-square`
      } ${image ? 'cursor-default' : 'cursor-pointer'} gap-${main ? '3' : '1.5'}`}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />

      {image ? (
        <>
          <img src={image} alt="" className={`w-full h-full object-cover transition-transform duration-500 ${hover ? 'scale-104' : 'scale-100'}`} />
          {onRemove && hover && (
            <button onClick={e => { e.stopPropagation(); onRemove(); }} className="absolute top-2 right-2 bg-black/70 border-none text-white w-[26px] h-[26px] rounded-full cursor-pointer text-xs flex items-center justify-center">
              ✕
            </button>
          )}
        </>
      ) : (
        <>
          <div className={`transition-colors duration-200 ${dragging ? 'text-[#0a0a0a]' : 'text-[#ccc]'}`}>
            {main ? (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="5" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="11" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M3 22l7-6 5 5 4-4 8 7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          {main && (
            <>
              <div className="font-['DM_Sans'] text-xs font-medium text-[#888] tracking-[0.04em] text-center">
                Drag & drop your main photo
              </div>
              <div className="font-['DM_Sans'] text-[9px] tracking-[0.14em] uppercase text-[#ccc]">
                or click to browse
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── Live Preview Card ────────────────────────────────────────────────────────
function PreviewCard({ name, brand, price, category, condition, image, size }:
  { name: string; brand: string; price: string; category: string;
    condition: Condition | ""; image: string; size: string }) {
  const conditionColors: Record<Condition, string> = {
    New: "#1A7A3A", "Like New": "#2E7DAF", Good: "#8B6914", Used: "#888",
  };
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-[2px] overflow-hidden font-['DM_Sans']">
      <div className="aspect-[4/5] bg-[#f5f3f0] relative flex items-center justify-center">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-[#d0d0d0]">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="6" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="1.3"/>
              <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M4 25l8-7 5 5 5-5 9 8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <div className="text-[10px] mt-1.5 tracking-[0.1em]">Preview</div>
          </div>
        )}
        {condition && (
          <div className="absolute top-2.5 left-2.5 bg-[#888] text-white text-[8px] font-semibold tracking-[0.14em] uppercase py-0.5 px-2 rounded-[1px]"
               style={{ backgroundColor: conditionColors[condition] || "#888" }}>
            {condition}
          </div>
        )}
      </div>
      <div className="p-[14px_16px]">
        {category && (
          <div className="text-[8px] tracking-[0.2em] uppercase text-[#C0392B] font-medium mb-1">{category}</div>
        )}
        <div className="text-[14px] font-medium text-[#0a0a0a] tracking-[-0.01em] mb-0.5 min-h-[20px]">
          {name || <span className="text-[#d0d0d0]">Product name</span>}
        </div>
        <div className="text-[11px] text-[#aaa] mb-2.5">
          {brand || <span className="text-[#e0e0e0]">Brand</span>}
          {size ? <span className="ml-2 text-[#bbb]">· {size}</span> : null}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-['Bebas_Neue'] text-[22px] tracking-[0.06em] text-[#0a0a0a]">
            {price ? `₹${price}` : <span className="text-[#e0e0e0]">₹0</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ThriftList() {
  // Form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const [size, setSize] = useState<Size | "">("");
  const [customSize, setCustomSize] = useState("");
  const [condition, setCondition] = useState<Condition | "">("");
  const [decade, setDecade] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [extraImages, setExtraImages] = useState<string[]>(["","","","","",""]);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const toggleCat = (c: string) =>
    setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleExtraImage = (i: number, file: File) => {
    const url = URL.createObjectURL(file);
    setExtraImages(prev => { const next = [...prev]; next[i] = url; return next; });
  };

  const autoGenDesc = () => {
    if (!name && !brand && !selectedCats.length) return;
    setAiLoading(true);
    setTimeout(() => {
      const cat = selectedCats[0] || "fashion";
      const cond = condition || "good";
      setDescription(
        `This ${brand ? brand + " " : ""}piece is a standout ${cat.toLowerCase()} essential. ${
          condition === "New" ? "Brand new with tags — never worn." :
          condition === "Like New" ? "Barely worn, in excellent condition." :
          condition === "Good" ? "Gently used with minimal wear." :
          "Pre-loved with character — any flaws noted above."
        } A ${size || "versatile"} fit that layers effortlessly and brings serious energy to any outfit. Perfect for building a curated, intentional wardrobe.`
      );
      setAiLoading(false);
    }, 1400);
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!name.trim()) e.name = "Product name is required";
    if (!price || isNaN(Number(price))) e.price = "Enter a valid price";
    if (!selectedCats.length) e.cats = "Select at least one category";
    if (!condition) e.condition = "Select item condition";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setSubmitted(true);
  };

  const displaySize = size === "Custom" ? customSize : size;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center font-['DM_Sans'] p-8 gap-6">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital@1&display=swap');`}</style>
        <div className="w-14 h-14 rounded-full border-[1.5px] border-[#1A7A3A] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 11l5 5 9-9" stroke="#1A7A3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="font-['Bebas_Neue'] text-[2.5rem] tracking-[0.1em] text-[#0a0a0a]">Item Listed!</div>
        <p className="text-[#888] text-sm text-center max-w-[320px] leading-relaxed">
          Your piece is now live. We'll notify you once someone shows interest.
        </p>
        <button onClick={() => { setSubmitted(false); setName(""); setPrice(""); setBrand("");
          setDescription(""); setSelectedCats([]); setMainImage(""); setCondition(""); setSize(""); }}
          className="font-['Bebas_Neue'] text-sm tracking-[0.2em] bg-[#0a0a0a] text-white border-none py-[14px] px-9 rounded-[1px] cursor-pointer">
          List Another Piece
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-['DM_Sans']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Cormorant+Garamond:ital@1&display=swap');
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
        textarea:focus { outline: none; }
        textarea { resize: vertical; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @media (max-width: 860px) {
          .lp-grid { grid-template-columns: 1fr !important; }
          .lp-preview { display: none !important; }
          .lp-sticky-cta { display: flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .scale-104 { transform: scale(1.04); }
      `}</style>

      {/* Top nav bar */}
      <div className="border-b border-[#ebebeb] px-12 h-14 flex items-center justify-between bg-white sticky top-0 z-[100]">
        <span className="font-['Bebas_Neue'] text-xl tracking-[0.14em] text-[#0a0a0a]">
          Last Drop
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1A7A3A]" />
          <span className="text-[11px] tracking-[0.1em] text-[#888]">Seller Mode</span>
        </div>
      </div>

      {/* Page header */}
      <div className="pt-16 pb-10 px-12 max-w-[1260px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-[#C0392B]" />
          <span className="text-[9px] tracking-[0.28em] uppercase text-[#C0392B] font-medium">New Listing</span>
        </div>
        <h1 className="font-['Bebas_Neue'] text-[clamp(3rem,7vw,6rem)] tracking-[0.1em] text-[#0a0a0a] leading-[0.9] m-0 mb-2">
          List Your<br/>
          <span style={{ WebkitTextStroke: "2px #0a0a0a", color: "transparent" }}>Piece</span>
        </h1>
        <p className="font-['Cormorant_Garamond'] italic text-[clamp(14px,1.6vw,17px)] text-[#888] m-0">
          Turn your wardrobe into someone's next favorite fit
        </p>
      </div>

      {/* Main 3-col grid */}
      <div className="lp-grid max-w-[1260px] mx-auto px-12 pb-24 grid grid-cols-[1fr_1.5fr_320px] gap-7 items-start">

        {/* ── COL 1: Media Upload ── */}
        <div className="flex flex-col gap-3">
          <div className="text-[9px] tracking-[0.22em] uppercase text-[#aaa] font-medium mb-1">Cover Photo</div>
          <UploadSlot
            main
            image={mainImage}
            onFile={f => setMainImage(URL.createObjectURL(f))}
            onRemove={() => setMainImage("")}
          />

          <div className="text-[9px] tracking-[0.22em] uppercase text-[#aaa] font-medium mt-2">Additional Angles</div>
          <div className="grid grid-cols-3 gap-2">
            {extraImages.map((img, i) => (
              <UploadSlot
                key={i}
                image={img}
                onFile={f => handleExtraImage(i, f)}
                onRemove={() => {
                  setExtraImages(prev => { const n = [...prev]; n[i] = ""; return n; });
                }}
              />
            ))}
          </div>
          <div className="text-[9px] tracking-[0.1em] text-[#ccc] text-center mt-1">
            Front · Back · Tags · Details
          </div>
        </div>

        {/* ── COL 2: Form ── */}
        <div className="flex flex-col gap-0">

          {/* Basic Info */}
          <div className="mb-8">
            <SectionLabel>Basic Info</SectionLabel>
            <FloatInput label="Product Name" value={name} onChange={setName} error={errors.name} />
            <div className="mt-5">
              <FloatInput label="Brand Name" value={brand} onChange={setBrand}
                hint="Leave blank if unbranded" />
            </div>
            <div className="mt-5">
              <FloatInput label="Asking Price" value={price} onChange={v => setPrice(v.replace(/\D/,""))}
                type="number" prefix="₹" error={errors.price} />
            </div>
          </div>

          {/* Category Pills */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>Style / Category</SectionLabel>
              <button onClick={() => setCatOpen(o => !o)} className={`bg-transparent border-none font-['DM_Sans'] text-[9px] tracking-[0.14em] uppercase cursor-pointer p-0 transition-colors duration-200 ${catOpen ? 'text-[#C0392B]' : 'text-[#aaa]'}`}>
                {catOpen ? "Done" : "Browse all"}
              </button>
            </div>
            {errors.cats && (
              <div className="text-[9px] text-[#C0392B] tracking-[0.1em] mb-2">{errors.cats}</div>
            )}
            {/* Selected pills always visible */}
            <div className={`flex flex-wrap gap-1.5 ${catOpen ? 'mb-2.5' : 'mb-0'}`}>
              {selectedCats.map(c => (
                <button key={c} onClick={() => toggleCat(c)} className="font-['DM_Sans'] text-[10px] tracking-[0.1em] bg-[#0a0a0a] text-white border border-[#0a0a0a] rounded-[20px] py-[5px] px-[14px] cursor-pointer flex items-center gap-1.5 transition-all duration-200">
                  {c}
                  <span className="text-[10px] leading-none">✕</span>
                </button>
              ))}
              {selectedCats.length === 0 && !catOpen && (
                <button onClick={() => setCatOpen(true)} className="font-['DM_Sans'] text-[10px] tracking-[0.1em] bg-transparent text-[#aaa] border border-dashed border-[#d8d8d8] rounded-[20px] py-[5px] px-[14px] cursor-pointer">
                  + Add style
                </button>
              )}
            </div>
            {/* Expanded picker */}
            <div className={`overflow-hidden transition-[max-height] duration-380 ${catOpen ? 'max-h-[200px]' : 'max-h-0'}`}>
              <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-[#f0f0f0]">
                {CATEGORIES.filter(c => !selectedCats.includes(c)).map(c => (
                  <button key={c} onClick={() => toggleCat(c)} className="font-['DM_Sans'] text-[10px] tracking-[0.08em] bg-transparent text-[#555] border border-[#e0e0e0] rounded-[20px] py-[5px] px-[14px] cursor-pointer transition-colors duration-200 hover:border-[#0a0a0a] hover:text-[#0a0a0a]">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="mb-8">
            <SectionLabel>Condition</SectionLabel>
            {errors.condition && (
              <div className="text-[9px] text-[#C0392B] tracking-[0.1em] mb-2">{errors.condition}</div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {CONDITIONS.map(c => {
                const colors: Record<Condition,string> = {
                  New: "#1A7A3A","Like New": "#2E7DAF",Good:"#8B6914",Used:"#888",
                };
                const active = condition === c;
                return (
                  <button key={c} onClick={() => setCondition(c)} className={`font-['DM_Sans'] rounded-[2px] py-2.5 px-2 cursor-pointer text-[11px] font-medium tracking-[0.04em] text-center transition-all duration-200 ${
                    active 
                      ? `text-white border` 
                      : 'bg-white text-[#555] border border-[#e0e0e0]'
                  }`} style={active ? { backgroundColor: colors[c], borderColor: colors[c] } : {}}>
                    <div>{c}</div>
                    <div className="text-[8px] opacity-70 mt-0.5 font-normal tracking-[0.04em] leading-tight">
                      {CONDITION_DESC[c]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <SectionLabel>Size</SectionLabel>
            <div className="flex gap-1.5 flex-wrap">
              {SIZES.map(s => (
                <button key={s} onClick={() => setSize(s)} className={`font-['DM_Sans'] text-[11px] tracking-[0.08em] rounded-[1px] w-11 h-10 cursor-pointer transition-all duration-200 ${
                  size === s 
                    ? 'bg-[#0a0a0a] text-white border border-[#0a0a0a]' 
                    : 'bg-white text-[#555] border border-[#e0e0e0]'
                }`}>
                  {s}
                </button>
              ))}
            </div>
            {size === "Custom" && (
              <div className="mt-3">
                <FloatInput label="Custom size (e.g. 32×30, UK 8)" value={customSize} onChange={setCustomSize} />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <SectionLabel>Description</SectionLabel>
              <button onClick={autoGenDesc} disabled={aiLoading} className="font-['DM_Sans'] text-[9px] tracking-[0.16em] uppercase bg-transparent border border-[#e0e0e0] rounded-[20px] text-[#888] py-[5px] px-[14px] cursor-pointer flex items-center gap-1.5 transition-colors duration-200 hover:border-[#0a0a0a] hover:text-[#0a0a0a] disabled:opacity-50">
                {aiLoading ? (
                  <span className="inline-block w-2.5 h-2.5 border-[1.5px] border-[#ccc] border-t-[#0a0a0a] rounded-full animate-spin" />
                ) : "✦"}
                {aiLoading ? "Writing…" : "AI Write"}
              </button>
            </div>
            <div className="relative">
              <label className={`absolute left-0 transition-all duration-200 pointer-events-none font-['DM_Sans'] ${
                descFocused || description.length > 0 
                  ? '-top-0.5 text-[9px] tracking-[0.18em] uppercase font-medium' 
                  : 'top-3 text-[13px] tracking-[0.04em] font-normal'
              } ${descFocused ? 'text-[#0a0a0a]' : 'text-[#aaa]'}`}>
                Describe fabric, fit, condition, styling tips…
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                rows={5}
                className={`w-full bg-transparent border-none border-b-[1.5px] pt-[22px] pb-2 font-['DM_Sans'] text-[13px] text-[#0a0a0a] leading-relaxed transition-colors duration-200 tracking-[0.02em] resize-y ${
                  descFocused ? 'border-b-[#0a0a0a]' : 'border-b-[#e0e0e0]'
                }`}
              />
              <div className="text-right text-[9px] text-[#ccc] mt-1 tracking-[0.06em]">
                {description.length} chars
              </div>
            </div>
          </div>

          {/* Year & Quantity */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Decade */}
            <div>
              <SectionLabel>Era / Decade</SectionLabel>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {DECADES.map(d => (
                  <button key={d} onClick={() => setDecade(decade === d ? "" : d)} className={`font-['DM_Sans'] text-[10px] tracking-[0.08em] rounded-[1px] py-[5px] px-2.5 cursor-pointer transition-all duration-200 ${
                    decade === d 
                      ? 'bg-[#0a0a0a] text-white border border-[#0a0a0a]' 
                      : 'bg-white text-[#666] border border-[#e0e0e0]'
                  }`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity stepper */}
            <div>
              <SectionLabel>Quantity</SectionLabel>
              <div className="flex items-center gap-0 mt-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-[38px] h-[38px] bg-white border border-[#e0e0e0] border-r-0 rounded-[1px_0_0_1px] cursor-pointer text-base text-[#555] flex items-center justify-center transition-colors duration-200 hover:bg-[#f5f5f5]">
                  −
                </button>
                <div className="w-[52px] h-[38px] border border-[#e0e0e0] flex items-center justify-center font-['Bebas_Neue'] text-xl tracking-[0.06em] text-[#0a0a0a]">
                  {quantity}
                </div>
                <button onClick={() => setQuantity(q => q + 1)} className="w-[38px] h-[38px] bg-white border border-[#e0e0e0] border-l-0 rounded-[0_1px_1px_0] cursor-pointer text-base text-[#555] flex items-center justify-center transition-colors duration-200 hover:bg-[#f5f5f5]">
                  +
                </button>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit} className="flex-2 font-['Bebas_Neue'] text-base tracking-[0.22em] bg-[#0a0a0a] text-white border-[1.5px] border-[#0a0a0a] rounded-[1px] py-4 cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-200 hover:shadow-[4px_4px_0_#C0392B] hover:-translate-y-0.5">
              List Item
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="flex-1 font-['DM_Sans'] text-[11px] tracking-[0.14em] uppercase bg-transparent text-[#888] border border-[#e0e0e0] rounded-[1px] py-4 cursor-pointer transition-colors duration-200 hover:border-[#0a0a0a] hover:text-[#0a0a0a]">
              Save Draft
            </button>
          </div>
        </div>

        {/* ── COL 3: Live Preview ── */}
        <div className="lp-preview sticky top-[72px] flex flex-col gap-4">
          <div>
            <div className="text-[9px] tracking-[0.22em] uppercase text-[#aaa] font-medium mb-3">Live Preview</div>
            <PreviewCard
              name={name} brand={brand} price={price}
              category={selectedCats[0] || ""}
              condition={condition}
              image={mainImage}
              size={displaySize || ""}
            />
          </div>

          {/* Checklist */}
          <div className="bg-white border border-[#ebebeb] rounded-[2px] p-[14px_16px]">
            <div className="text-[9px] tracking-[0.2em] uppercase text-[#aaa] mb-2.5 font-medium">Listing Checklist</div>
            {[
              ["Cover photo", !!mainImage],
              ["Product name", !!name.trim()],
              ["Price set", !!price],
              ["Category chosen", selectedCats.length > 0],
              ["Condition rated", !!condition],
              ["Description added", description.length > 20],
            ].map(([label, done]) => (
              <div key={label as string} className="flex items-center gap-2 mb-[7px]">
                <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 border-[1.5px] flex items-center justify-center transition-all duration-200 ${done ? 'border-[#1A7A3A] bg-[#1A7A3A]' : 'border-[#e0e0e0] bg-transparent'}`}>
                  {done && (
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                      <path d="M1.5 3.5l1.5 1.5 3-3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className={`font-['DM_Sans'] text-[11px] transition-colors duration-200 ${done ? 'text-[#0a0a0a]' : 'text-[#bbb]'}`}>
                  {label as string}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lp-sticky-cta hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3 px-6 gap-2.5 z-[200]">
        <button onClick={handleSubmit} className="flex-2 font-['Bebas_Neue'] text-[15px] tracking-[0.2em] bg-[#0a0a0a] text-white border-none rounded-[1px] py-[14px] cursor-pointer">
          List Item
        </button>
        <button className="flex-1 font-['DM_Sans'] text-[10px] tracking-[0.12em] uppercase bg-transparent text-[#888] border border-[#e0e0e0] rounded-[1px] py-[14px] cursor-pointer">
          Save Draft
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['DM_Sans'] text-[9px] tracking-[0.22em] uppercase text-[#0a0a0a] font-medium mb-3 pb-2 border-b border-[#f0f0f0]">
      {children}
    </div>
  );
}