import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full px-6 py-3 shadow-md rounded-b-2xl bg-white flex items-center justify-between">
      {/* سمت راست - لینک‌ها */}
      <div className="flex gap-6 text-gray-700 text-sm font-medium">
        <a href="#">صفحه نخست</a>
        <a href="#">درباره ما</a>
        <a href="#">فروشگاه</a>
        <a href="#">قوانین و مقررات</a>
      </div>

      {/* وسط - سرچ‌بار */}
      <div className="flex items-center bg-gray-100 px-4 py-1 rounded-full w-96">
        <input
          type="text"
          placeholder="نام کالا یا محصول مورد نظر خود را جست‌وجو کنید..."
          className="bg-transparent w-full text-right outline-none text-sm"
        />
        <div className="ml-2">
          {/* جای آیکن سرچ */}
          <span className="w-5 h-5 bg-gray-300 rounded"></span>
        </div>
      </div>

      {/* سمت چپ - آیکون‌ها */}
      <div className="flex items-center gap-4">
        {/* آیکون‌ها بعدا با props یا import میاد */}
        <span className="w-6 h-6 bg-gray-300 rounded"></span> {/* Hamburger */}
        <span className="w-6 h-6 bg-gray-300 rounded"></span> {/* Profile */}
        <span className="w-6 h-6 bg-gray-300 rounded"></span> {/* Cart */}
      </div>
    </nav>
  );
};

export default Navbar;
