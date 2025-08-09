import React from 'react';

const FAQ = () => {
    const faqs = [
        {
            question: "آیا می‌توانم پلن را تغییر دهم؟",
            answer: "بله، در هر زمان می‌توانید پلن خود را ارتقا یا تغییر دهید."
        },
        {
            question: "آیا محدودیت ترافیک دارد؟",
            answer: "خیر، هیچ محدودیتی برای ترافیک و تعداد بازدیدکنندگان وجود ندارد."
        },
        {
            question: "چگونه پشتیبانی دریافت کنم؟",
            answer: "تیم پشتیبانی ما 24/7 از طریق چت، ایمیل و تلفن در خدمت شما هستند."
        },
        {
            question: "آیا پشتیبانی از موبایل دارید؟",
            answer: "بله، سیستم کاملاً ریسپانسیو است و روی تمام دستگاه‌ها کار می‌کند."
        }
    ];

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
                سوالات متداول 🤔
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                        <h4 className="font-bold text-lg mb-3 text-white">{faq.question}</h4>
                        <p className="text-gray-300">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;