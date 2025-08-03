import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, CheckCircle, XCircle } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../../../API/buyerAuth';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate(`/${slug}/login`);
        }, 2000);
      } catch (error) {
        console.error('Reset password failed:', error);
        setErrorMessage(error.message || 'خطا در تغییر رمز عبور');
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative px-4 sm:px-6 lg:px-8" 
         style={{ backgroundImage: "url('/public/website/backHomoShop 1.png')" }}>


      {/* Form container */}
      <div className="flex justify-center items-center min-h-screen py-8">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md font-Kahroba">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-white/20 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-2">تغییر رمز عبور</h2>
              <p className="text-black text-sm sm:text-base">رمز عبور جدید خود را وارد کنید</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* رمز عبور جدید */}
              <div className="relative">
                <label className="block text-black text-xs sm:text-sm mb-2">رمز عبور جدید</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full p-3 pr-12 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.newPassword ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-gray-500/80 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300 text-sm sm:text-base`}
                  placeholder="رمز عبور جدید را وارد کنید"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition-colors duration-200 p-1"
                  style={{ marginTop: '12px' }}
                >
                  {showNewPassword ? (
                    <EyeOff size={16} className="sm:w-[18px] sm:h-[18px] opacity-70 hover:opacity-100 transition-opacity" />
                  ) : (
                    <Eye size={16} className="sm:w-[18px] sm:h-[18px] opacity-70 hover:opacity-100 transition-opacity" />
                  )}
                </button>
                {errors.newPassword && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.newPassword}</p>}
              </div>

              {/* الزامات جمع‌وجور */}
              {newPassword && (
                <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm">
                  {isPasswordValid ? (
                    <Check size={14} className="sm:w-4 sm:h-4 text-green-600" />
                  ) : (
                    <X size={14} className="sm:w-4 sm:h-4 text-red-600" />
                  )}
                  <span className={`${isPasswordValid ? 'text-green-700' : 'text-black/70'}`}>
                    حداقل ۶ کاراکتر
                  </span>
                </div>
              )}

              {/* تکرار رمز عبور */}
              <div className="relative">
                <label className="block text-black text-xs sm:text-sm mb-2">تکرار رمز عبور</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 pr-12 bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-black/60'} rounded-3xl text-black placeholder-gray-500/80 focus:ring-2 focus:ring-white/30 focus:border-black/80 focus:outline-none transition-all duration-300 text-sm sm:text-base`}
                  placeholder="رمز عبور را مجددا وارد کنید"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition-colors duration-200 p-1"
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

              {/* دکمه ارسال */}
              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className={`w-full py-3 sm:py-4 bg-black/80 backdrop-blur-sm text-white font-bold rounded-3xl hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base ${(loading || !isPasswordValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'در حال تغییر رمز عبور...' : 'تغییر رمز عبور'}
              </button>
            </form>

            {/* بازگشت */}
            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-black/80">
              <button
                onClick={() => navigate(`/${slug}/login`)}
                className="text-black hover:text-black/80 underline transition-colors duration-300"
              >
                بازگشت به صفحه ورود
              </button>
            </div>
          </div>

          {/* تزئینات */}
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
              <p className="text-black/80 text-sm sm:text-base">رمز عبور با موفقیت تغییر کرد</p>
              <p className="text-black/60 text-xs sm:text-sm">انتقال به صفحه ورود...</p>
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

export default ResetPassword;