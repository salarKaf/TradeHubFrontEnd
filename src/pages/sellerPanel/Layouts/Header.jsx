import { getActivePlan } from '../../../API/website';
import { getMe } from '../../../API/auth';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestAnnouncements } from '../../../API/dashboard';
import { Menu, X } from 'lucide-react';

const Header = ({ isSidebarOpen, toggleSidebar, isMobile }) => {
  const [planData, setPlanData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(50);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const websiteId = localStorage.getItem("website_id");
        const [plan, me] = await Promise.all([
          getActivePlan(websiteId),
          getMe()
        ]);
        setPlanData(plan);
        setUserEmail(me.email);
        const announcements = await getLatestAnnouncements(websiteId);
        const filtered = announcements.filter(a => a.text);

        setNotifications(filtered);
        setNotificationsCount(filtered.length);

      } catch (error) {
        console.error("❌ خطا در دریافت اطلاعات:", error);
        navigate("/login");
      }
    };

    fetchAllData();
  }, [navigate]);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    setIsLogoutConfirmationOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const cancelLogout = () => {
    setIsLogoutConfirmationOpen(false);
  };

  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-gradient-to-l from-[#1E212D] via-[#2E3A55] to-[#626C93] text-white flex items-center justify-between p-4 relative z-50 min-h-[80px]">

      {/* بخش سمت چپ - پلن فعال */}
      <div className="flex items-center flex-1 lg:flex-none">
        <button className="bg-gradient-to-r from-[#EABF9F] to-[#D4A574] text-[#1E212D] px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-semibold text-xs lg:text-sm shadow-md flex items-center gap-1 lg:gap-2">
          {!planData ? (
            <>
              <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-[#1E212D] border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden sm:inline">در حال بارگذاری...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <span className="truncate max-w-[80px] lg:max-w-none">{planData.plan?.name}</span>
              <span className="hidden sm:inline opacity-60">|</span>
              <span className="text-xs lg:text-sm">
                {getDaysRemaining(planData.expires_at) > 0
                  ? `${getDaysRemaining(planData.expires_at)} روز مانده`
                  : "منقضی"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* لوگو - وسط */}
      <div className="flex items-center justify-center flex-1">
        <img src="/TradePageimages/shop_logo.png" alt="logo" className="w-8 h-8 lg:w-10 lg:h-10 hidden lg:block" />
        <h1 className="font-jua text-xl lg:text-4xl text-[#EABF9F] font-semibold lg:ml-2">
          Trade Hub
        </h1>
      </div>

      {/* بخش سمت راست - همبرگر منو، پروفایل و نوتیفیکیشن */}
      <div className="flex items-center justify-end space-x-2 lg:space-x-4 flex-1 lg:flex-none">
        
        {/* دکمه همبرگر منو - فقط موبایل */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="bg-[#EABF9F] text-[#1E212D] p-2 rounded-lg shadow-lg lg:hidden ml-2"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        {planData?.plan?.name === "Pro" && (
          <div className="relative">
            <img
              src='/SellerPanel/notif.png'
              className="text-white text-xl cursor-pointer w-8 h-8 lg:w-12 lg:h-12"
              onClick={toggleNotifications}
            />
            <span className="absolute -top-1 -right-1 lg:top-0 lg:right-0 bg-[#1E212D] text-[#EABF9F] text-xs lg:text-sm font-krona font-semibold rounded-full px-1 min-w-[20px] text-center">
              {notificationsCount > 99 ? '99+' : notificationsCount}
            </span>

            {isNotificationsOpen && (
              <div className="absolute left-0 top-10 lg:top-14 w-80 lg:w-96 z-[60]">
                {/* مثلث بالا */}
                <div className="absolute top-[-9px] left-4 w-4 h-4 bg-white/30 border border-white/40 rotate-45 rounded-sm shadow-md z-[-1]"></div>

                {/* باکس اصلی نوتیف */}
                <div className="backdrop-blur-md bg-white/30 border border-white/40 text-black rounded-xl shadow-2xl max-h-60 overflow-y-auto p-4">
                  <h3 className="font-semibold mb-4 text-sm lg:text-base">آخرین نوتیفیکیشن‌ها</h3>
                  <ul>
                    {notifications.length > 0 ? (
                      notifications.map((item, idx) => (
                        <li key={idx} className="py-3 lg:py-4 border-b border-white/30 text-xs lg:text-sm">
                          دیدگاه جدید برای <span className="font-semibold">{item.text}</span> ثبت شد
                          <div className="text-xs text-gray-100/60 mt-1">{item.date}</div>
                        </li>
                      ))
                    ) : (
                      <li className="py-4 text-gray-200 text-xs lg:text-sm">اعلان جدیدی نیست</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <img
            src='/SellerPanel/shop-icon.png'
            className="text-white text-3xl cursor-pointer w-8 h-8 lg:w-10 lg:h-10"
            onClick={toggleProfile}
          />

          {isProfileOpen && (
            <div className="absolute left-2 mt-0 w-56 lg:w-64 bg-white text-black rounded-lg shadow-lg p-4 z-[60]">
              <div className="font-semibold mb-2 text-sm lg:text-base">ایمیل فروشنده:</div>
              <div className="text-xs lg:text-sm text-gray-700 mb-4 break-all">
                {userEmail ? userEmail : "در حال دریافت..."}
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm lg:text-base"
              >
                خروج از حساب
              </button>
            </div>
          )}
        </div>
      </div>

      {/* مدال تایید خروج */}
      {isLogoutConfirmationOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[70] p-4">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-lg w-full max-w-sm lg:w-80 text-center">
            <h2 className="font-semibold text-black mb-4 font-krona text-sm lg:text-base">
              آیا از خروج اطمینان دارید؟
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm lg:text-base"
              >
                بله
              </button>
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm lg:text-base"
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