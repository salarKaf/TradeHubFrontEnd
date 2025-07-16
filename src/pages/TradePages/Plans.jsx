import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

import axios from "axios";

const PricingPlans = () => {

    const { id: websiteId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("برای دسترسی به این بخش ابتدا وارد شوید.");
            navigate("/login");
        } else {
            fetchPlans();
        }
    }, []);

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentResult, setShowPaymentResult] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    // تابع برای گرفتن پلن‌ها از API
    const fetchPlans = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                'http://tradehub.localhost/api/v1/plan/get-all-plans/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // تبدیل داده‌های API به فرمت کامپوننت
            const formattedPlans = response.data.map(plan => ({
                id: plan.id, // از API واقعی استفاده کنید
                apiId: plan.id, // ID واقعی از API را نگه دارید
                name: plan.name,
                price: plan.price,
                dailyPrice: Math.floor(plan.price / 30),
                features: plan.name === 'Basic' ? [
                    'آنالیز های محدود',
                    'امکان اضافه کردن محصول',
                    'دسته بندی محصولات',
                    'مشاهده فاکتور',
                    'مشاهده سفارشات مشتری ها',
                    'تنظیم فیچر های ظاهری سایت',
                    'تنظیم لوگو و سر صفحه'
                ] : [
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
                popular: plan.name === 'Pro',
                color: plan.name === 'Pro' ? 'gradient' : 'blue',
                subtitle: plan.name === 'Basic' ? 'مناسب برای شروع کسب و کار' : 'بهترین انتخاب برای رشد کسب و کار',
                badge: plan.name === 'Pro' ? '⭐ محبوب ترین' : 'پلن پایه'
            }));

            setPlans(formattedPlans);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching plans:', error);
            setLoading(false);
        }
    };

    const handlePlanSelect = async (planId) => {
        // پیدا کردن پلن انتخاب شده
        const selectedPlanData = plans.find(p => p.id === planId);
        if (!selectedPlanData) {
            alert('پلن انتخاب شده یافت نشد');
            return;
        }

        setSelectedPlan(planId);
        setIsProcessingPayment(true);

        try {
            // استفاده از apiId واقعی برای API call
            const paymentResponse = await callPaymentApi(selectedPlanData.apiId);

            if (paymentResponse.success) {
                window.location.href = `/payment-result?status=success&plan=${planId}`;
            } else {
                window.location.href = `/payment-result?status=failed&plan=${planId}`;
            }
        } catch (error) {
            console.error('Payment error:', error);
            window.location.href = `/payment-result?status=failed&plan=${planId}`;
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const callPaymentApi = async (planId) => {
        try {
            const token = localStorage.getItem("token");
            
            console.log('Sending payment request for plan:', planId); // برای دیباگ
            
            const response = await axios.post(
                `http://tradehub.localhost/api/v1/payment/plan_payment_request/${planId}`,
                {}, // body خالی
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const paymentUrl = response.data?.payment_url;

            if (paymentUrl) {
                window.location.href = paymentUrl;
                return { success: true };
            } else {
                throw new Error("آدرس درگاه دریافت نشد!");
            }
        } catch (error) {
            console.error('Payment API Error:', error);
            
            // بررسی نوع خطا
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                
                // اگر خطای 422 است (Unprocessable Entity)
                if (error.response.status === 422) {
                    alert('داده‌های ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.');
                } else if (error.response.status === 404) {
                    alert('پلن مورد نظر یافت نشد.');
                } else {
                    alert('خطا در پردازش درخواست. لطفاً دوباره تلاش کنید.');
                }
            } else {
                alert('خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.');
            }
            
            throw error;
        }
    };

    const getExpiryDate = () => {
        const today = new Date();
        const expiry = new Date(today);
        expiry.setDate(today.getDate() + 30);
        return expiry.toLocaleDateString('fa-IR');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                    <h2 className="text-xl font-bold text-white">در حال بارگذاری پلن‌ها...</h2>
                </div>
            </div>
        );
    }

    if (showPaymentResult) {
        const selectedPlanData = plans.find(p => p.id === selectedPlan);
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" dir="rtl">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>

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
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden" dir="rtl">
            {/* Modern Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
                            قدرت واقعی فروش آنلاین
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            با سیستم مدیریت حرفه‌ای ما، فروش خود را <span className="font-bold text-purple-400">5 برابر</span> افزایش دهید
                            <br />
                            هزاران کسب‌وکار موفق از ما استفاده می‌کنند
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative group ${plan.popular ? 'transform scale-105' : ''}`}
                            >
                                {/* Glow Effect */}
                                <div className={`absolute inset-0 rounded-3xl ${plan.popular
                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                                    : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
                                    } blur-xl group-hover:blur-2xl transition-all duration-300`}></div>

                                {/* Card */}
                                <div className={`relative bg-white/10 backdrop-blur-xl rounded-3xl border ${plan.popular
                                    ? 'border-purple-500/30 shadow-purple-500/20'
                                    : 'border-white/20'
                                    } shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 flex flex-col`}>

                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white px-8 py-3 rounded-bl-3xl shadow-lg z-10">
                                            <span className="text-sm font-bold">{plan.badge}</span>
                                        </div>
                                    )}

                                    {/* Badge */}
                                    {!plan.popular && (
                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                                            {plan.badge}
                                        </div>
                                    )}

                                    {/* Plan Header */}
                                    <div className="p-8 text-center relative min-h-[200px] flex flex-col justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-t-3xl"></div>
                                        <div className="relative">
                                            <h3 className="text-3xl font-bold mb-2 text-white">{plan.name}</h3>
                                            <p className="text-gray-300 mb-4">{plan.subtitle}</p>

                                            {/* Price Section */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="text-4xl font-bold text-white">
                                                        {new Intl.NumberFormat('fa-IR').format(plan.price)}
                                                    </span>
                                                    <span className="text-xl text-gray-300">تومان</span>
                                                </div>
                                                <p className="text-gray-400 mt-2">
                                                    فقط {new Intl.NumberFormat('fa-IR').format(plan.dailyPrice)} تومان در روز!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-white mb-4">✨ امکانات شامل:</h4>
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mt-0.5 shadow-md">
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                            </svg>
                                                        </div>
                                                        <span className="text-gray-300 leading-relaxed text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="mt-6 pt-4">
                                            <button
                                                onClick={() => handlePlanSelect(plan.id)}
                                                disabled={isProcessingPayment && selectedPlan === plan.id}
                                                className={`w-full py-3 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${isProcessingPayment && selectedPlan === plan.id
                                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                    : plan.color === 'gradient'
                                                        ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white hover:from-purple-600 hover:via-blue-600 hover:to-pink-600 hover:scale-105'
                                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105'
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
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>

                                            {/* Trust Indicators */}
                                            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
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
                            </div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <h3 className="text-3xl font-bold text-white mb-8 text-center">
                            سوالات متداول 🤔
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                                <h4 className="font-bold text-lg mb-3 text-white">آیا می‌توانم پلن را تغییر دهم؟</h4>
                                <p className="text-gray-300">بله، در هر زمان می‌توانید پلن خود را ارتقا یا تغییر دهید.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                                <h4 className="font-bold text-lg mb-3 text-white">آیا محدودیت ترافیک دارد؟</h4>
                                <p className="text-gray-300">خیر، هیچ محدودیتی برای ترافیک و تعداد بازدیدکنندگان وجود ندارد.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                                <h4 className="font-bold text-lg mb-3 text-white">چگونه پشتیبانی دریافت کنم؟</h4>
                                <p className="text-gray-300">تیم پشتیبانی ما 24/7 از طریق چت، ایمیل و تلفن در خدمت شما هستند.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                                <h4 className="font-bold text-lg mb-3 text-white">آیا پشتیبانی از موبایل دارید؟</h4>
                                <p className="text-gray-300">بله، سیستم کاملاً ریسپانسیو است و روی تمام دستگاه‌ها کار می‌کند.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPlans;