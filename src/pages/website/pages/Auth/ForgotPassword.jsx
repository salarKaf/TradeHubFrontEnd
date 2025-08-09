import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { getWebsiteIdBySlug } from '../../../../API/website';
import { resendOTP } from '../../../../API/buyerAuth';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'ایمیل ضروری است';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'فرمت ایمیل صحیح نیست';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);

            try {
                const websiteResponse = await getWebsiteIdBySlug(slug);
                const websiteId = websiteResponse?.website_id;

                if (!websiteId) throw new Error("Website ID یافت نشد.");

                console.log("Calling Resend OTP:", { email, websiteId });

                await resendOTP({ email, websiteId });

                setShowSuccessModal(true);
                setErrors({});

                setTimeout(() => {
                    navigate(`/${slug}/forgot-password-otp`, {
                        state: { email, websiteId }
                    });
                }, 2000);

            } catch (error) {
                console.error("Resend OTP failed:", error);

                let errorMsg = error.message || 'خطا در ارسال کد بازیابی';
                if (error.response?.data?.detail) {
                    errorMsg = Array.isArray(error.response.data.detail)
                        ? error.response.data.detail.map(err => err.msg || err.message).join(', ')
                        : error.response.data.detail;
                }

                setErrorMessage(errorMsg);
                setShowErrorModal(true);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="font-Kahroba min-h-screen bg-cover bg-center relative px-4 sm:px-6 lg:px-8" 
             style={{ backgroundImage: "url('/website/backHomoShop 1.png')" }}>

            {/* Form container */}
            <div className="flex justify-center items-center min-h-screen py-8">
                {/* Glassmorphism container */}
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
                    {/* Enhanced inner glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-white/20 pointer-events-none"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-lg sm:text-xl font-bold text-black mb-2">بازیابی رمز عبور</h2>
                            <p className="text-black text-sm sm:text-base">ایمیل خود را وارد کنید تا کد بازیابی برای شما ارسال شود</p>
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

                            {/* دکمه ارسال */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 sm:py-4 bg-black/80 backdrop-blur-sm text-white font-bold rounded-3xl hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'در حال ارسال...' : 'ارسال کد بازیابی'}
                            </button>
                        </form>

                        {/* لینک بازگشت به صفحه ورود */}
                        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-black/80">
                            <span>رمز عبور خود را به یاد آوردید؟ </span>
                            <button
                                onClick={() => navigate(`/${slug}/login`)}
                                className="text-black hover:text-black/80 underline transition-colors duration-300"
                            >
                                ورود
                            </button>
                        </div>
                    </div>

                    {/* Additional decorative elements */}
                    <div className="absolute -top-2 -right-2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg"></div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md mx-4 w-full">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none"></div>

                        <div className="relative z-10 text-center space-y-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-green-500/80 to-green-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-400/50">
                                <CheckCircle size={24} className="sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-black">موفق!</h3>
                            <p className="text-black/80 text-sm sm:text-base">کد بازیابی ارسال شد</p>
                            <p className="text-black/60 text-xs sm:text-sm">در حال انتقال...</p>
                        </div>
                    </div>
                </div>
            )}

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
                            <p className="text-black/80 text-sm sm:text-base break-words">{errorMessage}</p>
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
        </div>
    );
};

export default ForgotPassword;