import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaClipboardList, FaPaintBrush, FaUserCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';


const Sidebar = () => {
  const location = useLocation(); // گرفتن مسیر فعلی
  const currentPath = location.pathname;
  const { websiteId } = useParams();


  const linkClass = (path) =>
    `mb-4 p-2 rounded-3xl flex items-center transition-all duration-200 ${currentPath === path
      ? 'bg-[#FAF3E0] hover:shadow-black' // اگر فعال بود: پس‌زمینه کم‌رنگ و حاشیه قرمز
      : 'hover:bg-[#FAF3E0] hover:shadow-black'
    }`;

  return (
    <div className="w-64 text-[#1E212D] font-modam font-medium text-lg p-6">
      <ul>
        <Link to={`/HomeSeller/${websiteId}`} className={linkClass(`/HomeSeller/${websiteId}`)}>
          <div className="pl-2">
            <FaHome className="mr-3" />
          </div>
          خانه
        </Link>


        <Link to={`/products/${websiteId}`} className={linkClass(`/products/${websiteId}`)}>

          <div className="pl-2">
            <FaBox className="mr-3" />
          </div>
          محصولات
        </Link>


        <Link to={`/customers/${websiteId}`} className={linkClass(`/customers/${websiteId}`)}>

          <div className="pl-2">
            <FaUsers className="mr-3" />
          </div>
          مشتریان
        </Link>


        <Link to={`/orders/${websiteId}`} className={linkClass(`/orders/${websiteId}`)}>

          <div className="pl-2">
            <FaClipboardList className="mr-3" />
          </div>
          سفارش‌ها
        </Link>


        <Link to={`/appearance/${websiteId}`} className={linkClass(`/appearance/${websiteId}`)}>
          <div className="pl-2">
            <FaPaintBrush className="mr-3" />
          </div>
          محتوای ظاهری
        </Link>


        <Link to={`/profile/${websiteId}`} className={linkClass(`/profile/${websiteId}`)}>
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
