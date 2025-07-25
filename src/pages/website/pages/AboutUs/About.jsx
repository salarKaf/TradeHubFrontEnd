import React, { useEffect, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa'; // برای آیکن سوالات

const AboutUs = () => {
  // ماک دیتا برای "درباره ما" و "پرسش‌های متداول"
  const [aboutContent, setAboutContent] = useState(''); // این بخش برای داده‌هایی است که از API می‌خواهیم دریافت کنیم.
  const [faqData, setFaqData] = useState([
    { question: "چطور می‌توانم حساب کاربری بسازم؟", answer: "برای ساخت حساب کاربری، ابتدا به صفحه ثبت‌نام رفته و اطلاعات مورد نیاز را وارد کنید." },
    { question: "چطور می‌توانم محصول مورد نظر خود را پیدا کنم؟", answer: "با استفاده از نوار جستجو در بالای صفحه، می‌توانید محصول مورد نظر خود را جستجو کنید." },
    { question: "آیا امکان بازگشت محصول وجود دارد؟", answer: "بله، شما می‌توانید محصول را در بازه زمانی 7 روزه پس از خرید بازگشت دهید." }
  ]);

  // برای بارگیری داده‌ها از بک‌اند
  useEffect(() => {
    // فرض کنید که API شما این داده‌ها رو می‌ده
    setAboutContent("این صفحه برای معرفی فروشگاه و خدمات ما است. در اینجا می‌توانید اطلاعات مربوط به فروشگاه و خدمات مختلف ما را پیدا کنید.");
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* بخش درباره ما */}
      <div className="about-us">
        <h2 className="text-2xl font-bold text-gray-800">درباره ما</h2>
        <p className="mt-4 text-gray-600">{aboutContent}</p>
      </div>

      {/* بخش پرسش‌های متداول */}
      <div className="faq">
        <h2 className="text-2xl font-bold text-gray-800">پرسش‌های متداول</h2>
        <div className="faq-list mt-6 space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="faq-question flex items-center gap-3 text-lg font-semibold text-gray-700">
                <FaQuestionCircle className="text-blue-500" />
                <span>{faq.question}</span>
              </div>
              <div className="faq-answer mt-2 text-gray-600">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
