import React, { useEffect, useState } from "react";

const Header = () => {
  const [backgroundImage, setBackgroundImage] = useState("/website/Group 432.png");
  const [logoImage, setLogoImage] = useState("/website/Picsart_25-04-16_19-30-26-995 1.png");
  const [storeName, setStoreName] = useState("ویترین");
  const [subSlogan, setSubSlogan] = useState(
    "خرید امن محصولات اینترنتی با کیفیت و بهترین قیمت در سریع‌ترین زمان ممکن"
  );

  return (
    <div className="relative w-full">
      {/* عکس بک‌گراند */}
      <img src={backgroundImage} alt="هدر سایت" className="w-full object-cover" />

      {/* محتوای روی عکس */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4  z-10">

        {/* لوگو + نام فروشگاه */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <img
            src={logoImage}
            alt="لوگو فروشگاه"
            className="w-12 h-12"
          />
          <h1 className="text-3xl font-bold text-gray-800 drop-shadow">
            فروشگاه اینترنتی <span className="text-black">{storeName}</span>
          </h1>
        </div>

        {/* شعار با دایره */}
        <div className="relative flex items-center justify-center gap-2">
          {/* دایره محو مشکی */}
          <div className="w-2 h-2 rounded-full bg-black blur-sm opacity-80"></div>
          <p className="text-lg text-gray-700 drop-shadow">{subSlogan}</p>
        </div>

        {/* دو خط ناهماهنگ زیر شعار */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="w-36 h-px bg-gray-500 opacity-70"></div>
          <div className="w-24 h-px bg-gray-400 opacity-60 translate-x-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
