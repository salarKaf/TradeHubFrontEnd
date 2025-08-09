import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, X, ArrowRight } from 'lucide-react';
import { registerBuyer } from '../../../../API/buyerAuth';
import { useParams } from 'react-router-dom';
import { getWebsiteIdBySlug} from "../../../../API/website.js";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const { slug } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!name.trim()) {
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
        const slugResponse = await getWebsiteIdBySlug(slug);
        const websiteId = slugResponse.website_id;

        const result = await registerBuyer(websiteId, name, email, password, confirmPassword);
        console.log("Registration successful:", result);

        setShowSuccessModal(true);
        
        setTimeout(() => {
          navigate(`/${slug}/otp-verification`, {
            state: {
              email: email,
              websiteId: websiteId
            }
          });
        }, 2000);

      } catch (error) {
        console.error("Registration failed:", error);
        setErrors({ general: 'خطا در ثبت نام. لطفاً دوباره تلاش کنید.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToShop = () => {
    navigate(`/${slug}/home`);
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center relative px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('/website/backHomoShop 1.png')",
        }}
      >
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <button
            onClick={handleBackToShop}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-lg text-black hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base font-Kahroba"
          >
            <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>بازگشت به فروشگاه</span>
          </button>
        </div>

        <div className="flex justify-center items-center min-h-screen py-8">
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md font-Kahroba">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div>
            <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-white/20 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-black text-sm sm:text-base leading-relaxed">جهت ثبت نام در فروشگاه فرم زیر را پر کنید</p>
              </div>

              {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm">
                  {errors.general}
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-black text-xs sm:text-sm mb-2">نام خود را وارد کنید</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-2.5 sm:p-3 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.name ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-gray-500/80 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300 text-sm sm:text-base`}
                    placeholder="نام کامل شما"
                  />
                  {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-black text-xs sm:text-sm mb-2">ایمیل خود را وارد کنید</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2.5 sm:p-3 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.email ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-gray-500/80 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300 text-sm sm:text-base`}
                    placeholder="example@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="relative">
                  <label className="block text-black text-xs sm:text-sm mb-2">رمز عبور</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-2.5 sm:p-3 pr-10 sm:pr-12 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.password ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-gray-500/80 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300 text-sm sm:text-base`}
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition-colors duration-200 p-1"
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

                <div className="relative">
                  <label className="block text-black text-xs sm:text-sm mb-2">تکرار رمز عبور</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full p-2.5 sm:p-3 pr-10 sm:pr-12 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-gray-500/80 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300 text-sm sm:text-base`}
                    placeholder="رمز عبور خود را دوباره وارد کنید"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition-colors duration-200 p-1"
                    style={{ marginTop: '12px' }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} className="sm:w-[18px] sm:h-[18px] opacity-70 hover:opacity-100 transition-opacity" />
                    ) : (
                      <Eye size={16} className="sm:w-[18px] sm:h-[18px] opacity-70 hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                  {errors.confirmPassword && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 sm:py-4 mt-6 sm:mt-8 bg-black/80 backdrop-blur-sm text-white font-bold rounded-3xl hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
              </button>

              <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-black/80">
                <span>آیا از قبل حساب دارید؟ </span>
                <Link
                  to={`/${slug}/login`}
                  className="text-black hover:text-black/80 underline transition-colors duration-300"
                >
                  وارد شوید
                </Link>
              </div>
            </div>

            <div className="absolute -top-2 -right-2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg"></div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">ثبت نام موفقیت‌آمیز!</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                کد تایید به ایمیل شما ارسال شد. در حال انتقال به صفحه تایید...
              </p>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;