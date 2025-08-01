import { getActivePlan } from '../../../API/website'; // مسیر فایل API رو بذار
import { getMe } from '../../../API/auth';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestAnnouncements } from '../../../API/dashboard';

const Header = () => {
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
        const filtered = announcements.filter(a => a.text); // فقط اونایی که متن دارن

        setNotifications(filtered);
        setNotificationsCount(filtered.length); // شمارش

      } catch (error) {
        console.error("❌ خطا در دریافت اطلاعات:", error);
        navigate("/login"); // اگر توکن مشکل داشت
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
    <div className="justify-around bg-gradient-to-l from-[#1E212D] via-[#2E3A55] to-[#626C93] text-white flex items-center p-4 relative z-50">

      {/* پلن فعال */}
      <div className="flex-1 flex items-center ml-10 mr-6">
        <button className="bg-gradient-to-r from-[#EABF9F] to-[#D4A574] text-[#1E212D] px-4 py-2 rounded-lg font-semibold text-sm shadow-md flex items-center gap-2">
          {!planData ? (
            <>
              <div className="w-4 h-4 border-2 border-[#1E212D] border-t-transparent rounded-full animate-spin"></div>
              <span>در حال بارگذاری...</span>
            </>
          ) : (
            <>
              <span>{planData.plan?.name}</span>
              <span className="opacity-60">|</span>
              <span>
                {getDaysRemaining(planData.expires_at) > 0
                  ? `${getDaysRemaining(planData.expires_at)} روز مانده`
                  : "منقضی شده"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* لوگو */}
      <div className="flex items-center text-center gap-2">
        <img src="/TradePageimages/shop_logo.png" alt="logo" className="w-10 h-10" />
        <h1 className="font-jua text-4xl text-[#EABF9F] font-semibold">Trade Hub</h1>
      </div>

      {/* پروفایل و نوتیفیکیشن */}
      <div className="flex-1 flex items-center justify-end space-x-4">
        {planData?.plan?.name === "Pro" && (
          <div className="relative">
            <img
              src='/SellerPanel/notif.png'
              className="text-white text-xl cursor-pointer w-12 h-12"
              onClick={toggleNotifications}
            />
            <span className="absolute top-0 right-0 bg-[#1E212D] text-[#EABF9F] text-sm font-krona font-semibold rounded-full px-1">
              {notificationsCount}
            </span>

            {isNotificationsOpen && (
              <div className="absolute left-0 top-12 w-96 z-[60]">
                {/* مثلث بالا */}
                <div className="absolute top-[-10px] left-8 w-4 h-4 bg-white/30 border border-white/40 rotate-45 rounded-sm shadow-md z-[-1]"></div>

                {/* باکس اصلی نوتیف */}
                <div className="backdrop-blur-md bg-white/30 border border-white/40 text-black rounded-xl shadow-2xl max-h-60 overflow-y-auto p-4">
                  <h3 className="font-semibold mb-4">آخرین نوتیفیکیشن‌ها</h3>
                  <ul>
                    {notifications.length > 0 ? (
                      notifications.map((item, idx) => (
                        <li key={idx} className="py-4 border-b border-white/30 text-sm">
                          دیدگاه جدید برای <span className="font-semibold">{item.text}</span> ثبت شد
                          <div className="text-xs text-gray-100/60 mt-1">{item.date}</div>
                        </li>
                      ))
                    ) : (
                      <li className="py-4 text-gray-200">اعلان جدیدی نیست</li>
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
            className="text-white text-3xl cursor-pointer w-10 h-10"
            onClick={toggleProfile}
          />

          {isProfileOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg p-4 z-[60]">
              <div className="font-semibold mb-2">ایمیل فروشنده:</div>
              <div className="text-sm text-gray-700 mb-4">
                {userEmail ? userEmail : "در حال دریافت..."}
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                خروج از حساب
              </button>
            </div>
          )}
        </div>
      </div>

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
