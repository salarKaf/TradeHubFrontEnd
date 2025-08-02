import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSlugNavigation } from '../../website/pages/Slug/useSlugNavigation';
import { getMyCartItem } from '../../../API/cart';
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const navLinks = [
    { label: "صفحه نخست", path: "home" },
    { label: "درباره ما", path: "about" },
    { label: "فروشگاه", path: "shop" },
    { label: "قوانین و مقررات", path: "rules" },
  ];

  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { getPageUrl } = useSlugNavigation();

  useEffect(() => {
    const websiteId = localStorage.getItem('current_store_website_id');
    const token = websiteId ? localStorage.getItem(`buyer_token_${websiteId}`) : null;
    setIsLoggedIn(!!token);
    if (token) fetchCartCount();

    const handleCartUpdate = () => {
      if (token) fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const fetchCartCount = async () => {
    try {
      const cart = await getMyCartItem();
      const count = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
      setCartCount(count);
    } catch (error) {
      console.error("خطا در دریافت سبد خرید:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 z-50 bg-gradient-to-l from-white to-gray-100 shadow-md rounded-b-3xl flex items-center justify-between px-6">
      {/* منو موبایل - دکمه همبرگر */}
      <div className="lg:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* منوی لینک‌ها - دسکتاپ */}
      <div className="hidden lg:flex gap-8 text-gray-700 text-base font-medium">
        {navLinks.map(({ label, path }) => (
          <NavLink
            key={path}
            to={getPageUrl(path)}
            className={({ isActive }) =>
              `relative transition-all duration-300 group py-1 ${isActive ? "text-black font-semibold" : "text-gray-700"}`
            }
          >
            {({ isActive }) => (
              <>
                {label}
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black origin-center transition-all duration-300 ease-in-out scale-x-0 group-hover:scale-x-100" />
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-black ${isActive ? "scale-x-100" : "scale-x-0"}`} />
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* سرچ‌بار - فقط دسکتاپ */}
      <div className="hidden lg:flex justify-center px-4 w-80">
        <SearchBar />
      </div>

      {/* آیکون‌ها */}
      <div className="flex items-center gap-6">
        <NavLink to={getPageUrl("signup")} className="w-8 h-8 hover:bg-gray-200 rounded-full flex items-center justify-center">
          <img src="/website/icons8-user-24 1.png" alt="اکانت" className="w-6 h-6" />
        </NavLink>
        <NavLink to={getPageUrl("cart")} className="w-8 h-8 hover:bg-gray-200 rounded-full flex items-center justify-center relative">
          <img src="/website/icons8-shopping-cart-64 1.png" alt="سبد خرید" className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {isLoggedIn ? cartCount : 0}
          </span>
        </NavLink>
      </div>

      {/* منو موبایل - نمایش لینک‌ها */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg flex flex-col items-start px-6 py-4 gap-4 lg:hidden z-50">
          {navLinks.map(({ label, path }) => (
            <NavLink
              key={path}
              to={getPageUrl(path)}
              className="text-gray-700 text-sm font-medium hover:text-black"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className="mt-4 w-full">
            <SearchBar />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
