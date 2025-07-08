



import React from 'react';

const Home = () => {
  return (
    <div className="bg-[#FFF7E7] min-h-screen py-12 px-6 md:px-16 lg:px-24 rtl" dir="rtl">
      {/* بخش بالا */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          {/* تصویر موبایل با جعبه */}
          <div className="md:w-1/2 w-full flex justify-center">
            <img
              src="/path-to-image/phone-boxes.png"
              alt="phone delivery"
              className="max-w-xs md:max-w-sm"
            />
          </div>

          {/* تیتر و متن بالا */}
          <div className="md:w-1/2 w-full text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-loose mb-4">
              از ایده تا فروش، بدون نیاز به کدنویسی!
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              با <strong>TradeHub</strong> فروشگاه خودت رو در چند دقیقه بساز :)
            </p>
          </div>
        </div>

        {/* بخش معرفی */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* تصویر سبد خرید */}
          <div className="md:w-1/2 w-full">
            <img
              src="/path-to-image/laptop-cart.jpg"
              alt="shopping laptop"
              className="rounded-xl w-full object-cover shadow-md"
            />
          </div>

          {/* متن معرفی */}
          <div className="md:w-1/2 w-full text-right space-y-4">
            <h2 className="text-xl font-bold text-gray-800">معرفی</h2>
            <p className="text-gray-700 leading-loose">
              <strong>TradeHub</strong> یک پلتفرم همراه برای راه‌اندازی فروشگاه‌های آنلاین است
              که به فروشندگان این امکان را می‌دهد تا با ارائه محصولات دیجیتال و فیزیکی، فروش خود را سریع و امن تجربه نمایند.
              شما می‌توانید بدون دانش فنی، فروشگاه خود را راه‌اندازی کرده و فرآیندهای فروش را به صورت خودکار و اتوماتیک مدیریت کنید.
              همچنین با ابزارهای آماری پیشرفته، روند فروش خود را بررسی کرده و به رشد کسب‌وکار کمک نمایید.
            </p>
          </div>
        </div>

        {/* آشنایی با خدمات */}
        <div className="mt-20">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 pb-2 border-gray-300 inline-block">
            آشنایی با خدمات
          </h2>
          {/* در ادامه می‌تونی لیست خدمات رو بیاری */}
        </div>
      </div>
    </div>
  );
};

export default Home;

