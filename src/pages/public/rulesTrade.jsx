import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function RulesTrade() {
  const [selectedOption, setSelectedOption] = useState(null);
  const fileInputRef = useRef(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

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
          <h2 className="mb-8 text-white">نوع فروشنده را انتخاب کنید</h2>

          <div className="flex justify-center gap-8 mb-8">
            <button
              onClick={() => handleSelect("personal")}
              className={`bg-[#FFF6DD] text-black rounded-xl px-6 py-4 shadow-md hover:bg-[#F0E0B3] transition transform ${
                selectedOption === "personal"
                  ? "scale-110 border-2 border-[#EABF9F] bg-[#EABF9F]"
                  : ""
              }`}
            >
              فروشگاه متعلق به یک شخص است
            </button>
            <button
              onClick={() => handleSelect("company")}
              className={`bg-[#FFF6DD] text-black rounded-xl px-6 py-4 shadow-md hover:bg-[#F0E0B3] transition transform ${
                selectedOption === "company"
                  ? "scale-110 border-2 border-[#EABF9F] bg-[#EABF9F]"
                  : ""
              }`}
            >
              فروشگاه متعلق به یک شرکت یا گروه است
            </button>
          </div>

          <div className="flex justify-between pt-6">
            <Link
              to="/"
              className="bg-[#EABF9F] text-[#1E1E1E] px-6 py-2 rounded-full font-bold hover:bg-[#e7b78e] transition"
            >
              بعدی
            </Link>
            <Link
              to="/storeForm"
              className="bg-[#EABF9F] text-[#1E1E1E] px-6 py-2 rounded-full font-bold hover:bg-[#e7b78e] transition"
            >
              قبلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
