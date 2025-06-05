import React, { useState } from "react";
import { Search } from 'lucide-react';

const Header = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // وضعیت باز و بسته بودن نوار نوتیفیکیشن
    const [isProfileOpen, setIsProfileOpen] = useState(false); // وضعیت باز و بسته بودن منوی پروفایل
    const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false); // وضعیت نمایش دیالوگ تایید خروج
    const [notificationsCount, setNotificationsCount] = useState(50); // تعداد نوتیفیکیشن‌ها

    // تابع برای باز و بسته کردن نوار نوتیفیکیشن
    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    // تابع برای باز و بسته کردن منوی پروفایل
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    // تابع برای نمایش دیالوگ تایید خروج
    const handleLogout = () => {
        setIsLogoutConfirmationOpen(true); // نمایش دیالوگ تایید خروج
    };

    // تابع برای تایید خروج و هدایت به صفحه login
    const confirmLogout = () => {
        // اینجا می‌توانید منطق خروج از حساب را بنویسید (مثل پاک کردن sessionStorage یا logout از API)
        console.log("Logout confirmed");
        // navigate("/login"); // هدایت به صفحه login
    };

    // تابع برای لغو خروج
    const cancelLogout = () => {
        setIsLogoutConfirmationOpen(false); // مخفی کردن دیالوگ تایید خروج
    };

    return (
        <div className="bg-gradient-to-l from-[#1E212D] via-[#2E3A55] to-[#626C93] text-white flex items-center justify-between p-4 relative z-50">
            {/* بخش چپ: پیام خوش آمد */}
            <div className="flex flex-col text-right">
                <div className="flex gap-1">
                    <img src="/TradePageimages/shop_logo.png" alt="logo" className="w-8 h-8 mt-1" />
                    <h1 className="font-jua text-2xl text-[#EABF9F]">Trade Hub</h1>
                </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Hinted search text"
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 text-gray-900 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
                    />
                </div>
            </div>

            {/* بخش راست: آیکن‌ها */}
            <div className="flex items-center space-x-4">
                {/* آیکن نوتیفیکیشن */}
                <div className="relative">
                    <img
                        src='/SellerPanel/notif.png'
                        className="text-white text-xl cursor-pointer"
                        onClick={toggleNotifications} // کلیک روی آیکن برای باز و بسته کردن نوار
                    />
                    <span className="absolute top-0 right-0 bg-[#1E212D] text-[#EABF9F] text-sm font-krona font-semibold rounded-full px-1">{notificationsCount}</span>

                    {/* نوار نوتیفیکیشن */}
                    {isNotificationsOpen && (
                        <div className="absolute left-0 mt-2 w-96 bg-white text-black rounded-lg shadow-lg max-h-60 overflow-y-auto z-[60]">
                            <h3 className="font-semibold my-5 mr-7">آخرین نوتیفیکیشن‌ها</h3>
                            <ul>
                                <li className="py-5 px-4 border-b border-gray-200">سفارش جدید از فروشگاه 1</li>
                                <li className="py-5 px-4 border-b border-gray-200">محصول جدید اضافه شد</li>
                                <li className="py-5 px-4 border-b border-gray-200">یک مشتری جدید ثبت‌نام کرد</li>
                                <li className="py-5 px-4 border-b border-gray-200">مقدار موجودی انبار کاهش یافت</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* آیکن پروفایل */}
                <div className="relative">
                    <img
                        src='/SellerPanel/shop-icon.png'
                        className="text-white text-3xl cursor-pointer"
                        onClick={toggleProfile} // کلیک روی آیکن پروفایل برای باز کردن منو
                    />

                    {/* منوی پروفایل */}
                    {isProfileOpen && (
                        <div className="absolute left-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg p-4 z-[60]">
                            <div className="font-semibold mb-2">ایمیل فروشنده:</div>
                            <div className="text-sm text-gray-700 mb-4">seller@example.com</div> {/* ایمیل فروشنده */}
                            <button
                                onClick={handleLogout} // دکمه خروج برای نمایش تاییدیه خروج
                                className="w-full py-2 bg-red-500 text-white rounded-lg"
                            >
                                خروج از حساب
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* دیالوگ تایید خروج */}
            {isLogoutConfirmationOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[70]">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                        <h2 className="font-semibold text-black mb-4 font-krona">آیا از خروج اطمینان دارید؟</h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                            >
                                بله
                            </button>
                            <button
                                onClick={cancelLogout}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                خیر
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;