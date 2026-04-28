import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User, Search, Zap, Home, LogOut, Package, ChevronDown } from "lucide-react";
import Logo from "../../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, searchProducts } from "../../store/searchSlice";

function Header() {
  const [token, setToken] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { query } = useSelector((state: any) => state.search);

  useEffect(() => {
    const tok = sessionStorage.getItem("Token");
    setToken(tok);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("Token");
    setToken(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-black shadow-md">
      <div className="flex items-center justify-between px-4 md:px-10 py-3">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-10 md:h-11" />
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6 ml-50">
          <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md focus-within:shadow-md transition-all duration-300">
            <Search className="w-4 h-4 text-gray-400 mr-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  dispatch(searchProducts(query));
                  navigate("/products");
                }
              }}
              placeholder="Search for products, brands and more"
              className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-5 md:gap-7">
          <Link to="/" className="relative hidden sm:block group flex flex-col items-center transition">
            <Home size={24} className="w-6 h-6 group-hover:scale-110 transition text-white" />
            <span className="hidden md:block text-xs mt-1 text-white">Home</span>
          </Link>

          <Link to="/thrift" className="relative group flex flex-col items-center transition">
            <Zap size={24} className="w-6 h-6 group-hover:scale-110 transition text-yellow-400" />
            <span className="hidden md:block text-xs mt-1 text-white">Thrift</span>
          </Link>

          {/* WISHLIST */}
          <Link to="/wishlist" className="relative group flex flex-col items-center transition">
            <Heart className="w-6 h-6 group-hover:scale-110 transition text-white" />
            <span className="hidden md:block text-xs mt-1 text-white">Wishlist</span>
          </Link>

          {/* CART */}
          <Link to="/cart" className="relative group flex flex-col items-center transition">
            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition text-white" />
            <span className="hidden md:block text-xs mt-1 text-white">Cart</span>
          </Link>

          {/* USER / LOGIN */}
          {!token ? (
            <Link to="/login" className="group flex flex-col items-center transition">
              <button className="text-black font-semibold bg-white p-2 px-4 rounded-md hover:bg-gray-100 transition">
                Login
              </button>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex flex-col items-center text-white transition group focus:outline-none"
              >
                <div className="flex items-center gap-1">
                  <User className="w-6 h-6 group-hover:scale-110 transition" />
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
                <span className="hidden md:block text-xs mt-1">Account</span>
              </button>

              {/* DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                  {/* User greeting */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {sessionStorage.getItem("userEmail") || "My Account"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Package className="w-4 h-4 text-gray-500" />
                      My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="px-4 pb-3 md:hidden">
        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="search"
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                dispatch(searchProducts(query));
                navigate("/products");
              }
            }}
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;