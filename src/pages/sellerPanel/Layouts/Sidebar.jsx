import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaClipboardList, FaPaintBrush, FaUserCircle } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation(); // گرفتن مسیر فعلی
  const currentPath = location.pathname;

  const linkClass = (path) =>
    `mb-4 p-2 rounded-3xl flex items-center transition-all duration-200 ${
      currentPath === path
        ? 'bg-[#FAF3E0] hover:shadow-black' // اگر فعال بود: پس‌زمینه کم‌رنگ و حاشیه قرمز
        : 'hover:bg-[#FAF3E0] hover:shadow-black'
    }`;

  return (
    <div className="w-64 text-[#1E212D] font-modam font-medium text-lg p-6">
      <ul>
        <Link to="/HomeSeller" className={linkClass('/HomeSeller')}>
          <div className="pl-2">
            <FaHome className="mr-3" />
          </div>
          خانه
        </Link>

        <Link to="/products" className={linkClass('/products')}>
          <div className="pl-2">
            <FaBox className="mr-3" />
          </div>
          محصولات
        </Link>

        <Link to="/customers" className={linkClass('/customers')}>
          <div className="pl-2">
            <FaUsers className="mr-3" />
          </div>
          مشتریان
        </Link>

        <Link to="/orders" className={linkClass('/orders')}>
          <div className="pl-2">
            <FaClipboardList className="mr-3" />
          </div>
          سفارش‌ها
        </Link>

        <Link to="/appearance" className={linkClass('/appearance')}>
          <div className="pl-2">
            <FaPaintBrush className="mr-3" />
          </div>
          محتوای ظاهری
        </Link>

        <Link to="/profile" className={linkClass('/profile')}>
          <div className="pl-2">
            <FaUserCircle className="mr-3" />
          </div>
          پروفایل
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
