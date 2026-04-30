import { useEffect, useState, useRef } from "react";
import { Heart, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addToWishList, fetchWishlist } from "../../../store/wishlistSlice";
import { addToCart, fetchCart } from "../../../store/cartSlice";

interface ActionButtonsProps {
  selectedSize: string | null;
  productId: string;
}

type ToastType = "error" | "info" | "success";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;

export function ActionButtons({ selectedSize, productId }: ActionButtonsProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const token = sessionStorage.getItem("Token");
  const { items: wishlistItems } = useSelector((state: any) => state.wishlist);
  const cartItems = useSelector((state: any) => state.cart.items);

  useEffect(() => {
    dispatch(fetchWishlist());
    dispatch(fetchCart());
  }, [dispatch]);

  const showToast = (message: string, type: ToastType = "error") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isInWishlist = (id: string) =>
    wishlistItems?.some((item: any) => item?.product?._id === id);

  const isInCart = () => {
    if (!selectedSize) return false;
    return cartItems?.some(
      (item: any) => item.productId === productId && item.size === selectedSize
    );
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast("Please select a size", "error");
      return;
    }
    if (!token) {
      showToast("Please login to continue", "error");
      return;
    }
    if (isInCart()) {
      navigate("/cart");
    } else {
      dispatch(addToCart({ productId, size: selectedSize }));
    }
  };

  const handleWishlist = () => {
    if (!token) {
      showToast("Please login to save to wishlist", "error");
      return;
    }
    dispatch(addToWishList({ id: productId })).then(() =>
      dispatch(fetchWishlist())
    );
  };

  const handleBuyNow = () => {
    if (!token) {
      showToast("Please login to continue", "error");
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size", "error");
      return;
    }
    navigate("/cart");
  };

  const toastColors: Record<ToastType, string> = {
    error: "bg-red-600",
    info: "bg-blue-600",
    success: "bg-green-600",
  };

  return (
    <>
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 text-white text-sm shadow-lg min-w-[220px] ${toastColors[toast.type]}`}
            >
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          {/* Add to Cart */}
          <Tooltip show={!token} message="Login to add to cart">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`flex-1 py-4 px-20 flex items-center justify-center gap-2 transition
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
          </Tooltip>

          {/* Wishlist */}
          <Tooltip show={!token} message="Login to save">
            <motion.button
              onClick={handleWishlist}
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
          </Tooltip>
        </div>

        {/* Buy Now */}
        <Tooltip show={!token} message="Login to buy">
          <button
            onClick={handleBuyNow}
            className="w-full bg-white text-black py-4 px-6 border-2 border-gray-400 hover:bg-black hover:text-white transition"
          >
            <span className="uppercase text-sm">Buy Now</span>
          </button>
        </Tooltip>
      </div>
    </>
  );
}


function Tooltip({
  show,
  message,
  children,
}: {
  show: boolean;
  message: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  if (!show) return <>{children}</>;

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onTouchStart={() => setVisible(true)}
      onTouchEnd={() => setTimeout(() => setVisible(false), 1500)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1.5 whitespace-nowrap z-50 pointer-events-none"
          >
            {message}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}