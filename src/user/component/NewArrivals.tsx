import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { newArrivalData } from '../../services/allAPI'
import { useDispatch, useSelector } from "react-redux";
import { addToWishList, fetchWishlist } from '../../store/wishlistSlice'
import { Link } from "react-router-dom";

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
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const NewArrivals: React.FC = () => {

  const [products, setProducts] = useState([])
  const dispatch = useDispatch()
  const { items } = useSelector((state: any) => state.wishlist);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const token = sessionStorage.getItem("Token");

  const getProduct = async () => {
    try {
      const res: any = await newArrivalData()
      console.log(res);
      const data = res.productList
      if (data) {
        setProducts(data)
      }


    } catch (error) {
      console.log(error);

    }
  }


  useEffect(() => {
    dispatch(fetchWishlist());
    getProduct()
  }, [])

  return (
    <div className="px-4 md:px-10 py-12 bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {toast && (
          <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white text-sm px-4 py-3 rounded shadow-lg">
            {toast}
          </div>
        )}
        <div>
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
            New Arrivals
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Curated modern essentials for you
          </p>
        </div>
        <Link to={'/products'}>
          <button className="hidden md:block text-sm font-medium text-black border border-gray-200 px-4 py-2 rounded-full hover:bg-black hover:text-white transition">
            See all →
          </button>
        </Link>
      </div>


      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      >
        {products.map((product) => {
          const isInWishlist = (productId) => {
            return items?.some(
              (item) => item?.product?._id === productId
            );
          };

          return (

            <motion.div
              variants={card}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Section */}

              <div className="relative overflow-hidden aspect-[3/4]">
                <Link to={`/product/${product._id}`} key={product._id}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />


                  {/* Glass overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/10 backdrop-blur-[1px]" />

                  {/* NEW badge */}

                  <span className="absolute top-2 left-2 text-[10px] bg-black text-white px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                </Link>

                {/* Wishlist */}

                <button
                  onClick={() => {
                    if (!token) {
                      showToast("Please login to add to wishlist");
                      return;
                    }
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

                {/* Quick Add (desktop only) */}
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition hidden md:block">
                  <button
                    onClick={() => {
                      if (!token) {
                        showToast("Please login to add to wishlist");
                        return;
                      }
                      dispatch(addToWishList({ id: product._id }))
                        .then(() => dispatch(fetchWishlist()));
                    }}
                    className="w-full bg-white text-black text-xs font-semibold py-2 rounded-full flex items-center justify-center gap-1 hover:bg-white active:scale-95 transition">
                    <Heart className="w-3.5 h-3.5 text-red-500" />
                    add to wishlist
                  </button>
                </div>
              </div>

              <Link to={`/product/${product._id}`} key={product._id}>
                <div className="p-3 md:p-4 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={product.rating} />
                    <span className="text-[11px] text-gray-400">{product.rating}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{product.final_price_inr}
                    </span>

                    <span className="text-[11px] text-gray-400 line-through">
                      ₹{product.original_price_inr}
                    </span>

                    <span className="text-[10px] bg-green-50 text-green-700 md:px-2 md:py-0.5 rounded-full ">
                      {Math.round(product.discountPercentage)}% OFF
                    </span>
                  </div>


                </div>
              </Link>
            </motion.div>

          );
        })}

        <div className="flex items-center justify-center">
          <Link to={'/products'}>
            <button className="block md:hidden text-sm font-medium text-white bg-black border border-gray-400 shadow-md h-18 w-18 p-1 rounded-full hover:bg-black hover:text-white transition">
              See all →
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NewArrivals;