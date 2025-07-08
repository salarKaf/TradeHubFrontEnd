import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function SignupForm() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault(); // جلو گیری از reload شدن صفحه

        // بررسی اینکه پسوردها یکی هستن
        if (formData.password !== formData.confirmPassword) {
            alert("رمز عبور و تکرار آن یکسان نیست.");
            return;
        }

        try {
            // اینجا axios اطلاعات رو می‌فرسته
            const response = await axios.post("http://10.14.18.74:8000/api/v1/users/Register", {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                confirm_password: formData.confirmPassword
            });


            // اگر موفق بود
            alert("ثبت‌نام موفقیت‌آمیز بود!");
            navigate("/OTPForm");

        } catch (error) {
            // اگر خطایی از سمت سرور اومد
            const message = error.response?.data?.message || "خطا در ثبت‌نام";
            alert(message);
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

            <Link to='/storeForm'>meweeeeeeeeeeeeeeeeeeeeeeee</Link>


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
                            در حال حاضر حساب دارید؟{" "}
                            <Link to="/login" className="text-[#EABF9F] font-medium font-rubik hover:underline">
                                وارد شوید.
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex gap-3 mt-10">
                            <InputWithIcon
                                placeholder="نام"
                                icon="/TradePageimages/icons8-id-verified.png"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                            <InputWithIcon
                                placeholder="نام خانوادگی"
                                icon="/TradePageimages/icons8-id-verified.png"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                        </div>
                        <InputWithIcon
                            placeholder="ایمیل"
                            icon="/TradePageimages/icons8-email.png"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <div className="flex gap-4">
                            <PasswordInput
                                placeholder="رمز عبور"
                                show={showConfirmPassword}
                                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                value={setFormData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <PasswordInput
                                placeholder="تکرار رمز عبور"
                                show={showPassword}
                                toggle={() => setShowPassword(!showPassword)}
                                value={setFormData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                className="w-40 border-2 border-[#EABF9F] text-[#EABF9F] font-bold py-2 rounded-full hover:bg-[#EABF9F] hover:text-[#1E1E1E] transition-all"
                            >
                                ایجاد حساب
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

function InputWithIcon({ placeholder, icon, type = "text", value, onChange }) {
    return (
        <div className="flex-1 relative">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full h-12 px-4 py-2 pl-10 rounded-xl bg-[#EABF9F] text-[#1E212D] font-rubik font-medium placeholder:text-[#1E212D]
                placeholder:font-rubik placeholder:text-base transition-all duration-300 ease-in-out focus:scale-[1.03] 
                focus:outline-none focus:ring-2 focus:ring-[#1E212D] border border-[#1E212D]"
            />
            <img src={icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" alt="icon" />
        </div>
    );
}

function PasswordInput({ placeholder, show, toggle, value, onChange }) {
    return (
        <div className="flex-1 relative">
            <input
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full h-12 px-4 py-2 pl-10 rounded-xl bg-[#EABF9F] text-[#1E212D] font-rubik font-medium placeholder:text-[#1E212D]
                placeholder:font-rubik placeholder:text-base transition-all duration-300 ease-in-out focus:scale-[1.03] 
                focus:outline-none focus:ring-2 focus:ring-[#1E212D] border border-[#1E212D]"
            />
            <button type="button" onClick={toggle} className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#1E212D"
                    className="w-5 h-5"
                >
                    {show ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.236 0 2.409.236 3.467.663M15 12a3 3 0 11-6 0 3 3 0 016 0zm3.536-6.536L4.5 19.5" />
                    )}
                </svg>
            </button>
        </div>
    );
}
