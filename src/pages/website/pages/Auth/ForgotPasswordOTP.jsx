import React, { useState, useRef, useEffect } from 'react';

const ForgotPasswordOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(120); // 2 دقیقه
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    // شبیه‌سازی ایمیل و website_id (در پروژه واقعی از useLocation استفاده می‌شود)
    const email = "user@example.com";
    const website_id = "12345";

    // تایمر برای resend
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // اگر عدد وارد شد، به input بعدی برو
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // اگر Backspace زده شد و input خالی است، به input قبلی برو
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setErrors({ otp: 'لطفا کد ۶ رقمی را کامل وارد کنید' });
            return;
        }

        setLoading(true);
        try {
            // شبیه‌سازی API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // در صورت موفقیت، انتقال به صفحه تغییر رمز عبور
            alert('کد تایید شد! انتقال به صفحه تغییر رمز عبور...');
            setErrors({});

        } catch (error) {
            console.error("OTP verification failed:", error);
            setErrors({
                general: error.message || 'کد تایید نادرست است'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;

        setResendLoading(true);
        try {
            // شبیه‌سازی API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setTimer(120);
            setCanResend(false);
            setErrors({});
            alert('کد جدید ارسال شد');

        } catch (error) {
            console.error("Resend OTP failed:", error);
            setErrors({
                general: error.message || 'خطا در ارسال مجدد کد'
            });
        } finally {
            setResendLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/public/website/backHomoShop 1.png')" }}>
            {/* Logo and store name - top left */}
            <div className="absolute top-8 left-8 z-20 flex items-center gap-3 font-rubik">
                <h1 className="text-lg font-bold text-black">فروشگاه ویترین</h1>
                <img src='/public/website/Picsart_25-04-16_19-30-26-995 1.png' className='w-10 h-12' alt="Store Logo" />
            </div>

            {/* Form container */}
            <div className="flex justify-center items-center min-h-screen">
                {/* Glassmorphism container */}
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md font-rubik">
                    {/* Enhanced inner glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-white/20 pointer-events-none"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-xl font-bold text-black mb-2">تایید کد بازیابی</h2>
                            <p className="text-black text-sm mb-2">کد ۶ رقمی ارسال شده به ایمیل</p>
                            <p className="text-black/70 text-sm font-mono">{email}</p>
                            <p className="text-black text-sm mt-2">را وارد کنید</p>
                        </div>

                        {/* نمایش خطاهای کلی */}
                        {errors.general && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {errors.general}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* OTP Input Fields */}
                            <div>
                                <div className="flex justify-center gap-3 mb-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={el => inputRefs.current[index] = el}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className={`w-12 h-12 text-center text-xl font-bold bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.otp ? 'border-red-500' : 'border-black/60'} rounded-xl text-black focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300`}
                                            maxLength={1}
                                        />
                                    ))}
                                </div>
                                {errors.otp && <p className="text-red-500 text-sm text-center">{errors.otp}</p>}
                            </div>

                            {/* Timer and Resend */}
                            <div className="text-center">
                                {!canResend ? (
                                    <p className="text-black/70 text-sm">
                                        ارسال مجدد کد در: <span className="font-mono">{formatTime(timer)}</span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={resendLoading}
                                        className="text-black hover:text-black/80 text-sm underline transition-colors duration-300 disabled:opacity-50"
                                    >
                                        {resendLoading ? 'در حال ارسال...' : 'ارسال مجدد کد'}
                                    </button>
                                )}
                            </div>

                            {/* دکمه تایید */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full py-4 bg-black/80 backdrop-blur-sm text-white font-bold rounded-3xl hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'در حال تایید...' : 'تایید کد'}
                            </button>
                        </div>

                        {/* لینک بازگشت */}
                        <div className="mt-6 text-center text-sm text-black/80">
                            <button className="text-black hover:text-black/80 underline transition-colors duration-300">
                                بازگشت به صفحه قبل
                            </button>
                        </div>
                    </div>

                    {/* Additional decorative elements */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordOTP;