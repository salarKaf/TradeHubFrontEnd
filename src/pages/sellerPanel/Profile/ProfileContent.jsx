import React, { useState } from 'react';
import { FaPen, FaSave, FaCog, FaChevronDown, FaChevronLeft } from 'react-icons/fa';

const ProfileContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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

  const handleEmailClick = () => {
    window.location.href = 'mailto:support@example.com';
  };

  return (
    <div className="p-4 font-modam">
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
      <div className="flex items-center gap-2 w-fit font-modam">
        <img src='/public/SellerPanel/Profile/User.png' className="text-[#1E212D] w-8 h-8" />
        <h1 className="font-bold text-[#1E212D] opacity-80 text-2xl">اطلاعات حساب شما</h1>
      </div>

      {/* خط زیر تیتر */}
      <div className="w-full h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)] mb-6 mt-4" />

      <>
        {/* فاصله از خط */}
        <div className="mt-8">
          {/* جدول اطلاعات */}
          <div className="relative w-full max-w-xl">
            {/* آیکن ادیت - چسبیده به بالای جدول سمت چپ */}
            <div className="absolute -top-4 left-0 z-10">
              <button
                onClick={isEditing ? handleSave : handleEditClick}
                className={`${isEditing ? 'bg-green-500 hover:bg-green-600  hover:transition hover:scale-110' : 'bg-[#1E212D] hover:bg-[#1e212dbe]  hover:transition hover:scale-110'} text-white rounded-full p-3 text-sm transition-colors duration-200 shadow-lg`}
              >
                {isEditing ? <FaSave /> : <FaPen />}
              </button>
            </div>

            {/* جدول */}
            <div className="bg-transparent rounded-lg border-2 border-gray-300 overflow-hidden relative">
              {/* خط عمودی سراسری */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
              
              {/* نام */}
              <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#1E212D] rounded-full ml-2"></div>
                  <label className="text-sm text-[#1E212D] w-24 flex-shrink-0 mr-2">نام فروشنده</label>
                </div>
                <div className="flex items-center pl-4">
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
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#1E212D] rounded-full ml-2"></div>
                  <label className="text-sm text-[#1E212D] w-24 flex-shrink-0 mr-2">نام خانوادگی</label>
                </div>
                <div className="flex items-center pl-4">
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 rounded-md w-32 text-sm focus:oline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="نام خانوادگی"
                    />
                  ) : (
                    <span className="text-gray-700 text-sm">{userData.lastName}</span>
                  )}
                </div>
              </div>

              {/* ایمیل */}
              <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#1E212D] rounded-full ml-2"></div>
                  <label className="text-sm text-[#1E212D] w-24 flex-shrink-0 mr-2">آدرس ایمیل</label>
                </div>
                <div className="flex items-center pl-4">
                  <span className="text-gray-700 text-sm">{userData.email}</span>
                </div>
              </div>
            </div>

            {/* دکمه تغییر رمز عبور - پایین سمت راست */}
            <div className="flex justify-end mt-4">
              <button className="bg-gradient-to-r from-[#312c8fbd] to-[#1E212D] text-white py-3 px-8 rounded-full text-md  shadow-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                تغییر رمز عبور
              </button>
            </div>
          </div>
        </div>

        {/* بخش پشتیبانی */}
        <div className="mt-8">
          {/* تیتر پشتیبانی */}
          <div className="flex items-center gap-2 w-fit font-modam">
            <img src='/public/SellerPanel/Profile/icons8-ask-question-48 1.png' className="text-[#1E212D] w-8 h-8" />
            <h1 className="font-bold text-[#1E212D] opacity-90 text-2xl">پشتیبانی</h1>
          </div>

          {/* متن توضیحی */}
          <div className=" rounded-lg p-4 mb-4">
            <p className="text-gray-700 text-lg leading-relaxed font-rubik">
              در صورت بروز هرگونه مشکل یا سوال، می‌توانید از طریق این بخش با تیم پشتیبانی در ارتباط باشید. لطفاً شرح دقیق مشکل یا درخواست خود را وارد کرده و برای بررسی و پاسخگویی سریع‌تر، اطلاعات لازم را کامل نمایید. ما در کوتاه‌ترین زمان ممکن به شما پاسخ خواهیم داد.
            </p>
          </div>

          {/* ایمیل پشتیبانی */}
          <div className="bg-white border-2 border-[#1e212d37] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#1E212D] p-2 rounded-full">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ایمیل پشتیبانی</p>
                <button
                  onClick={handleEmailClick}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  support@example.com
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default ProfileContent;