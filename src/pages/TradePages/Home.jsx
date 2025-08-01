import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {


  const navigate = useNavigate();

  return (
    <div dir='rtl' className="bg-[#FFF7E7] min-h-screen font-modam">

      <div className="py-12 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* بخش ابتدایی: عکس و معرفی */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            {/* تصویر */}
            <div className="md:w-1/2 w-full flex justify-center">
              <img
                src="/public/TradePageimages/Picsart_25-04-10_19-01-52-544 1.png"
                alt="phone delivery"
                className="max-w-sm w-full object-contain"
              />
            </div>

            {/* متن */}
            <div className="md:w-1/2 w-full text-right space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">
                از ایده تا فروش، بدون نیاز به کدنویسی!
              </h1>
              <p className="text-xl text-gray-700 pt-5">
                با <strong>TradeHub</strong> فروشگاه خودت رو در چند دقیقه بساز :)
              </p>
              <p className="text-gray-700 text-lg pt-5">
                خوش آمدید به <strong>TradeHub</strong>، پلتفرم فروشگاه‌ساز که فروش محصولات دیجیتال و فیزیکی را بدون نیاز به مهارت فنی، ساده و سریع می‌کند.
              </p>
            </div>
          </div>

          {/* معرفی و تیتر خدمات با تراز افقی هم‌راستا */}
          <div className="flex justify-between items-center mt-20">
            <h2 className="text-2xl font-bold text-gray-800 relative w-fit after:content-[''] after:absolute after:-bottom-2 after:right-0 after:translate-y-full after:w-[150%] after:h-[1px] after:bg-black">
              معرفی
            </h2>
          </div>

          {/* پاراگراف معرفی با تصویر */}
          <div className="flex flex-col md:flex-row items-start gap-8 font-modam">
            {/* متن */}
            <div className="md:w-1/2 w-full text-right text-lg leading-loose text-gray-700 mt-5">
              <p>
                <strong>TradeHub</strong> به شما این امکان را می‌دهد که فروشگاه آنلاین خود را بدون کدنویسی راه‌اندازی کنید، محصولاتتان را به‌صورت خودکار بفروشید، و فرآیندهای پرداخت و تحویل را بدون دردسر مدیریت نمایید.
              </p>
              <p>
                ابزارهای آمارگیری، داشبورد فروش، و قابلیت افزودن کد تخفیف، همگی در کنار امنیت بالا، تجربه‌ای کامل از یک فروشگاه حرفه‌ای برایتان فراهم می‌کند.
              </p>
            </div>

            {/* تصویر */}
            <div className="md:w-1/2 w-full">
              <img
                src="/TradePageimages/93896ad38974f1825b3f1ae41fe3b6ad 1.png"
                alt="shopping laptop"
                className="rounded-xl w-full object-cover shadow-md"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 relative w-fit after:content-[''] after:absolute after:-bottom-2 after:right-0 after:translate-y-full after:w-[150%] after:h-[1px] after:bg-black">
            آشنایی با خدمات
          </h2>

          {/* کارت‌های خدمات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-10 mt-12">
            {[
              {
                icon: 'icons8-service-50.png',
                title: 'ساخت فروشگاه آسان',
                text: 'فروشگاه خود را تنها با چند کلیک راه‌اندازی کنید.',
              },
              {
                icon: 'icons8-security-shield-64(1).png',
                title: 'امنیت تضمین‌شده',
                text: 'اطلاعات و فایل‌های مشتریان با امنیت کامل نگهداری می‌شود.',
              },
              {
                icon: 'icons8-click-64(1).png',
                title: 'راه‌اندازی سریع',
                text: 'بدون مهارت فنی، در چند دقیقه فروشگاه بسازید.',
              },
              {
                icon: 'icons8-dashboard-64(1).png',
                title: 'داشبورد حرفه‌ای',
                text: 'همه‌چیز را از یک پنل ساده و حرفه‌ای مدیریت کنید.',
              },
              {
                icon: 'icons8-bursts-64(1).png',
                title: 'پشتیبانی حرفه‌ای',
                text: 'تیم پشتیبانی همیشه در کنار شماست تا با خیال راحت فروش کنید.',
              },
              {
                icon: 'icons8-sell-64(1) 1(1).png',
                title: 'فروش خودکار',
                text: 'پس از خرید، فایل به‌صورت خودکار برای مشتری ارسال می‌شود.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-700/50 p-8 w-[90%] md:w-[80%] min-h-[100px] flex flex-col justify-center gap-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`/TradePageimages/${item.icon}`}
                    alt={item.title}
                    className="w-8 h-8"
                  />
                  <h3 className="text-xl font-bold font-modam text-gray-800">{item.title}</h3>
                </div>
                <p className="text-md text-gray-600 font-modam">{item.text}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* نوار صورتی تمام عرض */}
      <div className="bg-[#EABF9F] py-20 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6">
            آماده برای شروع فروش آنلاین هستید؟
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            با TradeHub تجربه فروش حرفه‌ای و بدون دردسر را از همین امروز شروع کنید
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-gray-800 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            همین الان شروع کنید
          </button>
        </div>
      </div>

      <div className="py-12 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* بخش مشکلات و راه‌حل‌ها */}
          <div className="py-16 rounded-2xl px-6 space-y-12 text-right">
            <h2 className="text-2xl font-bold text-gray-800">
              مشکلات فروش فایل‌های دیجیتال؟ <span className="text-gray-800">راه‌حل‌ها در TradeHub!</span>
            </h2>

            <div className="space-y-10">
              {[
                {
                  problem: 'مدیریت دستی سفارش‌ها و تحویل فایل‌ها زمان‌بر است.',
                  solution: 'تمامی فرآیندها به‌صورت خودکار انجام می‌شود و نیازی به مدیریت دستی ندارید.',
                },
                {
                  problem: 'هزینه‌های بالا برای راه‌اندازی فروشگاه آنلاین.',
                  solution: 'با پلن‌های اشتراکی مقرون‌به‌صرفه، به شما این امکان را می‌دهیم که بدون هزینه‌های سنگین فروشگاه آنلاین خود را راه‌اندازی کنید.',
                },
                {
                  problem: 'مدیریت چند محصول و پیگیری فروش‌ به‌صورت هم‌زمان می‌تواند گیج‌کننده و وقت‌گیر باشد.',
                  solution: 'با داشبورد هوشمند TradeHub همه چیز — از اضافه کردن محصول گرفته تا بررسی سفارش‌ها و آمار فروش — از یک پنل ساده و یکپارچه مدیریت میشود.',
                },

              ].map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img src="/public/TradePageimages/icons8-problem-48 1.png" alt="problem" className="w-[32px] h-[32px]" />
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">مشکل:</h4>
                      <p className="text-gray-700 text-base">{item.problem}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <img src="/public/TradePageimages/icons8-wrench-64(1) 1(1).png" alt="solution" className="w-[32px] h-[32px]" />
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">راه‌حل:</h4>
                      <p className="text-gray-700 text-base">{item.solution}</p>
                    </div>
                  </div>

                  <hr className="border border-gray-300 mt-6" />
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* فوتر */}
      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* بخش اول - درباره TradeHub */}
            <div className="text-right">
              <h3 className="text-2xl font-bold mb-6 text-[#EABF9F]">TradeHub</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                پلتفرم حرفه‌ای فروشگاه‌سازی برای فروش محصولات دیجیتال و فیزیکی بدون نیاز به مهارت فنی
              </p>
              <div className="flex justify-end">
                <div className="w-12 h-1 bg-[#EABF9F] rounded"></div>
              </div>
            </div>

            {/* بخش دوم - لینک‌های مفید */}
            <div className="text-right">
              <h4 className="text-xl font-bold mb-6 text-[#EABF9F]">خدمات ما</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-[#EABF9F] transition cursor-pointer">ساخت فروشگاه آنلاین</li>
                <li className="hover:text-[#EABF9F] transition cursor-pointer">فروش خودکار فایل</li>
                <li className="hover:text-[#EABF9F] transition cursor-pointer">داشبورد مدیریت</li>
                <li className="hover:text-[#EABF9F] transition cursor-pointer">پشتیبانی ۲۴/۷</li>
                <li className="hover:text-[#EABF9F] transition cursor-pointer">آمارگیری پیشرفته</li>
              </ul>
            </div>

            {/* بخش سوم - اطلاعات تماس */}
            <div className="text-right">
              <h4 className="text-xl font-bold mb-6 text-[#EABF9F]">ارتباط با ما</h4>
              <div className="space-y-4 text-gray-300">

                {/* ایمیل */}
                <div className="flex items-center justify-end gap-3 hover:text-[#EABF9F] transition">
                  <span>salarikosar5@gmail.com</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>

                {/* تلفن */}
                <div className="flex items-center justify-end gap-3 hover:text-[#EABF9F] transition">
                  <span>09013870885</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>

                {/* تلگرام */}
                <div className="flex items-center justify-end gap-3 hover:text-[#EABF9F] transition">
                  <span dir="ltr">@salari_k28</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                  </svg>
                </div>

              </div>
            </div>
          </div>

          {/* خط جدا کننده */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-right">
                © ۲۰۲۵ TradeHub. تمامی حقوق محفوظ است.
              </p>
              {/* <div className="flex gap-6">
                <span className="text-gray-400 hover:text-[#EABF9F] cursor-pointer transition">حریم خصوصی</span>
                <span className="text-gray-400 hover:text-[#EABF9F] cursor-pointer transition">شرایط استفاده</span>
                <span className="text-gray-400 hover:text-[#EABF9F] cursor-pointer transition">سوالات متداول</span>
              </div> */}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;