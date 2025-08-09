import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendForgotPasswordOTP } from "/src/API/auth.jsx";

export default function ForgotPasswordSeller() {
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setErrorMsg("لطفاً ایمیل خود را وارد کنید");
            return;
        }

        setErrorMsg(null);
        setIsLoading(true);

        try {
            await sendForgotPasswordOTP(email);
            
            navigate("/forgot-password-otp", { 
                state: { email: email } 
            });
            
        } catch (error) {
            const detail = error.message;
            setErrorMsg(detail || "خطا در ارسال کد. لطفاً مجدداً تلاش کنید.");
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
                        <h2 className="text-lg text-[#EABF9F] font-rubik">فراموشی رمز عبور</h2>
                        <div className="relative inline-block w-fit">
                            <div className="relative w-fit">
                                <div
                                    className="absolute w-4 h-4 bg-[#EABF9F] rounded-full blur-sm z-0"
                                    style={{ top: "17px", right: "240px" }}
                                ></div>
                                <h1 className="relative z-10 text-2xl md:text-4xl font-rubik font-bold text-FAF3E0">
                                    بازیابی رمز عبور
                                </h1>
                            </div>
                        </div>
                        <p className="text-sm font-rubik text-gray-300">
                            ایمیل خود را وارد کنید تا کد تایید برایتان ارسال شود
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
                                type="email"
                                placeholder="ایمیل"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 px-4 py-2 pl-10 rounded-xl bg-[#EABF9F] font-rubik font-medium text-[#1E212D]
                                border border-[#EABF9F] placeholder:text-[#1E212D] placeholder:font-rubik placeholder:font-medium 
                                transition-all duration-300 ease-in-out focus:scale-[1.03] focus:ring-2 focus:ring-[#1E212D]"
                            />
                            <img
                                src="/TradePageimages/icons8-email.png"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                                alt="email icon"
                            />
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
                                        <span>در حال ارسال...</span>
                                    </>
                                ) : (
                                    "ارسال کد تایید"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="flex justify-center text-center pt-6 border-t border-gray-700 border-opacity-30">
                        <p className="text-sm font-rubik text-gray-300 mb-4 ml-2">
                            رمز عبور خود را به یاد آوردید؟
                        </p>
                        <Link 
                            to="/login" 
                            className="text-[#EABF9F] font-medium font-rubik hover:underline"
                        >
                            بازگشت به ورود
                        </Link>
                    </div>
                </div>
            </div>

            <img
                src="/TradePageimages/icon-cart-shop.png"
                alt="logo"
                className="absolute bottom-6 left-6 w-20 h-auto z-10"
            />
        </>
    );
}