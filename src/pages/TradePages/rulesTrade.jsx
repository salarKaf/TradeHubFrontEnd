import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function RulesTrade() {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // اگر websiteId از URL parameter می‌آید
  const { websiteId } = useParams();
  
  // یا اگر از جای دیگری می‌آید، می‌توانید آن را دریافت کنید
  // const websiteId = localStorage.getItem('websiteId'); // مثال
  // const websiteId = 'your-website-id'; // مثال ثابت

  const handleNextClick = (e) => {
    e.preventDefault();
    if (!accepted) {
      setError("شما باید قوانین را بپذیرید.");
    } else {
      setError("");
      navigate(`/HomeSeller/${websiteId}`);
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
        <div className="relative z-20 bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-2xl rounded-3xl p-10 space-y-6 text-right text-white">

          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-100">
            قوانین و مقررات
          </h1>

          <div className="overflow-y-auto max-h-[300px] px-4 py-2 mb-6">
            <p className="mb-4 leading-relaxed text-justify text-sm">
              با ثبت‌نام و فعالیت به عنوان فروشنده در این سامانه، شما متعهد به
              رعایت موارد زیر می‌باشید:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-xs leading-relaxed text-justify">
              <li>
                مسئولیت محصول:
                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                  <li>کلیه محصولات ثبت‌شده توسط فروشنده باید دارای مالکیت قانونی یا حق فروش معتبر باشند.</li>
                  <li>فروشنده موظف است از ثبت محصولاتی که ناقض حقوق مالکیت فکری، قوانین ایران یا هرگونه مقررات مربوطه باشد، خودداری نماید.</li>
                  <li>مسئولیت کامل صحت، کیفیت، و محتوای محصولات ارائه‌شده بر عهده فروشنده می‌باشد.</li>
                </ul>
              </li>
              <li>
                کیفیت و صحت اطلاعات محصول:
                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                  <li>توضیحات، تصاویر و اطلاعات ثبت‌شده برای هر محصول باید دقیق، صحیح و مطابق با ویژگی‌های واقعی محصول باشد.</li>
                </ul>
              </li>
              <li>
                تحویل محصول:
                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                  <li>فروشنده موظف است بلافاصله پس از تایید خرید، محصول دیجیتال را مطابق با اطلاعات ثبت‌شده به خریدار تحویل دهد.</li>
                  <li>در صورت بروز مشکل در تحویل یا کیفیت محصول، فروشنده ملزم به همکاری جهت رفع مشکل یا بازپرداخت مبلغ به خریدار می‌باشد.</li>
                </ul>
              </li>
              <li>
                درآمد و تسویه حساب:
                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                  <li>مبلغ حاصل از فروش پس از کسر کارمزد مشخص‌شده توسط سامانه، در بازه زمانی تعیین‌شده به فروشنده پرداخت خواهد شد.</li>
                  <li>در صورت بروز اختلاف با شکایت از سوی خریدار، سامانه مجاز است تسویه حساب را تا زمان بررسی نهایی به حالت تعلیق درآورد.</li>
                </ul>
              </li>
              <li>
                سیاست‌های کلی و مقررات:
                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                  <li>فروشنده موظف به رعایت کلیه قوانین جاری کشور در زمینه فعالیت‌های تجاری و ارائه محصولات دیجیتال می‌باشد.</li>
                  <li>سامانه این اختیار را دارد که در صورت مشاهده هرگونه تخلف، بدون نیاز به اطلاع قبلی، حساب کاربری فروشنده را تعلیق یا مسدود نماید.</li>
                </ul>
              </li>
              <li>
                تغییرات در قوانین:
                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                  <li>قوانین و مقررات ممکن است در هر زمان به‌روزرسانی شوند. ادامه فعالیت فروشنده در سامانه به منزله پذیرش تغییرات جدید خواهد بود.</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <input
              type="checkbox"
              id="acceptRules"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="acceptRules" className="text-sm text-gray-200 select-none">
              تمامی قوانین را می‌پذیرم.
            </label>
          </div>
          
          {/* پیام خطا */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-right">{error}</p>
          )}
          
          {/* دکمه وسط */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleNextClick}
              className="bg-[#EABF9F] text-[#1E1E1E] px-8 py-3 rounded-full font-bold text-base
                         hover:bg-[#e7b78e] hover:scale-105 hover:shadow-lg 
                         active:scale-95 active:bg-[#d4a584]
                         transition-all duration-200 ease-in-out
                         focus:outline-none focus:ring-4 focus:ring-[#EABF9F] focus:ring-opacity-50"
              disabled={!accepted}
            >
              ورود به داشبورد فروشندگان
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}