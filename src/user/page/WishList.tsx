import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishList } from "../../store/wishlistSlice";
import { ArrowLeft } from "lucide-react";


const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
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


const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, y: 10 },
};

const WishList: React.FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: any) => state.wishlist);
  console.log(items);

  const handleRemove = (id) => {
    dispatch(removeFromWishList({ id })).then(() => {
      dispatch(fetchWishlist());
    });
  };

  const [token, setToken] = useState("");

  useEffect(() => {
    const tok = sessionStorage.getItem("Token");
    setToken(tok || "");
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, token]);

  return (
    <div>
      {token ? (
        <div className="px-4 md:px-10 py-14 bg-gradient-to-b from-[#fafafa] to-white min-h-screen">

          <Link to='/' >
            <ArrowLeft className="border border-black rounded-sm" />
          </Link>

          {/* Header */}
          <div className="mb-10 flex items-end justify-between mt-5">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500" />
                My Wishlist
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Saved items you’ll love to buy later
              </p>
            </div>
          </div>

          {/* Empty State */}
          {items?.length === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">
                Your wishlist feels empty
              </p>
            </div>
          )}

          {/* Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          >
            <AnimatePresence>
              {items?.map((item: any) => {
                const product = item.product;

                if (!product) return null;

                return (
                  <Link to={`/product/${product._id}`}>
                  <motion.div
                    key={product._id}
                    variants={card}
                    exit="exit"
                    whileHover={{
                      y: -6,
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">

                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      {/* Remove */}
                      <button
                        onClick={() =>
                          handleRemove(product._id)
                        }
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>

                      {/* Discount */}
                      <span className="absolute bottom-2 left-2 text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full">
                        {Math.round(product.discountPercentage)}% OFF
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-4 flex flex-col">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-1 mt-1">
                        <StarRating rating={product.rating} />
                        <span className="text-[11px] text-gray-400">
                          {product.rating}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{product.final_price_inr}
                        </span>
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{product.original_price_inr}
                        </span>
                      </div>

                      {/* CTA */}
                      <div className="mt-3 flex flex-col gap-2">
                       

                        <button
                          onClick={() =>
                            handleRemove(product._id)
                          }
                          className="text-[11px] text-gray-400 hover:text-rose-500 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                  </Link>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <img
            src="https://cdn-icons-gif.flaticon.com/11255/11255957.gif"
            alt="login"
            className="w-40"
          />
          <h1 className="text-gray-700 mt-4 text-xl font-semibold">
            Please{" "}
            <Link to="/login" className="text-blue-500 underline ms-1">
              Login
            </Link>
          </h1>
        </div>
      )}
    </div>
  );
};

export default WishList;