import React, { useState, useEffect } from 'react';

const TermsAndConditions = () => {
  // ماک دیتا برای "قوانین و مقررات"
  const [termsContent, setTermsContent] = useState('');

  // برای بارگیری داده‌ها از بک‌اند
  useEffect(() => {
    // فرض کنید که این داده‌ها از API می‌آید
    setTermsContent("در این بخش، قوانینی که برای استفاده از سایت و خدمات آن وجود دارد قرار می‌گیرد. این قوانین شامل نحوه خرید، بازگشت کالا، و استفاده از اطلاعات شما است.");
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* بخش قوانین و مقررات */}
      <div className="terms">
        <h2 className="text-2xl font-bold text-gray-800">قوانین و مقررات</h2>
        <p className="mt-4 text-gray-600">{termsContent}</p>
      </div>

      {/* بخش شرایط استفاده */}
      <div className="conditions mt-6">
        <h3 className="text-xl font-semibold text-gray-700">شرایط استفاده</h3>
        <ul className="list-disc list-inside space-y-2 mt-4 text-gray-600">
          <li>استفاده از سایت فقط برای مقاصد قانونی مجاز است.</li>
          <li>تمامی اطلاعات موجود در سایت برای استفاده شخصی است و هرگونه کپی‌برداری بدون مجوز ممنوع است.</li>
          <li>مشتری مسئول حفظ اطلاعات حساب کاربری خود است و باید در اسرع وقت در صورت بروز هرگونه تخلف به پشتیبانی اطلاع دهد.</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsAndConditions;
