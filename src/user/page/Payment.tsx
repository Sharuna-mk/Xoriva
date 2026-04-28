import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { baseURL } from "../../services/baseURL";
import { fetchCart ,clearCart} from "../../store/cartSlice";


import { loadStripe } from "@stripe/stripe-js";

type Method = "online" | "cod";

const shipping = 0;

function CardForm() {
  const [form, setForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fmt = (val: string, type: string) => {
    if (type === "number")
      return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (type === "expiry") {
      const d = val.replace(/\D/g, "").slice(0, 4);
      return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    }
    if (type === "cvv") return val.replace(/\D/g, "").slice(0, 3);
    return val;
  };

  const set = (key: string, raw: string) => {
    setForm((f) => ({ ...f, [key]: fmt(raw, key) }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const inputClass = (key: string) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl bg-stone-50 text-gray-800 placeholder-gray-400
    focus:outline-none focus:ring-2 transition
    ${
      errors[key]
        ? "border-red-400 focus:ring-red-100"
        : "border-stone-200 focus:ring-gray-200 focus:border-gray-400"
    }`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
      <input
        value={form.number}
        onChange={(e) => set("number", e.target.value)}
        placeholder="Card number"
        className={inputClass("number")}
      />
      <input
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder="Name on card"
        className={inputClass("name")}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={form.expiry}
          onChange={(e) => set("expiry", e.target.value)}
          placeholder="MM/YY"
          className={inputClass("expiry")}
        />
        <input
          value={form.cvv}
          onChange={(e) => set("cvv", e.target.value)}
          placeholder="CVV"
          type="password"
          className={inputClass("cvv")}
        />
      </div>
      <p className="text-xs text-gray-400 flex items-center gap-1">
        🔒 Your card details are encrypted
      </p>
    </motion.div>
  );
}

const Payment = () => {
  const [method, setMethod] = useState<Method>("online");
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const location = useLocation();
  const selectedAddressId = location.state?.addressId;

  const dispatch = useDispatch();
  const { total } = useSelector((state: any) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const codCharge = method === "cod" ? 10 : 0;
  const subtotal = total;
  const totalAmount = subtotal + shipping + codCharge;

  const handleStripePayment = async () => {
    if (!selectedAddressId) {
      setErrorMsg("Please select a delivery address");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const key = 'pk_test_51SprxqLkpHaMMlZoEgLQXNbTMxG9HWqDcVA7jMmt1spaLewbxQ6ogT6PgzlHSPkEttFSzQJImqbrKwjalF7Opvwu00nwexmxgj'
      if (!key) {
        setErrorMsg(
          "Stripe publishable key is missing. Add VITE_STRIPE_PUBLISHABLE_KEY to your .env file."
        );
        setLoading(false);
        return;
      }

      const stripe = await loadStripe(key);

      if (!stripe) {
        setErrorMsg("Stripe failed to load. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const token = sessionStorage.getItem("Token");

      const res = await axios.post(
        `${baseURL}/api/order/create`,
        { addressId: selectedAddressId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { clientSecret, orderId } = res.data;

      if (!clientSecret || !orderId) {
        setErrorMsg("Failed to initialize payment. Please try again.");
        return;
      }

    
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: "pm_card_visa", 
      });

      if (error) {
        setErrorMsg(error.message ?? "Payment failed");

      
        await axios.post(
          `${baseURL}/api/order/fail`,
          { orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return;
      }

      if (paymentIntent?.status === "succeeded") {
      
        await axios.post(
          `${baseURL}/api/order/confirm`,
          { orderId, paymentIntentId: paymentIntent.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPlaced(true);
        dispatch(clearCart())
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setErrorMsg(
        err?.response?.data?.message ?? err?.message ?? "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleCOD = async () => {
    if (!selectedAddressId) {
      setErrorMsg("Please select a delivery address");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const token = sessionStorage.getItem("Token");
      await axios.post(
        `${baseURL}/api/order/create`,
        { addressId: selectedAddressId, paymentMethod: "cod" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPlaced(true);
    } catch (err: any) {
      console.error("COD error:", err);
      setErrorMsg(err?.response?.data?.message ?? "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    setErrorMsg(null);
    if (method === "online") {
      handleStripePayment();
    } else {
      handleCOD();
    }
  };

  if (placed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-stone-100 flex flex-col items-center justify-center px-6 font-sans"
      >
        <div className="bg-white border border-stone-200 rounded-3xl p-10 text-center max-w-sm w-full shadow-sm">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="text-6xl mb-5"
          >
            🎉
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-sm text-gray-400 mb-6">
            Your order has been placed successfully. You'll receive a confirmation shortly.
          </p>
          <div className="bg-stone-50 rounded-xl p-4 text-sm text-left space-y-2 mb-6">
            <div className="flex justify-between text-gray-500">
              <span>Payment</span>
              <span className="font-medium text-gray-800">
                {method === "cod" ? "Cash on Delivery" : "Online Payment"}
              </span>
            </div>
          </div>
          <Link to={'/'}>
          <button
            onClick={() => setPlaced(false)}
            className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Continue Shopping
          </button>
          </Link>
        </div>
      </motion.div>
    );
  }


  return (
    <div className="min-h-screen bg-stone-100 px-4 pt-6 pb-32 sm:px-6 font-sans">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">Payment</h2>
        <p className="text-sm text-gray-400 mb-6">Choose how you'd like to pay</p>
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2"
            >
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
       
          <div
            onClick={() => setMethod("online")}
            className={`bg-white border rounded-2xl p-4 cursor-pointer transition shadow-sm
              ${method === "online" ? "border-gray-900 ring-1 ring-gray-900" : "border-stone-200 hover:border-stone-300"}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={method === "online"}
                onChange={() => setMethod("online")}
                onClick={(e) => e.stopPropagation()}
                className="accent-gray-900 scale-110 shrink-0"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">Online Payment</p>
                <p className="text-xs text-gray-400">Card · UPI · Net Banking</p>
              </div>
              <div className="ml-auto flex gap-1 text-lg">💳🏦📲</div>
            </div>

            <AnimatePresence>
              {method === "online" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cash on Delivery */}
          <div
            onClick={() => setMethod("cod")}
            className={`bg-white border rounded-2xl p-4 cursor-pointer transition shadow-sm
              ${method === "cod" ? "border-gray-900 ring-1 ring-gray-900" : "border-stone-200 hover:border-stone-300"}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
                onClick={(e) => e.stopPropagation()}
                className="accent-gray-900 scale-110 shrink-0"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">Cash on Delivery</p>
                <p className="text-xs text-gray-400">Extra ₹10 handling charge</p>
              </div>
              <span className="ml-auto text-xl">💵</span>
            </div>

            <AnimatePresence>
              {method === "cod" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 text-xs text-amber-700 flex items-start gap-2">
                    <span className="text-base">⚠️</span>
                    Please keep exact change ready. COD orders may take 1–2 extra days.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price Details */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3 mt-1">
            <h3 className="font-semibold text-sm text-gray-900">Price Details</h3>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </span>
            </div>
            <AnimatePresence>
              {method === "cod" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-sm text-gray-500 overflow-hidden"
                >
                  <span>COD Charges</span>
                  <span>₹10</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="border-t border-stone-100 pt-3 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <motion.span key={totalAmount} initial={{ scale: 1.1 }} animate={{ scale: 1 }}>
                ₹{totalAmount}
              </motion.span>
            </div>
          </div>
        </div>
      </div>

  
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-3 flex justify-between items-center shadow-lg">
        <div>
          <p className="text-xs text-gray-400">Total payable</p>
          <motion.p
            key={totalAmount}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-lg font-semibold text-gray-900"
          >
            ₹{totalAmount}
          </motion.p>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="bg-gray-900 text-white text-sm font-medium px-7 py-3 rounded-xl hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Processing…
            </>
          ) : method === "online" ? (
            "Pay with Card →"
          ) : (
            "Place Order →"
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;