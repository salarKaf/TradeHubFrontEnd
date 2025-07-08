import { useState } from 'react';

const PricingPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentResult, setShowPaymentResult] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

    const handlePlanSelect = async (planId) => {
        setSelectedPlan(planId);
        setIsProcessingPayment(true);
        
        try {
            // Call payment API with planId
            const paymentResponse = await callPaymentApi(planId);
            
            if (paymentResponse.success) {
                // Redirect to payment gateway
                window.location.href = paymentResponse.paymentUrl;
            } else {
                setPaymentSuccess(false);
                setShowPaymentResult(true);
                setIsProcessingPayment(false);
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentSuccess(false);
            setShowPaymentResult(true);
            setIsProcessingPayment(false);
        }
    };

    // Mock function to simulate API call
    const callPaymentApi = async (planId) => {
        // In a real app, this would be an actual API call to your backend
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    paymentUrl: `https://payment-gateway.com/pay?plan=${planId}&token=abc123`
                });
            }, 1000);
        });
    };

    const getExpiryDate = () => {
        const today = new Date();
        const expiry = new Date(today);
        expiry.setDate(today.getDate() + 30);
        return expiry.toLocaleDateString('fa-IR');
    };

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
                            className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 ${
                                plan.popular ? 'ring-2 ring-purple-500' : ''
                            }`}
                            style={{ height: '100%' }}
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
                            <div className={`p-8 text-center relative min-h-[200px] flex flex-col justify-center ${
                                plan.color === 'gradient' 
                                    ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 text-white' 
                                    : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                            }`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                                <div className="relative">
                                    <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-white/90 mb-4">{plan.subtitle}</p>
                                    
                                    {/* Price Section */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-4xl font-bold">
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
                            <div className="p-6">
                                <div className="mb-6">
                                    <h4 className="font-bold text-lg text-gray-800 mb-4">✨ امکانات شامل:</h4>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mt-0.5 shadow-md">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 leading-relaxed text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <div className="mt-auto pt-4">
                                    <button
                                        onClick={() => handlePlanSelect(plan.id)}
                                        disabled={isProcessingPayment && selectedPlan === plan.id}
                                        className={`w-full py-3 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                                            isProcessingPayment && selectedPlan === plan.id
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                : plan.color === 'gradient'
                                                ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-pink-700'
                                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                                        }`}
                                    >
                                        {isProcessingPayment && selectedPlan === plan.id ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>در حال اتصال به درگاه پرداخت...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <span>خرید پلن</span>
                                            </div>
                                        )}
                                    </button>

                                    {/* Trust Indicators */}
                                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                            </svg>
                                            <span>پرداخت امن</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                            </svg>
                                            <span>فعالسازی فوری</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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