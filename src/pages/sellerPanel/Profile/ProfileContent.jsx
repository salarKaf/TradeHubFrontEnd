import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa'; // برای آیکن ویرایش

const ProfileContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'محمد علی',
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
    setIsEditing(false);
    // می‌توانید تغییرات را در اینجا ذخیره کنید
  };

  return (
    <div className="p-6 bg-[#F5F3F2] rounded-lg">
      <h2 className="text-2xl font-bold text-center text-[#1E212D] mb-6">اطلاعات حساب شما</h2>

      {/* نام و نام خانوادگی */}
      <div className="relative mb-6 flex justify-between items-center">
        <label className="text-lg text-[#1E212D]">نام و نام خانوادگی</label>
        <div className="flex items-center">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="border-2 border-gray-300 p-2 rounded-md w-40"
            />
          ) : (
            <span className="text-gray-700">{userData.name}</span>
          )}
          <button
            onClick={handleEditClick}
            className="absolute -top-4 -right-4 bg-blue-500 text-white rounded-full p-2"
          >
            <FaPen />
          </button>
        </div>
      </div>

      {/* ایمیل */}
      <div className="mb-6 flex justify-between items-center">
        <label className="text-lg text-[#1E212D]">آدرس ایمیل</label>
        <span className="text-gray-700">{userData.email}</span>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          disabled={!isEditing}
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
};

export default ProfileContent;
