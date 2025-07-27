import React from "react";
import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useSlugNavigation } from '../../website/pages/useSlugNavigation';
import { useState, useEffect } from "react"
import { getMyCart } from '../../../API/cart'
const Navbar = () => {
  const navLinks = [
    { label: "صفحه نخست", path: "home" },
    { label: "درباره ما", path: "about" },
    { label: "فروشگاه", path: "shop" },
    { label: "قوانین و مقررات", path: "rules" },
  ];

  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 🔴 تغییر ۴: بررسی لاگین فقط برای فروشگاه فعلی
    const websiteId = localStorage.getItem('current_store_website_id');
    const token = websiteId ? localStorage.getItem(`buyer_token_${websiteId}`) : null;
    setIsLoggedIn(!!token);

    if (token) fetchCartCount();
  }, []);


  const fetchCartCount = async () => {
    try {
      const cart = await getMyCart();
      const count = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
      setCartCount(count);
    } catch (error) {
      console.error("خطا در دریافت سبد خرید:", error);
    }
  };

  const { getPageUrl } = useSlugNavigation();

  return (
    <nav className="fixed top-0 left-0 w-full h-20 z-50 bg-gradient-to-l from-white to-gray-100 shadow-md rounded-b-3xl flex items-center justify-between px-6">
      {/* سمت راست - لینک‌ها */}
      <div className="flex gap-8 text-gray-700 text-base font-medium">
        {navLinks.map(({ label, path }) => (
          <NavLink
            key={path}
            to={getPageUrl(path)} // ✅ از getPageUrl استفاده کن
            className={({ isActive }) =>
              `relative transition-all duration-300 group py-1 ${isActive ? "text-black font-semibold" : "text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {label}
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black origin-center transition-all duration-300 ease-in-out scale-x-0 group-hover:scale-x-100" />
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-black origin-center transition-all duration-300 ease-in-out ${isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* وسط - سرچ‌بار */}
      <div className="flex justify-center px-4 w-80">
        <SearchBar />
      </div>

      {/* سمت چپ - آیکون‌ها */}
      <div className="flex items-center gap-6">
        <NavLink
          to={getPageUrl("signup")} // ✅ اگه لاگین نبود ببرش signup
          className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-full transition-colors duration-300"
        >
          <img
            src="/website/icons8-user-24 1.png"
            alt={isLoggedIn ? "حساب کاربری" : "ثبت نام"}
            className="w-6 h-6 object-contain"
          />
        </NavLink>

        <NavLink
          to={getPageUrl("cart")} // ✅ از getPageUrl استفاده کن
          className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-full transition-colors duration-300 relative"
        >
          <img
            src="/website/icons8-shopping-cart-64 1.png"
            alt="سبد خرید"
            className="w-6 h-6 object-contain"
          />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {isLoggedIn ? cartCount : 0}
          </span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;