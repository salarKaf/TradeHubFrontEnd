import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Clock, CheckCircle, XCircle } from 'lucide-react';

const OTPForm = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState('user@example.com'); // Mock email

  // Timer effect
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

  // Format timer to MM:SS
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

      // Auto focus next input (left to right)
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
        // Clear current input
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
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

      // Focus the next empty input or the last one
      const nextIndex = Math.min(digits.length, 5);
      const nextInput = document.getElementById(`otp-${nextIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      const otpCode = otp.join('');
      console.log('Verifying OTP:', otpCode);
      
      // Simulate API call
      setTimeout(() => {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          console.log('Redirecting to next page...');
        }, 2500);
      }, 1000);

    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) {
      alert("لطفاً تا پایان زمان صبر کنید!");
      return;
    }

    try {
      console.log('Resending OTP to:', email);
      setTimer(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      alert("کد مجدداً ارسال شد!");
    } catch (err) {
      console.error('Resend failed:', err);
    }
  };

  const handleMainButton = () => {
    if (canResend) {
      handleResendCode();
    } else {
      const otpCode = otp.join('');
      if (otpCode.length !== 6) {
        setShowErrorModal(true);
        return;
      }
      handleSubmit();
    }
  };

  const isCodeComplete = otp.every(digit => digit !== '');

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
        <div className="w-10 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">V</span>
        </div>
      </div>

      {/* Form container */}
      <div className="flex justify-center items-center min-h-screen">
        {/* Glassmorphism container */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-lg font-rubik">
          {/* Enhanced inner glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-white/20 pointer-events-none"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-black mb-2">تایید کد امنیتی</h1>
              <p className="text-black/80 text-sm">
                کد 6 رقمی ارسال شده به ایمیل {email} را وارد کنید
              </p>
            </div>

            {/* OTP Input Fields */}
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
                  className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm border-2 border-black/60 text-black
                  transition-all duration-300 ease-in-out focus:scale-[1.03] 
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-black/80"
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

            {/* Main Action Button */}
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
            >
              {canResend ? 'ارسال مجدد کد تایید' : 'تایید کد'}
            </button>

            {/* Back to Login */}
            <div className="text-center mt-6 pt-6 border-t border-white/20">
              <button
                onClick={() => console.log('Back to login')}
                className="bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-gray-600/40 backdrop-blur-sm text-black px-6 py-3 rounded-3xl 
                hover:from-gray-500/50 hover:via-gray-600/40 hover:to-gray-700/50 hover:text-black/90 transition-all duration-300 border border-black/20"
              >
                بازگشت به ورود
              </button>
            </div>
          </div>

          {/* Additional decorative elements */}
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg"></div>
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-8 rounded-2xl shadow-2xl max-w-md mx-4">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500/80 to-green-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-400/50">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-black">تبریک!</h3>
              <p className="text-black/80">کد با موفقیت تأیید شد. ثبت‌نام شما کامل شد.</p>
              <p className="text-sm text-black/60">در حال انتقال به صفحه بعدی...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPForm;