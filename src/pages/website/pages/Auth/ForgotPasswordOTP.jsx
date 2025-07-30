import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { verifyOTPForgetPassword, resendOTPForgetPassword } from '../../../../API/buyerAuth';

const ForgotPasswordOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const inputRefs = useRef([]);
  const [email] = useState(location.state?.email || '');
  const [websiteId] = useState(location.state?.websiteId || '');

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 6);

    if (digits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);

      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    try {
      await verifyOTPForgetPassword(email, otpCode, websiteId);

      navigate(`/${slug}/reset-password`, {
        state: { email, websiteId },
      });
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert(error.message || 'کد تایید نامعتبر است');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      await resendOTPForgetPassword({ email, websiteId });
      setTimer(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      alert('کد جدید ارسال شد!');
    } catch (error) {
      console.error('Resend OTP failed:', error);
      alert(error.message || 'خطا در ارسال مجدد کد');
    } finally {
      setResendLoading(false);
    }
  };

  const handleMainButton = () => {
    const otpCode = otp.join('');
    if (canResend) {
      handleResendCode();
    } else if (otpCode.length !== 6) {
      setShowErrorModal(true);
    } else {
      handleSubmit();
    }
  };

  const isCodeComplete = otp.every(digit => digit !== '');

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/public/website/backHomoShop 1.png')" }}
    >
      {/* Logo */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-3 font-rubik">
        <h1 className="text-lg font-bold text-black">فروشگاه ویترین</h1>
        <img src="/public/website/Picsart_25-04-16_19-30-26-995 1.png" alt="logo" className="w-10 h-12" />
      </div>

      {/* Main container */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-lg font-rubik">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-white/20 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-black mb-2">تایید کد بازیابی</h1>
              <p className="text-black/80 text-sm">کد 6 رقمی ارسال شده به ایمیل {email} را وارد کنید</p>
            </div>

            {/* OTP fields */}
            <div className="flex justify-center gap-3 mb-8" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 border-black/60 text-black transition-all duration-300 ease-in-out focus:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-black/80"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-black font-bold text-lg">
                <Clock size={20} />
                <span>{formatTime(timer)}</span>
              </div>
            </div>

            {/* Submit / Resend */}
            <button
              type="button"
              onClick={handleMainButton}
              className={`w-full py-4 font-bold rounded-3xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 ${
                canResend
                  ? 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 backdrop-blur-sm text-white border-blue-400/50 hover:from-blue-600/90 hover:to-blue-700/90'
                  : isCodeComplete
                  ? 'bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-sm text-white border-green-400/50 hover:from-green-600/90 hover:to-green-700/90'
                  : 'bg-black/80 backdrop-blur-sm text-white border-white/10 hover:bg-black/90'
              }`}
              disabled={loading || resendLoading}
            >
              {canResend ? 'ارسال مجدد کد بازیابی' : 'تایید کد'}
            </button>

            {/* Back button */}
            <div className="text-center mt-6 pt-6 border-t border-white/20">
              <button
                onClick={() => navigate(`/${slug}/forgot-password`)}
                className="bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm text-black px-6 py-3 rounded-3xl hover:from-gray-500/50 hover:via-gray-600/40 hover:to-gray-700/50 hover:text-black/90 transition-all duration-300 border border-black/20"
              >
                بازگشت به صفحه قبل
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-8 rounded-2xl shadow-2xl max-w-md mx-4">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none"></div>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500/80 to-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-400/50">
                <XCircle size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-black">خطا!</h3>
              <p className="text-black/80">لطفاً کد 6 رقمی را کامل وارد کنید</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="bg-gradient-to-r from-red-500/80 to-red-600/80 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-3xl hover:from-red-600/90 hover:to-red-700/90 transition-all duration-300 transform hover:scale-105 border border-red-400/50"
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

export default ForgotPasswordOTP;
