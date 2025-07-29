import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { loginBuyer } from '../../../../API/buyerAuth';
import { getWebsiteIdBySlug } from '../../../../API/website';

const Login = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
            e.preventDefault();

    // اعتبارسنجی فیلدها
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'ایمیل ضروری است';
    if (!password.trim()) newErrors.password = 'رمز عبور ضروری است';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
        setLoading(true);
        try {
            // این خط رو اضافه کن - پاک کردن توکن قبلی
            localStorage.removeItem('buyer_access_token');
            
            // دریافت website_id از slug
            const websiteResponse = await getWebsiteIdBySlug(slug);
            const websiteId = websiteResponse.website_id;

            // ارسال درخواست لاگین
            const response = await loginBuyer({
                website_id: websiteId,
                username: email,
                password: password,
                grant_type: 'password'
            });

            // ذخیره توکن و انتقال به صفحه اصلی
            localStorage.setItem('buyer_access_token', response.access_token);
            navigate(`/${slug}/home`);

            } catch (error) {
                console.error("Login failed:", error);
                setErrors({
                    general: error.message || 'ایمیل یا رمز عبور نادرست است'
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
                            <p className="text-black text-base">جهت ورود به فروشگاه فرم زیر را پر کنید</p>
                        </div>

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

                            {/* فیلد رمز عبور */}
                            <div className="relative">
                                <label className="block text-black text-sm mb-2">رمز عبور</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full p-3 pr-12 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.password ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300`}
                                    placeholder="رمز عبور خود را وارد کنید"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition-colors duration-200 p-1"
                                    style={{ marginTop: '12px' }}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} className="opacity-70 hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <Eye size={18} className="opacity-70 hover:opacity-100 transition-opacity" />
                                    )}
                                </button>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            {/* لینک بازیابی رمز عبور */}
                            <div className="text-right mb-4">
                                <Link
                                    to={`/${slug}/forgot-password`}
                                    className="text-black/70 hover:text-black text-sm underline transition-colors duration-300"
                                >
                                    بازیابی رمز عبور
                                </Link>
                            </div>

                            {/* دکمه ورود */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 bg-black/80 backdrop-blur-sm text-white font-bold rounded-3xl hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'در حال ورود...' : 'وارد شوید'}
                            </button>
                        </form>

                        {/* لینک به صفحه ثبت‌نام */}
                        <div className="mt-6 text-center text-sm text-black/80">
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
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;