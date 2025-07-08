import { useState } from 'react';

const PricingPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentResult, setShowPaymentResult] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            price: 400000,
            features: [
                'آنالیز های محدود',
                'امکان اضافه کردن محصول',
                'دسته بندی محصولات',
                'مشاهده فاکتور',
                'مشاهده سفارشات مشتری ها',
                'تنظیم فیچر های ظاهری سایت',
                'تنظیم لوگو و سر صفحه'
            ],
            popular: false,
            color: 'blue',
            subtitle: 'مناسب برای شروع کسب و کار',
            badge: 'پلن پایه',
            dailyPrice: 13333
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 600000,
            features: [
                'آمارگیری کامل و پیشرفته',
                'پرسش و پاسخ برای هر محصول',
                'آپشن کد تخفیف برای مشتری',
                'تخفیف گذاشتن روی محصولات',
                'جزئیات خرید هر مشتری',
                'آنالیز رفتاری هر مشتری',
                'نوتیفیکشن های هوشمند',
                'تمام امکانات پلن Basic',
                'پشتیبانی اولویت دار 24/7'
            ],
            popular: true,
            color: 'gradient',
            subtitle: 'بهترین انتخاب برای رشد کسب و کار',
            badge: '⭐ محبوب ترین',
            dailyPrice: 20000
        }
    ];

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
        setShowPaymentModal(true);
    };

    const handlePayment = () => {
        setShowPaymentModal(false);
        // شبیه سازی فرآیند پرداخت
        setTimeout(() => {
            setPaymentSuccess(true);
            setShowPaymentResult(true);
        }, 2000);
    };

    const getExpiryDate = () => {
        const today = new Date();
        const expiry = new Date(today);
        expiry.setDate(today.getDate() + 30);
        return expiry.toLocaleDateString('fa-IR');
    };

    // Payment Modal
    if (showPaymentModal) {
        const selectedPlanData = plans.find(p => p.id === selectedPlan);
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
                    <button 
                        onClick={() => {
                            setShowPaymentModal(false);
                            setSelectedPlan(null);
                        }}
                        className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">پرداخت آنلاین</h3>
                        <p className="text-gray-600">پلن {selectedPlanData?.name} - {new Intl.NumberFormat('fa-IR').format(selectedPlanData?.price)} تومان</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">شماره کارت</label>
                            <input 
                                type="text" 
                                placeholder="1234 5678 9012 3456"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ انقضا</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                <input 
                                    type="text" 
                                    placeholder="123"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">نام دارنده کارت</label>
                            <input 
                                type="text" 
                                placeholder="نام کامل"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg mt-6"
                    >
                        پرداخت و فعالسازی
                    </button>

                    <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                            </svg>
                            <span>پرداخت امن</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span>فعالسازی فوری</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (showPaymentResult) {
        const selectedPlanData = plans.find(p => p.id === selectedPlan);
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4" dir="rtl">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 animate-pulse"></div>
                    
                    {paymentSuccess ? (
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                                تبریک! 🎉
                            </h2>
                            <p className="text-gray-600 mb-6 text-lg">
                                پلن {selectedPlanData?.name} شما با موفقیت فعال شد
                            </p>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                    </svg>
                                    <span className="text-sm font-medium text-blue-700">مدت اعتبار</span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    این پلن تا تاریخ <span className="font-bold text-blue-600">{getExpiryDate()}</span> فعال خواهد بود
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    setShowPaymentResult(false);
                                    setSelectedPlan(null);
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                شروع استفاده از پلن
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">اوپس! 😔</h2>
                            <p className="text-gray-600 mb-6 text-lg">
                                متأسفانه پرداخت شما با خطا مواجه شد
                            </p>
                            <button 
                                onClick={() => {
                                    setShowPaymentResult(false);
                                    setSelectedPlan(null);
                                }}
                                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                تلاش مجدد
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 relative overflow-hidden" dir="rtl">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                        💎 پیشنهاد ویژه
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                        قدرت واقعی فروش آنلاین
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        با سیستم مدیریت حرفه‌ای ما، فروش خود را <span className="font-bold text-purple-600">5 برابر</span> افزایش دهید
                        <br />
                        هزاران کسب‌وکار موفق از ما استفاده می‌کنند
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id}
                            className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 ${
                                plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
                            }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-600 text-white px-8 py-3 rounded-bl-3xl shadow-lg">
                                    <span className="text-sm font-bold">{plan.badge}</span>
                                </div>
                            )}

                            {/* Badge */}
                            {!plan.popular && (
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className={`p-8 text-center relative min-h-[280px] flex flex-col justify-center ${
                                plan.color === 'gradient' 
                                    ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 text-white' 
                                    : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                            }`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                                <div className="relative">
                                    <h3 className="text-4xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-white/90 mb-4">{plan.subtitle}</p>
                                    
                                    {/* Price Section */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-5xl font-bold">
                                                {new Intl.NumberFormat('fa-IR').format(plan.price)}
                                            </span>
                                            <span className="text-xl">تومان</span>
                                        </div>
                                        <p className="text-white/80 mt-2">
                                            فقط {new Intl.NumberFormat('fa-IR').format(plan.dailyPrice)} تومان در روز!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="p-8">
                                <div className="mb-6">
                                    <h4 className="font-bold text-lg text-gray-800 mb-4">✨ امکانات شامل:</h4>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mt-0.5 shadow-md">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* API Access */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                                        </svg>
                                        <span className="font-bold text-blue-700">دسترسی API</span>
                                    </div>
                                    <p className="text-sm text-blue-600">
                                        امکان اتصال به سیستم‌های خارجی و سفارشی سازی
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handlePlanSelect(plan.id)}
                                    disabled={selectedPlan === plan.id}
                                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 ${
                                        selectedPlan === plan.id
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : plan.color === 'gradient'
                                            ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-pink-700'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span>🚀 همین الان شروع کنید</span>
                                    </div>
                                </button>

                                {/* Trust Indicators */}
                                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>پرداخت امن</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>فعالسازی فوری</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Proof */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-16">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">
                            بیش از 10,000 کسب‌وکار موفق 🎯
                        </h3>
                        <p className="text-gray-600">آنها چرا ما را انتخاب کردند؟</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">+500%</div>
                            <p className="text-gray-600">افزایش فروش متوسط</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                            <p className="text-gray-600">پشتیبانی تخصصی</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                            <p className="text-gray-600">رضایت مشتریان</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        سوالات متداول 🤔
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h4 className="font-bold text-lg mb-3">آیا می‌توانم پلن را تغییر دهم؟</h4>
                            <p className="text-gray-600">بله، در هر زمان می‌توانید پلن خود را ارتقا یا تغییر دهید.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h4 className="font-bold text-lg mb-3">آیا محدودیت ترافیک دارد؟</h4>
                            <p className="text-gray-600">خیر، هیچ محدودیتی برای ترافیک و تعداد بازدیدکنندگان وجود ندارد.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h4 className="font-bold text-lg mb-3">چگونه پشتیبانی دریافت کنم؟</h4>
                            <p className="text-gray-600">تیم پشتیبانی ما 24/7 از طریق چت، ایمیل و تلفن در خدمت شما هستند.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md">
                            <h4 className="font-bold text-lg mb-3">آیا پشتیبانی از موبایل دارید؟</h4>
                            <p className="text-gray-600">بله، سیستم کاملاً ریسپانسیو است و روی تمام دستگاه‌ها کار می‌کند.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPlans;