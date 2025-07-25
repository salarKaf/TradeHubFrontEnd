import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, ChevronLeft, X, Instagram, Youtube, Linkedin } from "lucide-react";
import InstagramIcon from "/public/website/Icon(1).png";
import telegramIcon from "/public/website/icons8-telegram-48(1).png";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  // شبیه‌سازی دریافت اطلاعات از بک‌اند
  useEffect(() => {
    // شبیه‌سازی API call
    const fetchFooterData = async () => {
      try {
        // در پروژه واقعی این‌جا API call شما قرار می‌گیره
        // const response = await fetch('/api/footer-info');
        // const data = await response.json();

        // نمونه داده (شبیه‌سازی response از بک‌اند)
        const mockData = {
          contactInfo: {
            phone: "021-88776655",
            email: "info@tardeHub.com",
          },

          socialLinks: {
            instagram: "https://instagram.com/tardeHub",
            telegram: "https://t.me/tardeHub",

          },
          quickLinks: [
            {
              title: "قوانین و مقررات",
              url: "/terms",
              items: [
                { name: "قبل از خرید با قوانین فروشگاه ما آشنا شوید", url: "/terms/purchase" }
              ]
            }
          ],
          faq: {
            title: "سوالات متداول",
            questions: [
              { question: "متن سوال اول", answer: "پاسخ سوال اول", url: "/faq/1" },
              { question: "متن سوال دوم", answer: "پاسخ سوال دوم", url: "/faq/2" },
              { question: "متن سوال سوم", answer: "پاسخ سوال سوم", url: "/faq/3" }
            ],
            viewAllUrl: "/faq"
          },
          aboutUs: {
            title: "درباره ما",
            description: "توضیح کوتاه در مورد فروشگاه و خدمات ارائه شده",
            fullUrl: "/about"
          },
          companyInfo: {
            name: "Tarde Hub",
            description: "این پنل فروشگاهی به‌صورت اختصاصی توسط تیم Tarde Hub طراحی شده است.",
            rights: "کلیه حقوق به این تیم می‌باشد."
          }
        };

        // شبیه‌سازی تاخیر شبکه
        setTimeout(() => {
          setFooterData(mockData);
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error('خطا در بارگذاری اطلاعات فوتر:', error);
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white text-black py-12 font-rubik">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="mr-3">در حال بارگذاری...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!footerData) {
    return (
      <div className="bg-white text-black py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>خطا در بارگذاری اطلاعات فوتر</p>
        </div>
      </div>
    );
  }

  return (
    <footer className="bg-gradient-to-b bg-white text-black">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Contact Info Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
              </div>
              <h3 className="text-xl font-bold">تماس با ما</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-black hover:text-black transition-colors">
                <Phone size={18} className="text-blue-400" />
                <span>شماره تماس فروشنده: {footerData.contactInfo.phone}</span>
              </div>

              <div className="flex items-center gap-3 text-black hover:text-black transition-colors">
                <Mail size={18} className="text-blue-400" />
                <span>ایمیل فروشنده: {footerData.contactInfo.email}</span>
              </div>


            </div>

            {/* Social Links */}
            <div className="pt-6">
              <div className="flex gap-1">
                {footerData.socialLinks.instagram && (
                  <a
                    href={footerData.socialLinks.instagram}
                    className="w-10 h-10  rounded-lg flex items-center justify-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={InstagramIcon} alt="Instagram" className="w-5 h-5" />
                  </a>
                )}
                {footerData.socialLinks.telegram && (
                  <a
                    href={footerData.socialLinks.telegram}
                    className="w-10 h-10   rounded-lg flex items-center justify-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={telegramIcon} alt="YouTube" className="w-8 h-8" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Quick Links & FAQ Section */}
          <div className="space-y-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">قوانین و مقررات</h3>
              <div className="space-y-3">
                {footerData.quickLinks.map((section, index) => (
                  <div key={index}>
                    {section.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={item.url}
                        className="block text-black hover:text-black hover:pr-2 transition-all duration-200"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                ))}
                <a
                  href="/terms/all"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-4"
                >
                  <span className="ml-1">مطالعه</span>
                  <ChevronLeft size={16} />
                </a>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h3 className="text-xl font-bold mb-6">{footerData.faq.title}</h3>
              <div className="space-y-3">
                {footerData.faq.questions.map((faq, index) => (
                  <a
                    key={index}
                    href={faq.url}
                    className="block text-black hover:text-black hover:pr-2 transition-all duration-200"
                  >
                    {faq.question}
                  </a>
                ))}
                <a
                  href={footerData.faq.viewAllUrl}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-4"
                >
                  <span className="ml-1">نمایش همه</span>
                  <ChevronLeft size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* About Us Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">{footerData.aboutUs.title}</h3>
            <p className="text-black leading-relaxed">
              {footerData.aboutUs.description}
            </p>
            <a
              href={footerData.aboutUs.fullUrl}
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="ml-1">ادامه مطلب</span>
              <ChevronLeft size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className=" bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <p className="text-black">
              این پنل فروشگاهی به‌صورت اختصاصی توسط تیم{" "}
              <a
                href="/"
                className="text-blue-950 font-bold hover:underline hover:text-blue-800 transition-colors"
              >
                {footerData.companyInfo.name}
              </a>{" "}
              طراحی شده است.
            </p>

            <p className="text-gray-400 text-sm">
              {footerData.companyInfo.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;