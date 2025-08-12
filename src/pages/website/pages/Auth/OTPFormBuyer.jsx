import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../../../../API/buyerAuth';

const OTPForm = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || '');
  const [websiteId, setWebsiteId] = useState(location.state?.websiteId || '');

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
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
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
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
      const nextInput = document.getElementById(`otp-${nextIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      const otpCode = otp.join('');
      localStorage.removeItem('buyer_access_token');

      const response = await verifyOTP({ email, websiteId, otp: otpCode });

      if (response.access_token) {
        localStorage.setItem('buyer_access_token', response.access_token);
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        navigate(`/${slug}/login`);
      }, 2500);
    } catch (err) {
      console.error('OTP verification failed:', err);
      setErrorMessage('خطا در تایید کد');
      setShowErrorModal(true);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      await resendOTP({ email, websiteId });
      setTimer(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setShowResendModal(true);
    } catch (err) {
      console.error('Resend failed:', err);
      setErrorMessage(err.message || 'خطا در ارسال مجدد کد');
      setShowErrorModal(true);
    }
  };

  const handleMainButton = () => {
    if (canResend) {
      handleResendCode();
    } else {
      const otpCode = otp.join('');
      if (otpCode.length !== 6) {
        setErrorMessage('لطفاً کد 6 رقمی را کامل وارد کنید');
        setShowErrorModal(true);
        return;
      }
      handleSubmit();
    }
  };

  const isCodeComplete = otp.every(digit => digit !== '');

  return (
    <div
      className="min-h-screen bg-cover bg-center relative px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/website/backHomoShop 1.png')",
      }}
    >

      <div className="flex justify-center items-center min-h-screen py-8">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg font-rubik">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-white/20 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">تایید کد امنیتی</h1>
              <p className="text-black/80 text-xs sm:text-sm px-2">
                کد 6 رقمی ارسال شده به ایمیل {email} را وارد کنید
              </p>
            </div>

            <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8" dir="ltr">
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
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold rounded-xl bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 border-black/60 text-black
                  transition-all duration-300 ease-in-out focus:scale-[1.03] 
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-black/80"
                />
              ))}
            </div>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-black font-bold text-base sm:text-lg">
                <Clock size={18} className="sm:w-5 sm:h-5" />
                <span>{formatTime(timer)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMainButton}
              className={`w-full py-3 sm:py-4 font-bold rounded-3xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 text-sm sm:text-base ${canResend
                ? 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 backdrop-blur-sm text-white border-blue-400/50 hover:from-blue-600/90 hover:to-blue-700/90'
                : isCodeComplete
                  ? 'bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-sm text-white border-green-400/50 hover:from-green-600/90 hover:to-green-700/90'
                  : 'bg-black/80 backdrop-blur-sm text-white border-white/10 hover:bg-black/90'
                }`}
            >
              {canResend ? 'ارسال مجدد کد تایید' : 'تایید کد'}
            </button>

            <div className="text-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
              <button
                onClick={() => navigate(`/${slug}/home`)}
                className="bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm text-black px-4 sm:px-6 py-2 sm:py-3 rounded-3xl text-sm sm:text-base
                hover:from-gray-500/50 hover:via-gray-600/40 hover:to-gray-700/50 hover:text-black/90 transition-all duration-300 border border-black/20"
              >
                بازگشت
              </button>
            </div>
          </div>

          <div className="absolute -top-2 -right-2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg"></div>
        </div>
      </div>

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

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md mx-4 w-full">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none"></div>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-green-500/80 to-green-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-400/50">
                <CheckCircle size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-black">موفق!</h3>
              <p className="text-black/80 text-sm sm:text-base">کد با موفقیت تأیید شد</p>
            </div>
          </div>
        </div>
      )}

      {showResendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md mx-4 w-full">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none"></div>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-blue-500/80 to-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/50">
                <CheckCircle size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-black">ارسال شد!</h3>
              <p className="text-black/80 text-sm sm:text-base">کد جدید ارسال شد</p>
              <button
                onClick={() => setShowResendModal(false)}
                className="bg-gradient-to-r from-blue-500/80 to-blue-600/80 backdrop-blur-sm text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-3xl hover:from-blue-600/90 hover:to-blue-700/90 transition-all duration-300 transform hover:scale-105 border border-blue-400/50 text-sm sm:text-base"
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

export default OTPForm;