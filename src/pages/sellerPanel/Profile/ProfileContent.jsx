import React, { useState } from 'react';
import { FaPen, FaSave, FaCog, FaChevronDown, FaChevronLeft } from 'react-icons/fa';

const ProfileContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen(prev => !prev);

  const [userData, setUserData] = useState({
    firstName: 'محمد',
    lastName: 'علی',
    email: 'example@mail.com',
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // بررسی خالی نبودن فیلدها
    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      setShowAlert(true);
      return;
    }
    setIsEditing(false);
    // می‌توانید تغییرات را در اینجا ذخیره کنید
  };

  return (
    <div className="p-4 ">
      {/* Modal برای نمایش خطا */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <i className="fa fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">خطا!</h3>
              <p className="text-gray-600 mb-4">نام و نام خانوادگی نمی‌تواند خالی باشد</p>
              <button
                onClick={() => setShowAlert(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Title */}
      <div onClick={toggleOpen} className="flex items-center gap-2 cursor-pointer w-fit font-modam">
        <FaCog className="text-[#1E212D] w-7 h-7" />
        <h1 className="font-bold text-[#1E212D] opacity-80 text-2xl">تنظیمات سر صفحه</h1>
        {open ? (
          <FaChevronDown className="w-5 h-5 text-[#1E212D]" />
        ) : (
          <FaChevronLeft className="w-5 h-5 text-[#1E212D]" />
        )}
      </div>

      {/* خط زیر تیتر */}
      <div className="w-full h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)] mb-6" />

      {open && (
        <>
          {/* فاصله از خط */}
          <div className="mt-8">
            {/* جدول اطلاعات */}
            <div className="relative w-full max-w-xl">
              {/* آیکن ادیت - چسبیده به بالای جدول سمت چپ */}
              <div className="absolute -top-4 right-0 z-10">
                <button
                  onClick={isEditing ? handleSave : handleEditClick}
                  className={`${isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full p-3 text-sm transition-colors duration-200 shadow-lg`}
                >
                  {isEditing ? <FaSave /> : <FaPen />}
                </button>
              </div>

              {/* جدول */}
              <div className="bg-transparent rounded-lg border-2 border-gray-300 overflow-hidden">
                {/* نام */}
                <div className="px-6 py-4 flex justify-between items-center">
                  <label className="text-sm font-medium text-[#1E212D]">نام</label>
                  <div className="flex items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded-md w-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="نام"
                      />
                    ) : (
                      <span className="text-gray-700 text-sm">{userData.firstName}</span>
                    )}
                  </div>
                </div>

                {/* نام خانوادگی */}
                <div className="px-6 py-4 flex justify-between items-center">
                  <label className="text-sm font-medium text-[#1E212D]">نام خانوادگی</label>
                  <div className="flex items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded-md w-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="نام خانوادگی"
                      />
                    ) : (
                      <span className="text-gray-700 text-sm">{userData.lastName}</span>
                    )}
                  </div>
                </div>

                {/* ایمیل */}
                <div className="px-6 py-4 flex justify-between items-center">
                  <label className="text-sm font-medium text-[#1E212D]">آدرس ایمیل</label>
                  <span className="text-gray-700 text-sm">{userData.email}</span>
                </div>
              </div>

              {/* دکمه تغییر رمز عبور - پایین سمت راست */}
              <div className="flex justify-end mt-4">
                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg text-sm font-semibold transition-colors duration-200">
                  تغییر رمز عبور
                </button>
              </div>
            </div>
          </div>

          {/* بخش پشتیبانی */}
          <div className="mt-8">
            {/* تیتر پشتیبانی */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#1E212D]">پشتیبانی</h2>
            </div>

            {/* متن توضیحی */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                در صورت بروز هرگونه مشکل یا سوال، می‌توانید از طریق این بخش با تیم پشتیبانی در ارتباط باشید. لطفاً شرح دقیق مشکل یا درخواست خود را وارد کرده و برای بررسی و پاسخگویی سریع‌تر، اطلاعات لازم را کامل نمایید. ما در کوتاه‌ترین زمان ممکن به شما پاسخ خواهیم داد.
              </p>
            </div>

            {/* ایمیل پشتیبانی */}
            <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-full">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">ایمیل پشتیبانی</p>
                  <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                    support@example.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileContent;