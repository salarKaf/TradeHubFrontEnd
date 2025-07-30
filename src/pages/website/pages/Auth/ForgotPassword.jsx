import React, { useState } from 'react';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // اعتبارسنجی فیلدها
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
                // شبیه‌سازی API call
                await new Promise(resolve => setTimeout(resolve, 2000));

                setSuccess(true);
                setErrors({});

            } catch (error) {
                console.error("Forget password failed:", error);
                setErrors({
                    general: error.message || 'خطا در ارسال ایمیل بازیابی'
                });
            } finally {
                setLoading(false);
            }
        }
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
                            <h2 className="text-xl font-bold text-black mb-2">بازیابی رمز عبور</h2>
                            <p className="text-black text-base">ایمیل خود را وارد کنید تا کد بازیابی برای شما ارسال شود</p>
                        </div>

                        {/* نمایش پیام موفقیت */}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
                                کد بازیابی به ایمیل شما ارسال شد. صفحه OTP برای وارد کردن کد باز می‌شود.
                            </div>
                        )}

                        {/* نمایش خطاهای کلی */}
                        {errors.general && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* فیلد ایمیل */}
                            <div>
                                <label className="block text-black text-sm mb-2">ایمیل خود را وارد کنید</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full p-3 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.email ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300`}
                                    placeholder="example@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* دکمه ارسال */}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full py-4 bg-black/80 backdrop-blur-sm text-white font-bold rounded-3xl hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'در حال ارسال...' : 'ارسال کد بازیابی'}
                            </button>
                        </form>

                        {/* لینک بازگشت به صفحه ورود */}
                        <div className="mt-6 text-center text-sm text-black/80">
                            <span>رمز عبور خود را به یاد آوردید؟ </span>
                            <button className="text-black hover:text-black/80 underline transition-colors duration-300">
                                ورود
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

export default ForgotPassword;