import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "/src/API/auth.jsx";
import { getMyWebsite, getActivePlan } from "/src/API/website"; // ⬅️ اضافه کردن getActivePlan

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        try {
            const data = await login({
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem("token", data.access_token);

            // بعد از ورود، بررسی می‌کنیم آیا فروشگاه وجود دارد یا نه
            const website = await getMyWebsite();

            if (website?.id) {
                localStorage.setItem("website_id", website.id);
                
                // چک کردن پلن فعال
                try {
                    const activePlan = await getActivePlan(website.id);
                    
                    if (activePlan === null) {
                        // هیچ پلن فعالی نداره، بره صفحه قیمت‌گذاری
                        navigate(`/PricingPlans/${website.id}`);
                    } else {
                        // پلن فعال داره (basic یا pro)، بره داشبورد
                        navigate(`/HomeSeller/${website.id}`);
                    }
                } catch (planError) {
                    console.error('Error checking active plan:', planError);
                    // در صورت خطا، بره صفحه قیمت‌گذاری
                    navigate(`/PricingPlans/${website.id}`);
                }
            } else {
                // فروشگاه نداره، بره صفحه ساخت فروشگاه
                navigate("/StoreForm");
            }
        } catch (error) {
            const detail = error.response?.data?.detail;

            if (detail === "User is not verified") {
                setErrorMsg("حساب شما هنوز تأیید نشده است. لطفاً ایمیل‌تان را تأیید کنید.");
                setTimeout(() => {
                    navigate("/OTPForm", { state: { email: formData.email, fromLogin: true } });
                }, 1500);
            } else {
                setErrorMsg(detail || "خطا در ورود. لطفاً اطلاعات را بررسی کنید.");
            }
        }
    };

    return (
        <>
            <div className="absolute top-7 right-14 flex justify-start cursor-pointer z-20  gap-32">
                <div className="flex gap-1">
                    <img src="/TradePageimages/shop_logo.png" alt="logo" className="w-5 h-5 mt-1" />
                    <h1 className="font-jua  text-lg text-[#EABF9F]"> Trade Hub</h1>
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
                        <h2 className="text-lg text-[#EABF9F] font-rubik">به طور رایگان فروشگاه خود را بسازید!</h2>
                        <div className="relative inline-block w-fit">
                            <div className="relative w-fit">
                                <div
                                    className="absolute w-4 h-4 bg-[#EABF9F] rounded-full blur-sm z-0"
                                    style={{ top: "17px", right: "318px" }}
                                ></div>
                                <h1 className="relative z-10 text-2xl md:text-4xl font-rubik font-bold text-FAF3E0">
                                    ساخت حساب جدید
                                </h1>
                            </div>
                        </div>
                        <p className="text-sm font-rubik text-gray-300">
                            در حال حاضر حسابی ندارید؟{" "}
                            <Link to="/signUp" className="text-[#EABF9F] font-medium font-rubik hover:underline">
                                ثبت نام کنید.
                            </Link>
                        </p>
                    </div>

                    {/* 🔴 نمایش خطا */}
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
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="رمز عبور"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                className="w-40 border-2 border-[#EABF9F] text-[#EABF9F] font-bold py-2 rounded-full hover:bg-[#EABF9F] hover:text-[#1E1E1E] transition-all"
                            >
                                وارد شوید
                            </button>
                        </div>
                    </form>
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