import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function CreateStore() {
  const [storeName, setStoreName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [storeLogo, setStoreLogo] = useState(null);
  const fileInputRef = useRef(null);

  const logoPreview = storeLogo ? URL.createObjectURL(storeLogo) : null;

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[linear-gradient(to_bottom,_#1E212D_0%,_#1E212D_35%,_#626C93_100%)] font-rubik">

      {/* حباب‌های تزئینی */}
      <div className="absolute w-64 h-64 bg-[#ddb19cb2] opacity-20 rounded-full blur-xl top-4 right-20 animate-bubble4" />
      <div className="absolute w-80 h-80 bg-[#eac09fb2] opacity-20 rounded-full blur-xl top-4 left-36 animate-bubble1" />
      <div className="absolute w-60 h-60 bg-[#525A7B] opacity-100 rounded-full blur-3xl bottom-20 right-20 animate-bubble2" />
      <div className="absolute w-52 h-52 bg-[#b6897353] opacity-35 rounded-full blur-2xl top-1/2 left-20 animate-bubble3" />
      <div className="absolute w-48 h-48 bg-[#faf3e061] opacity-15 rounded-full blur-3xl bottom-10 left-1/3 animate-bubble4" />

      {/* فرم‌ها به سبک ورق برعکس */}
      <div className="relative w-full max-w-3xl">
        {/* فرم پشت سوم (بالا-راست) */}
        <div className="absolute -top-6 -right-6 w-full h-full rounded-3xl bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-xl z-0" />

        {/* فرم وسطی دوم (وسط) */}
        <div className="absolute -top-3 -right-3 w-full h-full rounded-3xl bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-xl z-10" />

        {/* فرم اصلی جلویی (پایین-چپ) */}
        <div className="relative z-20 bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-2xl rounded-3xl p-10 space-y-6 text-right text-[#EABF9F]">
          <div className="flex items-center justify-between">
            <label className="ml-4 text-white font-bold text-base">نام فروشگاه خود را وارد کنید</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="----------------------"
              className="text-black w-80 px-4 py-3 rounded-xl border border-[#EABF9F] placeholder:text-black placeholder:opacity-50 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#EABF9F]"
            />
          </div>

          <div className="text-white font-bold text-base flex items-center justify-between">
            <label className="ml-4">کد ملی خود را وارد کنید</label>
            <input
              type="text"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
              placeholder="----------------------"
              className="text-black w-80 px-4 py-3 rounded-xl border border-[#EABF9F] placeholder:text-black placeholder:opacity-50 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#EABF9F]"
            />
          </div>

          <div className="flex items-center justify-between relative">
            <label className="text-white font-bold text-base ml-4 flex items-center">
              لوگوی فروشگاه خود را وارد کنید
              <span className="text-[#EABF9F] text-base mr-1">(اختیاری)</span>
            </label>

            <div className="relative w-80">
              {/* input فایل مخفی */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setStoreLogo(e.target.files[0])}
                className="hidden"
              />

              {/* ورودی متنی که نام فایل انتخاب شده رو نشون میده */}
              <input
                readOnly
                value={storeLogo ? storeLogo.name : ""}
                placeholder="----------------------"
                className="text-black w-full px-4 py-3 rounded-xl border border-[#EABF9F] placeholder:text-black placeholder:opacity-50 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#EABF9F]"
              />

              {/* آیکون کلیک‌پذیر برای باز کردن انتخاب فایل */}
              <img
                src="/TradePageimages/icons8-upload-64.png"  // مسیر آیکون خودت رو اینجا بذار
                alt="upload icon"
                onClick={handleIconClick}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-7 cursor-pointer"
                title="انتخاب فایل"
              />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Link
              to="/choose-seller-types"
              className="bg-[#EABF9F] text-[#1E1E1E] px-6 py-2 rounded-full font-bold hover:bg-[#e7b78e] transition">
              بعدی
            </Link>
            <Link
              to="/"
              className="bg-[#EABF9F] text-[#1E1E1E] px-6 py-2 rounded-full font-bold hover:bg-[#e7b78e] transition">
              قبلی
            </Link
            >
          </div>
        </div>
      </div>
    </div>
  );
}
