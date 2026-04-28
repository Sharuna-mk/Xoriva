import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, clearCart, addToCart, decreaseCart, removeFromCart } from '../../store/cartSlice';

const PROMOS: Record<string, { label: string; pct: number }> = {
  SAVE10: { label: "SAVE10", pct: 0.1 },
  WINTER20: { label: "WINTER20", pct: 0.2 },
};

const SHIPPING = 20;

export default function Checkout() {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ label: string; pct: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const dispatch = useDispatch();
  const { items, total, error } = useSelector((state: any) => state.cart);

  useEffect(() => {
    dispatch(fetchCart() as any);
  }, []);

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const showToast = (msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };


  const changeQty = (productId: string, size: string, delta: number) => {
    if (delta > 0) {
      dispatch(addToCart({ productId, size }) as any);
    } else {
      dispatch(decreaseCart({ productId, size }) as any);
    }
  };


  const removeItem = (productId: string, size: string) => {
    dispatch(removeFromCart({ productId, size }) as any);
    showToast("Item removed from bag");
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMOS[code]) {
      setAppliedPromo(PROMOS[code]);
      setPromoError("");
      showToast(`${Math.round(PROMOS[code].pct * 100)}% discount applied!`);
    } else {
      setAppliedPromo(null);
      setPromoError("Invalid promo code");
    }
  };

  const subtotal = total ?? 0;
  const hasItems = items?.length > 0;
  const totalItems = items?.length ?? 0;
  const shipping = hasItems ? SHIPPING : 0;
  const discount = appliedPromo && hasItems ? subtotal * appliedPromo.pct : 0;
  const totalAmount = subtotal + shipping - discount;

  if (!items) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 px-5 py-10 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Shopping Bag</h1>
          {hasItems && (
            <p className="text-sm text-gray-400 mt-1">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your bag
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7 items-start">

          {/* LEFT: Cart Items */}
          <div>
            {hasItems && (
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => {
                    dispatch(clearCart() as any);
                    showToast("Bag cleared");
                  }}
                  className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            <AnimatePresence>
              {items?.map((item: any) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-stone-200 rounded-2xl p-5 mb-3 flex gap-4 shadow-sm"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-[88px] h-[104px] bg-stone-100 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          <span className="text-[11px] bg-stone-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                            Size {item.size}
                          </span>
                          <span className="text-[11px] bg-stone-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                            {item.color}
                          </span>
                        </div>
                      </div>
                   
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-xs text-gray-300 hover:text-red-400 transition-colors shrink-0 px-1"
                      >
                        ✕
                      </button>
                    </div>

                    {item.stock - item.quantity <= 2 && item.quantity < item.stock && (
                      <p className="text-xs text-orange-500">
                        Only {item.stock - item.quantity} left!
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-auto pt-1">
                      <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                       
                        <button
                          onClick={() => changeQty(item.productId, item.size, -1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 hover:bg-stone-50 disabled:text-gray-300 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-medium text-gray-800">
                          {item.quantity}
                        </span>
                       
                        <button
                          onClick={() => changeQty(item.productId, item.size, 1)}
                          disabled={item.quantity === item.stock}
                          className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 hover:bg-stone-50 disabled:text-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-base font-semibold text-gray-900">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!hasItems && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white border border-stone-200 rounded-2xl shadow-sm"
              >
                <div className="text-5xl mb-4">🛍️</div>
                <p className="text-base font-semibold text-gray-800 mb-1">Your bag is empty</p>
                <p className="text-sm text-gray-400">Add some items to get started</p>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="sticky top-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xl font-semibold text-gray-900 mb-5 tracking-tight">
                Order Summary
              </p>

              <div className="flex gap-2 mb-1.5">
                <input
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                  placeholder="Promo code"
                  className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-xl bg-stone-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                />
                <button
                  onClick={applyPromo}
                  className="px-4 py-2 text-sm font-medium border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-gray-700"
                >
                  Apply
                </button>
              </div>

              {promoError && <p className="text-xs text-red-500 mb-3">{promoError}</p>}
              {appliedPromo && (
                <p className="text-xs text-emerald-600 mb-3">
                  ✓ {Math.round(appliedPromo.pct * 100)}% discount applied
                </p>
              )}

              <div className="mt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>{hasItems ? `₹${shipping.toFixed(2)}` : "Free"}</span>
                </div>

                <AnimatePresence>
                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-sm overflow-hidden"
                    >
                      <span className="text-gray-500 flex items-center gap-1.5">
                        Discount
                        <span className="text-[11px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                          {appliedPromo?.label}
                        </span>
                      </span>
                      <span className="text-red-600">-₹{discount.toFixed(2)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-stone-200 mt-4 pt-4 flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <motion.span key={totalAmount} initial={{ scale: 1.08 }} animate={{ scale: 1 }}>
                  ₹{totalAmount.toFixed(2)}
                </motion.span>
              </div>

              <motion.button
                whileTap={hasItems ? { scale: 0.97 } : {}}
                onClick={() => {
                  if (!hasItems) return;
                  setCheckoutDone(true);
                  showToast("Redirecting to payment 🎉");
                }}
                disabled={!hasItems}
                className={`w-full mt-5 py-3.5 rounded-xl text-sm font-medium tracking-wide transition-colors
                  ${hasItems
                    ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <Link to={'/address'}>
                  Checkout Now
                </Link>
              </motion.button>

              <p className="text-center text-xs text-gray-300 mt-3">
                🔒 Secure &amp; encrypted checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}