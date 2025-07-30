import React, { useState, useEffect } from "react";
import { ChevronLeft, Phone, MessageCircle, Users, FileText } from "lucide-react";
import InstagramIcon from "/public/website/Icon(1).png";
import telegramIcon from "/public/website/icons8-telegram-48(1).png";
import { getWebsiteById } from "../../../API/website";
import { useSlugNavigation } from "../../website/pages/Slug/useSlugNavigation";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getPageUrl } = useSlugNavigation();

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const websiteId = localStorage.getItem("current_store_website_id");
        if (!websiteId) throw new Error("Website ID not found");

        const data = await getWebsiteById(websiteId);

        setFooterData({
          phone: data?.social_links?.phone || "",
          instagram: data?.social_links?.instagram || "",
          telegram: data?.social_links?.telegram || "",
          faqs: (data?.faqs || []).slice(0, 3),
          slogan: data?.store_slogan || "با ما تجربه‌ای متفاوت از خرید داشته باشید",
          websiteId,
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ خطا در گرفتن اطلاعات فوتر:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 font-rubik border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

            {/* لودر بخش تماس */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-6 bg-slate-200 rounded w-40 animate-pulse"></div>
              </div>

              <div className="rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="h-4 bg-slate-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-6 bg-slate-200 rounded w-36 animate-pulse"></div>
              </div>

              <div className="rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="h-4 bg-slate-200 rounded w-28 mb-3 animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-slate-200 rounded animate-pulse"></div>
                  <div className="w-7 h-7 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* لودر بخش قوانین و سوالات */}
            <div className="space-y-8">
              <div className="rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-5 bg-slate-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
              </div>

              <div className="rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-5 bg-slate-200 rounded w-28 animate-pulse"></div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>

            {/* لودر بخش شعار */}
            <div className="rounded-lg p-6 shadow-sm border border-slate-200 h-fit">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-5 bg-slate-200 rounded w-28 animate-pulse"></div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-3/5 animate-pulse"></div>
              </div>

              <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* لودر فوتر پایین */}
        <div className="border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-3">
              <div className="h-4 bg-slate-200 rounded w-48 mx-auto animate-pulse"></div>
              <div className="h-3 bg-slate-200 rounded w-32 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !footerData) {
    return (
      <div className="w-full py-12 text-center text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg mx-4">
        خطا در بارگذاری اطلاعات فوتر: {error}
      </div>
    );
  }

  return (
    <footer className="bg-gradient-to-br from-slate-50/5 to-slate-600/5 text-slate-800 font-rubik border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* بخش تماس */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="text-blue-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-700">ارتباط با فروشنده</h3>
            </div>

            {footerData.phone && (
              <div className="rounded-lg p-4 shadow-sm ">
                <p className="text-sm text-slate-600 mb-2">شماره تماس فروشنده:</p>
                <p className="font-semibold text-slate-800 text-lg direction-ltr">
                  {footerData.phone}
                </p>
              </div>
            )}

            {/* شبکه های اجتماعی */}
            {(footerData.instagram || footerData.telegram) && (
              <div className="rounded-lg p-4 shadow-sm ">
                <p className="text-sm text-slate-600 mb-3">شبکه‌های اجتماعی:</p>
                <div className="flex gap-4">
                  {footerData.instagram && (
                    <a
                      href={footerData.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      <img src={InstagramIcon} alt="Instagram" className="w-6 h-6" />
                    </a>
                  )}
                  {footerData.telegram && (
                    <a
                      href={footerData.telegram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      <img src={telegramIcon} alt="Telegram" className="w-7 h-7" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* سوالات متداول و قوانین */}
          <div className="space-y-8">

            {/* قوانین */}
            <div className="rounded-lg p-6 shadow-sm ">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <FileText className="text-amber-600" size={16} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">قوانین و مقررات</h3>
              </div>
              <a
                href={getPageUrl("rules")}
                className="block text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm leading-relaxed"
              >
                قبل از خرید با قوانین فروشگاه ما آشنا شوید
              </a>
            </div>

            {/* سوالات */}
            {footerData.faqs.length > 0 && (
              <div className="rounded-lg p-6 shadow-sm ">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="text-green-600" size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">سوالات متداول</h3>
                </div>

                <div className="space-y-3 mb-4">
                  {footerData.faqs.map((faq, index) => (
                    <a
                      key={index}
                      href={getPageUrl("about") + `#q${index + 1}`}
                      className="block text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm py-1 border-b border-slate-100 last:border-0"
                    >
                      {faq.question}
                    </a>
                  ))}
                </div>

                <a
                  href={getPageUrl("about")}
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
                >
                  <span className="ml-1">نمایش همه</span>
                  <ChevronLeft size={14} />
                </a>
              </div>
            )}
          </div>

          {/* شعار فروشگاه */}
          <div className="rounded-lg p-6 shadow-sm  h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="text-purple-600" size={16} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">شعار فروشگاه</h3>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4 text-sm">
              {footerData.slogan}
            </p>

            <a
              href={getPageUrl("about")}
              className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
            >
              <span className="ml-1">بیشتر بدانید</span>
              <ChevronLeft size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* فوتر پایین */}
      <div className="border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-slate-500">
              طراحی شده توسط{" "}
              <a
                href="/"
                className="text-blue-600 font-semibold hover:underline transition-colors"
              >
                Trade Hub
              </a>
            </p>

            <p className="text-xs text-slate-400">
              کلیه حقوق محفوظ است © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;