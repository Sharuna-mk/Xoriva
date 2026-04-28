import { useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addToWishList, fetchWishlist } from "../../../store/wishlistSlice";
import { addToCart,fetchCart } from "../../../store/cartSlice";

interface ActionButtonsProps {
  selectedSize: string | null;
  productId: string;
}

export function ActionButtons({ selectedSize, productId }: ActionButtonsProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: wishlistItems } = useSelector((state: any) => state.wishlist);
  const cartItems = useSelector((state: any) => state.cart.items);
  console.log(cartItems);
  

  useEffect(() => {
    dispatch(fetchWishlist());
    dispatch(fetchCart());
  }, [dispatch]);


  const isInWishlist = (id: string) => {
    return wishlistItems?.some(
      (item) => item?.product?._id === id
    );
  };

 
  const isInCart = () => {
    if (!selectedSize) return false;

    return cartItems?.some(
      (item) =>
        (item.productId === productId &&
        item.size === selectedSize)
    );
  };


  const handleClick = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (isInCart()) {
      navigate("/cart");
    } else {
      dispatch(addToCart({ productId, size: selectedSize }));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
    
        <button
          onClick={handleClick}
          disabled={!selectedSize}
          className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition
            ${
              !selectedSize
                ? "bg-gray-300 cursor-not-allowed"
                : isInCart()
                ? "bg-black text-white"
                : "bg-black text-white hover:bg-neutral-800"
            }
          `}
        >
          <ShoppingCart className="size-5" />
          <span className="uppercase text-sm">
            {isInCart() ? "Go to Cart" : "Add to Cart"}
          </span>
        </button>

        <motion.button
          onClick={() => {
            dispatch(addToWishList({ id: productId }))
              .then(() => dispatch(fetchWishlist()));
          }}
          whileTap={{ scale: 0.9 }}
          className="p-4 border-2 border-gray-400"
        >
          <motion.div
            animate={{
              scale: isInWishlist(productId) ? [1, 1.3, 1] : 1,
            }}
          >
            <Heart
              className="w-5 h-5"
              fill={isInWishlist(productId) ? "#e11d48" : "none"}
              stroke={isInWishlist(productId) ? "#e11d48" : "#9ca3af"}
            />
          </motion.div>
        </motion.button>
      </div>


      <button
        onClick={() => {
          if (!selectedSize) {
            alert("Please select a size");
            return;
          }
          navigate("/cart");
        }}
        className="w-full bg-white text-black py-4 px-6 border-2 border-gray-400 hover:bg-black hover:text-white transition"
      >
        <span className="uppercase text-sm">Buy Now</span>
      </button>
    </div>
  );
}