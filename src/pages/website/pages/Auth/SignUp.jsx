import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { registerBuyer } from '../../../../API/buyerAuth'; // مسیر رو درست کن
import { useParams } from 'react-router-dom';
import { getWebsiteIdBySlug, getWebsiteById, getLogo, getBanner } from "../../../../API/website";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // این خط را اضافه کنید
const SignUp = () => {
  const { slug } = useParams(); // برای گرفتن websiteId
  const [name, setName] = useState(''); // ✅ اضافه شده
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // ✅ اضافه شده
  const navigate = useNavigate();
  const handleSubmit = async (e) => { // ✅ async شده
    e.preventDefault();

    const newErrors = {};

    if (!name.trim()) { // ✅ اضافه شده
      newErrors.name = 'نام ضروری است';
    }

    if (!email.trim()) {
      newErrors.email = 'ایمیل ضروری است';
    }

    if (!password.trim()) {
      newErrors.password = 'رمز عبور ضروری است';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'تکرار رمز عبور ضروری است';
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // باید websiteId رو بگیری (از slug یا جای دیگه)
        const slugResponse = await getWebsiteIdBySlug(slug);
        const websiteId = slugResponse.website_id;

        const result = await registerBuyer(websiteId, name, email, password, confirmPassword);
        console.log("Registration successful:", result);


        // اگه موفق بود، بیاش صفحه OTP یا login
        // navigate('/otp-verification');
        alert('ثبت نام موفقیت آمیز بود! کد تایید برای شما ارسال شد.');
        // تغییر این بخش:
        navigate(`/${slug}/otp-verification`, {
          state: {
            email: email,
            websiteId: websiteId
          }
        });

      } catch (error) {
        console.error("Registration failed:", error);
        setErrors({ general: 'خطا در ثبت نام. لطفاً دوباره تلاش کنید.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/public/website/backHomoShop 1.png')",
      }}
    >

      {/* Logo and store name - top left */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-3 font-rubik">
        <h1 className="text-lg font-bold text-black">فروشگاه ویترین</h1>

        <img src='/public/website/Picsart_25-04-16_19-30-26-995 1.png ' className='w-10 h-12' />
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
            <div className="text-center mb-6">
              <p className="text-black text-base">جهت ثبت نام در فروشگاه فرم زیر را پر کنید</p>
            </div>

            {/* ✅ خطای کلی */}
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.general}
              </div>
            )}

            <div className="space-y-6">
              {/* ✅ فیلد نام اضافه شده */}
              <div>
                <label className="block text-black text-sm mb-2">نام خود را وارد کنید</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.name ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300`}
                  placeholder="نام کامل شما"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

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

              <div className="relative ">
                <label className="block text-black text-sm mb-2">تکرار رمز عبور</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 pr-12 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300`}
                  placeholder="رمز عبور خود را دوباره وارد کنید"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition-colors duration-200 p-1"
                  style={{ marginTop: '12px' }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="opacity-70 hover:opacity-100 transition-opacity" />
                  ) : (
                    <Eye size={18} className="opacity-70 hover:opacity-100 transition-opacity" />
                  )}
                </button>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading} // ✅ اضافه شده
              className="w-full py-4 mt-8 bg-black/80 backdrop-blur-sm text-white font-bold rounded-3xl hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
            </button>

            <div className="mt-6 text-center text-sm text-black/80">
              <span>آیا از قبل حساب دارید؟ </span>
              <Link
                to={`/${slug}/login`}
                className="text-black hover:text-black/80 underline transition-colors duration-300"
              >
                وارد شوید
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

export default SignUp;