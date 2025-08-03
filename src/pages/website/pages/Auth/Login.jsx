import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { loginBuyer, resendOTP } from '../../../../API/buyerAuth';
import { getWebsiteIdBySlug } from '../../../../API/website';

const Login = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted!"); // Debug log

        // Reset previous errors
        setErrors({});

        // اعتبارسنجی فیلدها
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'ایمیل ضروری است';
            console.log("Email validation failed");
        }
        if (!password.trim()) {
            newErrors.password = 'رمز عبور ضروری است';
            console.log("Password validation failed");
        }

        if (Object.keys(newErrors).length > 0) {
            console.log("Validation errors:", newErrors);
            setErrors(newErrors);
            return;
        }

        console.log("Starting login process...");
        setLoading(true);

        // تعریف websiteId در بالای try-catch block
        let websiteId = null;

        try {
            // پاک کردن توکن قبلی
            localStorage.removeItem('buyer_access_token');
            console.log("Removed previous token");
            
            // دریافت website_id از slug
            console.log("Getting website ID for slug:", slug);
            const websiteResponse = await getWebsiteIdBySlug(slug);
            websiteId = websiteResponse.website_id; // اختصاص به متغیر خارج از try block
            console.log("Website ID:", websiteId);

            // ارسال درخواست لاگین
            console.log("Attempting login with:", { email, websiteId });
            const response = await loginBuyer({
                website_id: websiteId,
                username: email,
                password: password,
                grant_type: 'password'
            });

            console.log("Login successful:", response);
            
            // ذخیره توکن و انتقال به صفحه اصلی
            localStorage.setItem('buyer_access_token', response.access_token);
            console.log("Token saved, navigating to home");
            navigate(`/${slug}/home`);

        } catch (error) {
            console.error("Login failed:", error);
            console.error("Error details:", error.response?.data);
            
            // چک کردن اینکه آیا کاربر تأیید نشده است
            const errorMessage = error.message || '';
            const errorDetail = error.response?.data?.detail || '';
            
            console.log("Checking for not verified error...");
            console.log("Error message:", errorMessage);
            console.log("Error detail:", errorDetail);
            
            if (errorMessage.includes('not verified') || errorDetail.includes('not verified')) {
                console.log("User not verified, sending OTP...");
                
                // بررسی وجود websiteId قبل از استفاده
                if (!websiteId) {
                    console.error("websiteId is not available");
                    setErrorMessage('خطا در شناسایی فروشگاه');
                    setShowErrorModal(true);
                    return;
                }
                
                try {
                    await resendOTP({ email, websiteId });
                    console.log("OTP sent successfully");
                    
                    setSuccessMessage('حساب شما هنوز تأیید نشده است. کد تأیید ارسال شد.');
                    setShowSuccessModal(true);
                    
                    // بعد از 2 ثانیه انتقال به صفحه OTP
                    setTimeout(() => {
                        console.log("Navigating to OTP page");
                        navigate(`/${slug}/otp-verification`, { 
                            state: { 
                                email: email, 
                                websiteId: websiteId,
                                fromLogin: true 
                            } 
                        });
                    }, 2000);
                    
                } catch (otpError) {
                    console.error('Error sending OTP:', otpError);
                    setErrorMessage('خطا در ارسال کد تأیید');
                    setShowErrorModal(true);
                }
            } else {
                // سایر خطاها
                console.log("Other login error");
                setErrorMessage(errorMessage || errorDetail || 'ایمیل یا رمز عبور نادرست است');
                setShowErrorModal(true);
            }
        } finally {
            console.log("Login process finished");
            setLoading(false);
        }
    };

    const handleBackToShop = () => {
        navigate(`/${slug}/home`);
    };

    return (
        <div className="min-h-screen bg-cover bg-center relative px-4 sm:px-6 lg:px-8" 
             style={{ backgroundImage: "url('/public/website/backHomoShop 1.png')" }}>
            
            {/* Back to Shop Button */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                <button
                    onClick={handleBackToShop}
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-lg text-black hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base font-Kahroba"
                >
                    <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>بازگشت به فروشگاه</span>
                </button>
            </div>

            {/* Form container */}
            <div className="flex justify-center items-center min-h-screen py-8 font-Kahroba">
                {/* Glassmorphism container */}
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
                    {/* Enhanced inner glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-white/20 pointer-events-none"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8 sm:mb-12">
                            <p className="text-black text-sm sm:text-base">جهت ورود به فروشگاه فرم زیر را پر کنید</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {/* فیلد ایمیل */}
                            <div>
                                <label className="block text-black text-xs sm:text-sm mb-2">ایمیل خود را وارد کنید</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full p-3 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.email ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-gray-500/80 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300 text-sm sm:text-base`}
                                    placeholder="example@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* فیلد رمز عبور */}
                            <div className="relative">
                                <label className="block text-black text-xs sm:text-sm mb-2">رمز عبور</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full p-3 pr-12 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.password ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-gray-500/80 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300 text-sm sm:text-base`}
                                    placeholder="رمز عبور خود را وارد کنید"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition-colors duration-200 p-1"
                                    style={{ marginTop: '12px' }}
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} className="sm:w-[18px] sm:h-[18px] opacity-70 hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <Eye size={16} className="sm:w-[18px] sm:h-[18px] opacity-70 hover:opacity-100 transition-opacity" />
                                    )}
                                </button>
                                {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
                            </div>

                            {/* لینک بازیابی رمز عبور */}
                            <div className="text-right mb-4">
                                <Link
                                    to={`/${slug}/forgot-password`}
                                    className="text-black/70 hover:text-black text-xs sm:text-sm underline transition-colors duration-300"
                                >
                                    بازیابی رمز عبور
                                </Link>
                            </div>

                            {/* دکمه ورود */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 sm:py-4 bg-black/80 backdrop-blur-sm text-white font-bold rounded-3xl hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'در حال ورود...' : 'وارد شوید'}
                            </button>
                        </form>

                        {/* لینک به صفحه ثبت‌نام */}
                        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-black/80">
                            <span>آیا حسابی ندارید؟ </span>
                            <Link
                                to={`/${slug}/signup`}
                                className="text-black hover:text-black/80 underline transition-colors duration-300"
                            >
                                ثبت نام کنید
                            </Link>
                        </div>
                    </div>

                    {/* Additional decorative elements */}
                    <div className="absolute -top-2 -right-2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg"></div>
                </div>
            </div>

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md mx-4 w-full">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none"></div>

                        <div className="relative z-10 text-center space-y-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-red-500/80 to-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-400/50">
                                <XCircle size={24} className="sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-black">خطا!</h3>
                            <p className="text-black/80 text-sm sm:text-base">{errorMessage}</p>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="bg-gradient-to-r from-red-500/80 to-red-600/80 backdrop-blur-sm text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-3xl hover:from-red-600/90 hover:to-red-700/90 transition-all duration-300 transform hover:scale-105 border border-red-400/50 text-sm sm:text-base"
                            >
                                متوجه شدم
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md mx-4 w-full">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none"></div>

                        <div className="relative z-10 text-center space-y-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-blue-500/80 to-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/50">
                                <CheckCircle size={24} className="sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-black">توجه!</h3>
                            <p className="text-black/80 text-sm sm:text-base">{successMessage}</p>
                            <p className="text-black/60 text-xs sm:text-sm">در حال انتقال به صفحه تأیید...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;