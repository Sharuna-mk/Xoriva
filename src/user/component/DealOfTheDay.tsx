import React, { useState, useEffect } from "react";
import { Clock, Zap, ShoppingCart } from "lucide-react";
import banner from "../../assets/saleBanner.jpeg";

const DealOfTheDay: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0)
          return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 md:px-10 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 shadow-lg">

        {/* Background Image */}
        <img
          src={banner}
          alt="Deal Banner"
          className="w-full h-[220px] sm:h-[280px] md:h-[400px] object-cover opacity-90"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-12">

          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-yellow-300" />
            <span className="text-xs sm:text-sm tracking-widest text-yellow-200 uppercase">
              Flash Sale
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight">
            Deal of the Day
          </h2>

          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Limited time premium offers — grab before it ends
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-5">

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full w-fit">
              <Clock className="w-4 h-4 text-white" />
              <span className="font-mono font-semibold text-white text-sm sm:text-base">
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>

         
            <button className="flex items-center justify-center gap-2 bg-white text-black text-xs sm:text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-200 active:scale-95 transition w-fit">
              <ShoppingCart className="w-4 h-4" />
              Shop Now
            </button>
          </div>
        </div>

        
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-400/30 blur-3xl rounded-full" />
      </div>
    </div>
  );
};

export default DealOfTheDay;