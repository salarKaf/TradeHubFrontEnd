import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyForgotPasswordOTP, sendForgotPasswordOTP } from "/src/API/auth.jsx";

export default function ForgotPasswordOTPSeller() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(120); // 2 minutes
    const [canResend, setCanResend] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const email = location.state?.email;

    // اگر ایمیل نداشت، برگرد به صفحه قبل
    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

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

            // Auto focus next input
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
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setShowErrorModal(true);
            return;
        }

        setIsLoading(true);
        try {
            await verifyForgotPasswordOTP({ otp: otpCode, email });
            
            // انتقال به صفحه تغییر رمز عبور
            navigate("/reset-password", { 
                state: { 
                    email: email, 
                    otp: otpCode 
                } 
            });
            
        } catch (error) {
            alert(error.message || "کد تایید اشتباه است");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!canResend) {
            alert("لطفاً تا پایان زمان صبر کنید!");
            return;
        }

        try {
            await sendForgotPasswordOTP(email);
            setTimer(120);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            alert("کد مجدداً ارسال شد!");
        } catch (error) {
            alert(error.message || "خطا در ارسال مجدد کد");
        }
    };

    const handleMainButton = () => {
        if (canResend) {
            handleResendCode();
        } else {
            handleSubmit();
        }
    };

    const isCodeComplete = otp.every(digit => digit !== '');

    return (
        <>
            <div className="absolute top-7 right-14 flex justify-start cursor-pointer z-20 gap-32">
                <div className="flex gap-1">
                    <img src="/TradePageimages/shop_logo.png" alt="logo" className="w-5 h-5 mt-1" />
                    <h1 className="font-jua text-lg text-[#EABF9F]">Trade Hub</h1>
                </div>
                <a href="/" className="text-[#FAF3E0] text-lg font-rubik hover:underline">خانه</a>
            </div>

            <div
                className="min-h-screen relative flex items-center justify-start px-8"
                style={{
                    backgroundImage: "url('/TradePageimages/BG_signup.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "100% 100%",
                    backgroundColor: "black",
                }}
            >
                <svg
                    className="absolute top-0 bottom-0 h-full"
                    style={{ right: "51%", zIndex: 10 }}
                    width="259"
                    height="100%"
                    viewBox="0 0 259 1024"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M211.111 -0.536259C211.111 -0.536259 -67.6007 143.726 17.8696 266.149C103.34 388.573 186.172 309.872 245.551 497.527C304.931 685.181 129.951 659.737 82.0521 759.527C34.1535 859.316 169.555 1024.03 169.555 1024.03"
                        stroke="#FAF3E0"
                        strokeWidth="2"
                        strokeDasharray="10 10"
                    />
                </svg>

                <div className="w-full max-w-lg space-y-6 p-8 rounded-3xl text-[#FAF3E0]">
                    <div className="space-y-3 mt-12">
                        <div className="relative inline-block w-fit">
                            <div className="relative w-fit">
                                <div
                                    className="absolute w-4 h-4 bg-[#EABF9F] rounded-full blur-sm z-0"
                                    style={{ top: "17px", right: "240px" }}
                                ></div>
                                <h1 className="relative z-10 text-2xl md:text-4xl font-rubik font-bold text-FAF3E0">
                                    تایید کد بازیابی
                                </h1>
                            </div>
                        </div>
                        <p className="text-sm font-rubik text-gray-300">
                            کد 6 رقمی ارسال شده به ایمیل {email} را وارد کنید
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-center gap-3 mt-10" dir="ltr">
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
                                    className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-[#EABF9F] text-[#1E212D] font-rubik
                                    transition-all duration-300 ease-in-out focus:scale-[1.03] 
                                    focus:outline-none focus:ring-2 focus:ring-[#1E212D] border border-[#1E212D]"
                                />
                            ))}
                        </div>

                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-[#EABF9F] font-rubik text-lg font-bold">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12,6 12,12 16,14" />
                                </svg>
                                {formatTime(timer)}
                            </div>

                            <div className="space-y-3 flex justify-center   ">
                                <button
                                    type="button"
                                    onClick={handleMainButton}
                                    disabled={isLoading}
                                    className={`font-rubik font-bold w-64 py-3 rounded-full transition-all duration-300 transform hover:scale-105 border-2 flex justify-center items-center gap-2
                                    ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
                                    ${canResend
                                        ? 'bg-[#EABF9F] text-[#1E212D] hover:bg-[#d4a374] border-[#EABF9F]'
                                        : isCodeComplete
                                            ? 'bg-[#EABF9F] text-[#1E212D] hover:bg-[#d4a374] border-[#EABF9F]'
                                            : 'bg-transparent text-[#EABF9F] hover:bg-[#EABF9F] hover:text-[#1E212D] border-[#EABF9F]'
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>در حال بررسی...</span>
                                        </>
                                    ) : canResend ? 'ارسال مجدد کد تایید' : 'تایید کد'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-8 border-t border-gray-700 border-opacity-30">
                        <button
                            onClick={() => navigate("/forgot-password")}
                            className="bg-gray-700 bg-opacity-50 text-gray-300 font-rubik px-6 py-2 rounded-full 
                            hover:bg-gray-600 hover:text-[#EABF9F] transition-all duration-300 border border-gray-600"
                        >
                            بازگشت
                        </button>
                    </div>
                </div>
            </div>

            <img
                src="/TradePageimages/icon-cart-shop.png"
                alt="logo"
                className="absolute bottom-6 left-6 w-20 h-auto z-10"
            />

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-[#1E212D] rounded-2xl p-8 max-w-md mx-4 border border-[#EABF9F] shadow-2xl">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-rubik font-bold text-[#EABF9F]">خطا!</h3>
                            <p className="text-[#FAF3E0] font-rubik">لطفاً کد 6 رقمی را کامل وارد کنید</p>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="bg-[#EABF9F] text-[#1E212D] font-rubik font-bold px-6 py-2 rounded-full hover:bg-[#d4a374] transition-all duration-300 transform hover:scale-105"
                            >
                                متوجه شدم
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}