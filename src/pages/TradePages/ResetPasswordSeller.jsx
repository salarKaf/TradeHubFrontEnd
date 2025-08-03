import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordWithOTP } from "/src/API/auth.jsx";

export default function ResetPasswordSeller() {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        new_password: "",
        confirm_password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const email = location.state?.email;
    const otp = location.state?.otp;

    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password");
        }
    }, [email, otp, navigate]);

    const validatePassword = (password) => {
        if (password.length < 3) {
            return "رمز عبور باید حداقل 3 کاراکتر باشد";
        }
        return null;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!formData.new_password || !formData.confirm_password) {
            setErrorMsg("لطفاً همه فیلدها را پر کنید");
            return;
        }

        const passwordError = validatePassword(formData.new_password);
        if (passwordError) {
            setErrorMsg(passwordError);
            return;
        }

        if (formData.new_password !== formData.confirm_password) {
            setErrorMsg("رمز عبور و تایید آن مطابقت ندارند");
            return;
        }

        setIsLoading(true);

        try {
            await resetPasswordWithOTP({
                email: email,
                new_password: formData.new_password,
                confirm_password: formData.confirm_password
            });

            setShowSuccessModal(true);

            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (error) {
            const detail = error.message;
            setErrorMsg(detail || "خطا در تغییر رمز عبور. لطفاً مجدداً تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    };

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
                        <h2 className="text-lg text-[#EABF9F] font-rubik">تعیین رمز عبور جدید</h2>
                        <div className="relative inline-block w-fit">
                            <div className="relative w-fit">
                                <div
                                    className="absolute w-4 h-4 bg-[#EABF9F] rounded-full blur-sm z-0"
                                    style={{ top: "17px", right: "230px" }}
                                ></div>
                                <h1 className="relative z-10 text-2xl md:text-4xl font-rubik font-bold text-FAF3E0">
                                    رمز عبور جدید
                                </h1>
                            </div>
                        </div>
                        <p className="text-sm font-rubik text-gray-300">
                            رمز عبور جدید خود را وارد کنید
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-100 border border-red-400 text-red-800 text-sm rounded px-4 py-2 font-rubik">
                            {errorMsg}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="رمز عبور جدید"
                                value={formData.new_password}
                                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                className="w-full h-12 px-4 py-2 pl-10 rounded-xl bg-[#EABF9F] font-rubik font-medium text-[#1E212D]
                                border border-[#EABF9F] placeholder:text-[#1E212D] placeholder:font-rubik placeholder:font-medium
                                transition-all duration-300 ease-in-out focus:scale-[1.03] focus:ring-2 focus:ring-[#1E212D]"
                            />
                            <button
                                type="button"
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="#1E212D"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c1.83 0 3.548.508 5.025 1.382M21.542 12c-1.274 4.057-5.065 7-9.542 7-1.83 0-3.548-.508-5.025-1.382" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="#1E212D"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.236 0 2.409.236 3.467.663M15 12a3 3 0 11-6 0 3 3 0 016 0zm3.536-6.536L4.5 19.5" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="تایید رمز عبور جدید"
                                value={formData.confirm_password}
                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                className="w-full h-12 px-4 py-2 pl-10 rounded-xl bg-[#EABF9F] font-rubik font-medium text-[#1E212D]
                                border border-[#EABF9F] placeholder:text-[#1E212D] placeholder:font-rubik placeholder:font-medium
                                transition-all duration-300 ease-in-out focus:scale-[1.03] focus:ring-2 focus:ring-[#1E212D]"
                            />
                            <button
                                type="button"
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="#1E212D"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c1.83 0 3.548.508 5.025 1.382M21.542 12c-1.274 4.057-5.065 7-9.542 7-1.83 0-3.548-.508-5.025-1.382" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="#1E212D"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.236 0 2.409.236 3.467.663M15 12a3 3 0 11-6 0 3 3 0 016 0zm3.536-6.536L4.5 19.5" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-48 border-2 border-[#EABF9F] text-[#EABF9F] font-bold py-2 rounded-full transition-all flex justify-center items-center gap-2 
                                ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#EABF9F] hover:text-[#1E1E1E]'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>در حال تغییر...</span>
                                    </>
                                ) : (
                                    "تغییر رمز عبور"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center pt-6 border-t border-gray-700 border-opacity-30">
                        <button
                            onClick={() => navigate("/forgot-password-otp", { state: { email } })}
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

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-[#1E212D] rounded-2xl p-8 max-w-md mx-4 border border-[#EABF9F] shadow-2xl text-center">
                        <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M16 12l-4 4-2-2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-rubik font-bold text-[#EABF9F] mt-4">موفقیت آمیز!</h3>
                        <p className="text-[#FAF3E0] font-rubik">رمز عبور شما با موفقیت تغییر یافت.</p>
                        <p className="text-sm text-gray-400 mt-2">در حال انتقال به صفحه ورود...</p>
                    </div>
                </div>
            )}
        </>
    );
}