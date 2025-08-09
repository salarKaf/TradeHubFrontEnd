import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createWebsite, uploadLogo } from "/src/API/website";

export default function CreateStore() {
  const [storeName, setStoreName] = useState("");
  const [storeLogo, setStoreLogo] = useState(null);
  const [nameError, setNameError] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [unauthorized, setUnauthorized] = useState(false);
  const [isCreating, setIsCreating] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUnauthorized(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, []);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleCreateStore = async () => {
    if (!storeName.trim()) {
      setNameError(true);
      return;
    }

    setIsCreating(true); 

    try {
      const result = await createWebsite(storeName);
      console.log("📦 نتیجه‌ی برگشتی از createWebsite:", result);

      const websiteId = result.website_id; 

      if (!websiteId) {
        alert("❌ خطا: ساخت فروشگاه موفق نبود. شناسه برگشت داده نشد.");
        return;
      }

      localStorage.setItem("website_id", websiteId);

      if (storeLogo) {
        await uploadLogo(websiteId, storeLogo);
      }

      alert("✅ فروشگاه با موفقیت ساخته شد!");
      navigate(`/Slug/${websiteId}`);
    } catch (err) {
      console.error("❌ خطا در ساخت فروشگاه:", err);
      alert("خطایی رخ داد، لطفاً مجدد تلاش کنید.");
    } finally {
      setIsCreating(false); 
    }
  };



  if (unauthorized) {
    return (
      <div className="min-h-screen bg-[#1E212D] flex items-center justify-center text-center p-6">
        <div className="bg-[#2c2f45] text-[#EABF9F] border border-[#EABF9F] rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">⛔ دسترسی غیرمجاز</h2>
          <p className="text-lg font-rubik">برای دسترسی به این بخش ابتدا وارد شوید</p>
          <p className="text-sm text-gray-400 mt-2">درحال انتقال به صفحه ورود...</p>
        </div>
      </div>
    );
  } 

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[linear-gradient(to_bottom,_#1E212D_0%,_#1E212D_35%,_#626C93_100%)] font-rubik">
      <div className="absolute w-64 h-64 bg-[#ddb19cb2] opacity-20 rounded-full blur-xl top-4 right-20 animate-bubble4" />
      <div className="absolute w-80 h-80 bg-[#eac09fb2] opacity-20 rounded-full blur-xl top-4 left-36 animate-bubble1" />
      <div className="absolute w-60 h-60 bg-[#525A7B] opacity-100 rounded-full blur-3xl bottom-20 right-20 animate-bubble2" />
      <div className="absolute w-52 h-52 bg-[#b6897353] opacity-35 rounded-full blur-2xl top-1/2 left-20 animate-bubble3" />
      <div className="absolute w-48 h-48 bg-[#faf3e061] opacity-15 rounded-full blur-3xl bottom-10 left-1/3 animate-bubble4" />

      <div className="relative w-full max-w-3xl">
        <div className="absolute -top-6 -right-6 w-full h-full rounded-3xl bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-xl z-0" />
        <div className="absolute -top-3 -right-3 w-full h-full rounded-3xl bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-xl z-10" />

        <div className="relative z-20 bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-2xl rounded-3xl p-10 space-y-6 text-right text-[#EABF9F]">
          <div className="flex flex-col items-end w-full">
            <div className="flex items-center justify-between w-full">
              <label className="ml-4 text-white font-bold text-base">
                نام فروشگاه خود را وارد کنید
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => {
                  setStoreName(e.target.value);
                  setNameError(false);
                }}
                placeholder="----------------------"
                className={`text-black w-80 px-4 py-3 rounded-xl border ${nameError ? "border-red-500" : "border-[#EABF9F]"
                  } placeholder:text-black placeholder:opacity-50 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#EABF9F]`}
              />
            </div>
            {nameError && (
              <span className="text-red-400 text-sm mt-2 self-center">
                لطفاً نام فروشگاه را وارد کنید
              </span>
            )}
          </div>

          <div className="flex items-center justify-between relative">
            <label className="text-white font-bold text-base ml-4 flex items-center">
              لوگوی فروشگاه خود را وارد کنید
              <span className="text-[#EABF9F] text-base mr-1">(اختیاری)</span>
            </label>

            <div className="relative w-80">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setStoreLogo(e.target.files[0])}
                className="hidden"
              />
              <input
                readOnly
                value={storeLogo ? storeLogo.name : ""}
                placeholder="----------------------"
                className="text-black w-full px-4 py-3 rounded-xl border border-[#EABF9F] placeholder:text-black placeholder:opacity-50 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#EABF9F]"
              />
              <img
                src="/TradePageimages/icons8-upload-64.png"
                alt="upload icon"
                onClick={handleIconClick}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-7 cursor-pointer"
                title="انتخاب فایل"
              />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={handleCreateStore}
              disabled={isCreating}
              className={`relative flex items-center justify-center bg-[#EABF9F] text-[#1E1E1E] px-6 py-2 rounded-full font-bold transition-all duration-200 hover:bg-[#e7b78e] hover:scale-105 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isCreating ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-[#1E1E1E] rounded-full animate-spin"></div>
              ) : (
                "ساخت فروشگاه"
              )}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="bg-[#EABF9F] text-[#1E1E1E] px-6 py-2 rounded-full font-bold transition-all duration-200 hover:bg-[#e7b78e] hover:scale-105 hover:shadow-lg"
            >
              خروج
            </button>
          </div>


        </div>
      </div>
    </div>
  );
}
