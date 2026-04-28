import React, { useEffect, useState } from 'react'
import { Heart, Star, ArrowLeft, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToWishList, fetchWishlist } from '../../store/wishlistSlice'
import { Link, useLocation } from "react-router-dom";
import { allProductAPI } from '../../services/allAPI'
import Header from '../component/Header';
import { searchProducts } from '../../store/searchSlice'

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className="w-3 h-3"
                    fill={i <= Math.round(rating) ? "#f59e0b" : "transparent"}
                    stroke={i <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
                />
            ))}
        </div>
    );
};

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};

const card = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

type SortOption = "default" | "price_asc" | "price_desc" | "rating_desc" | "discount_desc";
type RatingFilter = 0 | 1 | 2 | 3 | 4;

const SORT_LABELS: Record<SortOption, string> = {
    default: "Relevance",
    price_asc: "Price: Low to High",
    price_desc: "Price: High to Low",
    rating_desc: "Top Rated",
    discount_desc: "Best Discount",
};

const RATING_OPTIONS: { label: string; value: RatingFilter }[] = [
    { label: "4★ & above", value: 4 },
    { label: "3★ & above", value: 3 },
    { label: "2★ & above", value: 2 },
    { label: "1★ & above", value: 1 },
];

const Allproduct = () => {
    const location = useLocation();
    const [productData, setProductData] = useState<any[]>([]);
    const [activeBrand, setActiveBrand] = useState<string>(location.state?.brand || "All");
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [minRating, setMinRating] = useState<RatingFilter>(0);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const dispatch = useDispatch();
    const { items } = useSelector((state: any) => state.wishlist);
    const { query, results, loading } = useSelector((state: any) => state.search);

    const getallProduct = async () => {
        try {
            const res = await allProductAPI();
            setProductData(res?.products);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getallProduct();
        dispatch(fetchWishlist());
    }, []);

    useEffect(() => {
        if (query) dispatch(searchProducts(query));
    }, [query]);

    const brands = ["All", ...Array.from(
        new Set(productData.map((p: any) => p.brand).filter(Boolean))
    )] as string[];

    const activeFilterCount = [
        activeBrand !== "All",
        sortBy !== "default",
        minRating > 0,
    ].filter(Boolean).length;

    const dataToShow = (() => {
        let data: any[] = query ? results : productData;

        if (activeBrand !== "All") {
            data = data.filter((p: any) => p.brand === activeBrand);
        }

        if (minRating > 0) {
            data = data.filter((p: any) => p.rating >= minRating);
        }

        data = [...data].sort((a, b) => {
            if (sortBy === "price_asc") return a.final_price_inr - b.final_price_inr;
            if (sortBy === "price_desc") return b.final_price_inr - a.final_price_inr;
            if (sortBy === "rating_desc") return b.rating - a.rating;
            if (sortBy === "discount_desc") return b.discountPercentage - a.discountPercentage;
            return 0;
        });

        return data;
    })();

    const isInWishlist = (productId: string) =>
        items?.some((item: any) => item?.product?._id === productId);

    const clearAllFilters = () => {
        setActiveBrand("All");
        setSortBy("default");
        setMinRating(0);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />

            <div className="max-w-screen-xl mx-auto px-3 md:px-6 py-4">

                <div className="flex items-center justify-between mb-3">
                    <Link to='/' className='block sm:hidden'>
                        <ArrowLeft className="border border-black rounded-sm" />
                    </Link>
                    <p className="text-sm text-gray-500 hidden sm:block">
                        {dataToShow.length} products found
                        {activeBrand !== "All" && <span className="font-medium text-black"> in {activeBrand}</span>}
                    </p>
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-sm px-4 py-2 rounded-full md:hidden shadow-sm"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters {activeFilterCount > 0 && <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>}
                    </button>
                </div>

                <div className="flex gap-5">

                    {/* DESKTOP SIDEBAR */}
                    <aside className="hidden md:block w-56 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-20">

                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <span className="font-semibold text-sm text-gray-800">Filters</span>
                                {activeFilterCount > 0 && (
                                    <button onClick={clearAllFilters} className="text-xs text-blue-600 hover:underline">
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort By</p>
                                <div className="flex flex-col gap-1.5">
                                    {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setSortBy(key)}
                                            className={`text-left text-sm px-2 py-1.5 rounded-lg transition-all ${
                                                sortBy === key
                                                    ? "bg-black text-white font-medium"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {SORT_LABELS[key]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer Rating</p>
                                <div className="flex flex-col gap-1.5">
                                    {RATING_OPTIONS.map(({ label, value }) => (
                                        <button
                                            key={value}
                                            onClick={() => setMinRating(minRating === value ? 0 : value)}
                                            className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg transition-all ${
                                                minRating === value
                                                    ? "bg-black text-white font-medium"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span>{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-4 py-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Brand</p>
                                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
                                    {brands.map((brand) => (
                                        <button
                                            key={brand}
                                            onClick={() => setActiveBrand(brand)}
                                            className={`flex items-center gap-2 text-left text-sm px-2 py-1.5 rounded-lg transition-all ${
                                                activeBrand === brand
                                                    ? "bg-black text-white font-medium"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 transition-all ${
                                                activeBrand === brand ? "bg-white border-white" : "border-gray-400"
                                            }`} />
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* PRODUCT AREA */}
                    <div className="flex-1 min-w-0">

                        {/* DESKTOP TOP BAR */}
                        <div className="hidden md:flex items-center justify-between mb-4">
                            <div className="flex flex-wrap gap-2">
                                {activeBrand !== "All" && (
                                    <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full">
                                        {activeBrand}
                                        <button onClick={() => setActiveBrand("All")}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                                {sortBy !== "default" && (
                                    <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full">
                                        {SORT_LABELS[sortBy]}
                                        <button onClick={() => setSortBy("default")}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                                {minRating > 0 && (
                                    <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full">
                                        {minRating}★ & above
                                        <button onClick={() => setMinRating(0)}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400">{dataToShow.length} results</p>
                        </div>

                        {/* MOBILE SORT ROW */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:hidden scrollbar-hide">
                            <div className="relative flex-shrink-0">
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all ${
                                        sortBy !== "default" ? "bg-black text-white border-black" : "bg-white border-gray-300"
                                    }`}
                                >
                                    Sort <ChevronDown className="w-3 h-3" />
                                </button>
                                <AnimatePresence>
                                    {showSortDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className="absolute top-9 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 w-48 overflow-hidden"
                                        >
                                            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                                                <button
                                                    key={key}
                                                    onClick={() => { setSortBy(key); setShowSortDropdown(false); }}
                                                    className={`w-full text-left text-sm px-4 py-2.5 transition-all ${
                                                        sortBy === key ? "bg-black text-white" : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {SORT_LABELS[key]}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {RATING_OPTIONS.map(({ label, value }) => (
                                <button
                                    key={value}
                                    onClick={() => setMinRating(minRating === value ? 0 : value)}
                                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all ${
                                        minRating === value ? "bg-black text-white border-black" : "bg-white border-gray-300"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {loading && (
                            <p className="text-center text-gray-500 py-10">Searching products...</p>
                        )}

                        {!loading && dataToShow.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <SlidersHorizontal className="w-10 h-10 mb-3 opacity-30" />
                                <p className="text-sm">No products match your filters</p>
                                <button onClick={clearAllFilters} className="mt-3 text-xs text-blue-600 hover:underline">
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
                        >
                            {dataToShow.map((product: any) => (
                                <motion.div
                                    key={product._id}
                                    variants={card}
                                    whileTap={{ scale: 0.97 }}
                                    className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="relative overflow-hidden aspect-[3/4]">
                                        <Link to={`/product/${product._id}`}>
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/10 backdrop-blur-[1px]" />
                                        </Link>

                                        {Math.round(product.discountPercentage) >= 10 && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {Math.round(product.discountPercentage)}% OFF
                                            </span>
                                        )}

                                        <button
                                            onClick={() => {
                                                dispatch(addToWishList({ id: product._id }))
                                                    .then(() => dispatch(fetchWishlist()));
                                            }}
                                            className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                                        >
                                            <Heart
                                                className="w-4 h-4"
                                                fill={isInWishlist(product._id) ? "#e11d48" : "none"}
                                                stroke={isInWishlist(product._id) ? "#e11d48" : "#9ca3af"}
                                            />
                                        </button>

                                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition hidden md:block">
                                            <button
                                                onClick={() => {
                                                    dispatch(addToWishList({ id: product._id }))
                                                        .then(() => dispatch(fetchWishlist()));
                                                }}
                                                className="w-full bg-white text-black text-xs font-semibold py-2 rounded-full flex items-center justify-center gap-1 active:scale-95 transition"
                                            >
                                                <Heart className="w-3.5 h-3.5 text-red-500" />
                                                add to wishlist
                                            </button>
                                        </div>
                                    </div>

                                    <Link to={`/product/${product._id}`}>
                                        <div className="p-3 flex flex-col gap-1">
                                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide truncate">{product.brand}</p>
                                            <h3 className="text-sm font-medium text-gray-900 truncate">{product.title}</h3>
                                            <div className="flex items-center gap-1">
                                                <span className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                                    {product.rating} <Star className="w-2.5 h-2.5 fill-white" />
                                                </span>
                                                <StarRating rating={product.rating} />
                                            </div>
                                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                                <span className="text-sm font-bold text-gray-900">₹{product.final_price_inr?.toLocaleString()}</span>
                                                <span className="text-[11px] text-gray-400 line-through">₹{product.original_price_inr?.toLocaleString()}</span>
                                                <span className="text-[10px] text-green-700 font-semibold">{Math.round(product.discountPercentage)}% off</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* MOBILE FILTER DRAWER */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed inset-0 bg-black/40 z-50"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.25 }}
                            className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white z-50 overflow-y-auto shadow-2xl"
                        >
                            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 sticky top-0 bg-white">
                                <span className="font-semibold text-gray-800">Filters & Sort</span>
                                <button onClick={() => setShowMobileFilters(false)}>
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <div className="px-4 py-4 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sort By</p>
                                <div className="flex flex-col gap-1.5">
                                    {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setSortBy(key)}
                                            className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${
                                                sortBy === key ? "bg-black text-white font-medium" : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {SORT_LABELS[key]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-4 py-4 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Customer Rating</p>
                                <div className="flex flex-col gap-1.5">
                                    {RATING_OPTIONS.map(({ label, value }) => (
                                        <button
                                            key={value}
                                            onClick={() => setMinRating(minRating === value ? 0 : value)}
                                            className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${
                                                minRating === value ? "bg-black text-white font-medium" : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-4 py-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Brand</p>
                                <div className="flex flex-col gap-1.5">
                                    {brands.map((brand) => (
                                        <button
                                            key={brand}
                                            onClick={() => setActiveBrand(brand)}
                                            className={`flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg transition-all ${
                                                activeBrand === brand ? "bg-black text-white font-medium" : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 ${
                                                activeBrand === brand ? "bg-white border-white" : "border-gray-400"
                                            }`} />
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
                                <button
                                    onClick={clearAllFilters}
                                    className="flex-1 border border-gray-300 text-sm py-2.5 rounded-xl font-medium"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 bg-black text-white text-sm py-2.5 rounded-xl font-medium"
                                >
                                    Apply ({dataToShow.length} items)
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Allproduct;