import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../../../API/buyerAuth';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [email] = useState(location.state?.email || '');
  const [websiteId] = useState(location.state?.websiteId || '');

  const isPasswordValid = newPassword.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'رمز عبور جدید ضروری است';
    } else if (!isPasswordValid) {
      newErrors.newPassword = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'تکرار رمز عبور ضروری است';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await resetPassword(email, newPassword, confirmPassword, websiteId);
        alert('رمز عبور با موفقیت تغییر کرد! انتقال به صفحه ورود...');
        navigate(`/${slug}/login`);
      } catch (error) {
        console.error('Reset password failed:', error);
        setErrors({ general: error.message || 'خطا در تغییر رمز عبور' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/public/website/backHomoShop 1.png')" }}>
      {/* Logo */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-3 font-rubik">
        <h1 className="text-lg font-bold text-black">فروشگاه ویترین</h1>
        <img src='/public/website/Picsart_25-04-16_19-30-26-995 1.png' className='w-10 h-12' alt="Store Logo" />
      </div>

      {/* Form container */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md font-rubik">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-white/20 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-black mb-2">تغییر رمز عبور</h2>
              <p className="text-black text-base">رمز عبور جدید خود را وارد کنید</p>
            </div>

            {/* خطای کلی */}
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* رمز عبور جدید */}
              <div className="relative">
                <label className="block text-black text-sm mb-2">رمز عبور جدید</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full p-3 pr-12 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.newPassword ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300`}
                  placeholder="رمز عبور جدید را وارد کنید"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black p-1"
                  style={{ marginTop: '12px' }}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
              </div>

              {/* الزامات جمع‌وجور */}
              {newPassword && (
                <div className="flex items-center gap-2 mt-1 text-sm">
                  {isPasswordValid ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <X size={16} className="text-red-600" />
                  )}
                  <span className={`${isPasswordValid ? 'text-green-700' : 'text-black/70'}`}>
                    حداقل ۶ کاراکتر
                  </span>
                </div>
              )}

              {/* تکرار رمز عبور */}
              <div className="relative">
                <label className="block text-black text-sm mb-2">تکرار رمز عبور</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 pr-12 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300`}
                  placeholder="رمز عبور را مجددا وارد کنید"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black p-1"
                  style={{ marginTop: '12px' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* دکمه ارسال */}
              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className={`w-full py-4 bg-black/80 backdrop-blur-sm text-white font-bold rounded-3xl hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98] ${(loading || !isPasswordValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'در حال تغییر رمز عبور...' : 'تغییر رمز عبور'}
              </button>
            </form>

            {/* بازگشت */}
            <div className="mt-6 text-center text-sm text-black/80">
              <button
                onClick={() => navigate(`/${slug}/login`)}
                className="text-black hover:text-black/80 underline transition-colors duration-300"
              >
                بازگشت به صفحه ورود
              </button>
            </div>
          </div>

          {/* تزئینات */}
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
