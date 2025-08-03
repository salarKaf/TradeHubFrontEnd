import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Slug() {
    const [slug, setSlug] = useState("");
    const [nameError, setNameError] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUnauthorized(true);
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        }
    }, []);

    const handleSubmit = async () => {
        if (!slug.trim()) {
            setNameError(true);
            setStatusMsg("لطفاً یک آدرس معتبر وارد کنید");
            setShowModal(true);
            return;
        }

        try {
            setLoading(true);
            setStatusMsg("");
            const token = localStorage.getItem("token");
            const websiteId = localStorage.getItem("website_id");
            const res = await fetch("https://core-tradehub.liara.run/api/v1/slug/slug", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    website_id: websiteId,
                    slug: slug.trim(),
                }),
            });

            if (res.ok) {
                setStatusMsg("✅ اسلاگ با موفقیت ذخیره شد!");
                setShowModal(true);
                setTimeout(() => {
                    navigate(`/PricingPlans/${websiteId}`);
                }, 2000);
            } else {
                const data = await res.json();
                setStatusMsg(`❌ خطا: ${data.message || "ثبت اسلاگ ناموفق بود"}`);
                setShowModal(true);
            }
        } catch (error) {
            setStatusMsg("❌ خطای شبکه یا سرور.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    if (unauthorized) {
        return (
            <div className="min-h-screen bg-[#1E212D] flex items-center justify-center text-center p-6">
                <div className="bg-[#2c2f45] text-[#EABF9F] border border-[#EABF9F] rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">⛔ دسترسی غیرمجاز</h2>
                    <p className="text-lg font-rubik">برای دسترسی به این بخش ابتدا وارد شوید</p>
                    <p className="text-sm text-gray-400 mt-2">درحال انتقال به صفحه ورود...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[linear-gradient(to_bottom,_#1E212D_0%,_#1E212D_35%,_#626C93_100%)] font-rubik">
            {/* حباب‌های تزئینی */}
            <div className="absolute w-64 h-64 bg-[#ddb19cb2] opacity-20 rounded-full blur-xl top-4 right-20 animate-bubble4" />
            <div className="absolute w-80 h-80 bg-[#eac09fb2] opacity-20 rounded-full blur-xl top-4 left-36 animate-bubble1" />
            <div className="absolute w-60 h-60 bg-[#525A7B] opacity-100 rounded-full blur-3xl bottom-20 right-20 animate-bubble2" />
            <div className="absolute w-52 h-52 bg-[#b6897353] opacity-35 rounded-full blur-2xl top-1/2 left-20 animate-bubble3" />
            <div className="absolute w-48 h-48 bg-[#faf3e061] opacity-15 rounded-full blur-3xl bottom-10 left-1/3 animate-bubble4" />

            <div className="relative w-full max-w-3xl">
                <div className="absolute -top-6 -right-6 w-full h-full rounded-3xl bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-xl z-0" />
                <div className="absolute -top-3 -right-3 w-full h-full rounded-3xl bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-xl z-10" />

                <div className="relative z-20 bg-[#8D8D8D33] border border-[#00000080] backdrop-blur-xl shadow-2xl rounded-3xl p-10 space-y-6 text-right text-[#EABF9F]">
                    {/* فیلد نام فروشگاه */}
                    <div className="flex flex-col items-end w-full gap-2">
                        <div className="flex items-center justify-between w-full">
                            <label className="text-white font-bold text-base">
                                آدرس فروشگاه خود را وارد کنید
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => {
                                    setSlug(e.target.value);
                                    setNameError(false);
                                }}
                                placeholder="----------------------"
                                className={`text-black w-80 px-4 py-3 rounded-xl border ${nameError ? "border-red-500" : "border-[#EABF9F]"
                                    } placeholder:text-black placeholder:opacity-50 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#EABF9F]`}
                            />
                        </div>

                        <p className="text-[#EABF9F] text-sm font-light text-right w-full pr-1">
                            لطفاً یک آدرس کوتاه و یونیک برای فروشگاه خود انتخاب کنید
                        </p>
                    </div>



                    {/* دکمه‌ها */}
                    <div className="flex justify-between pt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="relative flex items-center justify-center bg-[#EABF9F] text-[#1E1E1E] px-6 py-2 rounded-full font-bold transition-all duration-200 hover:bg-[#e7b78e] hover:scale-105 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "در حال ارسال..." : "ساخت"}
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.location.href = "/";
                            }}
                            className="bg-[#EABF9F] text-[#1E1E1E] px-6 py-2 rounded-full font-bold transition-all duration-200 hover:bg-[#e7b78e] hover:scale-105 hover:shadow-lg"
                        >
                            خروج
                        </button>
                    </div>
                </div>
            </div>

            {/* مدال پیام‌ها */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-[#2c2f45] text-[#EABF9F] rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
                        <p className="text-lg font-semibold">{statusMsg}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 bg-[#EABF9F] text-[#1E1E1E] px-4 py-1 rounded-full hover:bg-[#e7b78e] font-bold"
                        >
                            بستن
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
