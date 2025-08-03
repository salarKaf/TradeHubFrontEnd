import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaUsers, FaClipboardList, FaPaintBrush, FaUserCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { websiteId } = useParams();
   
  const linkClass = (path) =>
    `mb-3 lg:mb-4 p-3 lg:p-3 rounded-2xl lg:rounded-3xl flex items-center transition-all duration-200 text-sm lg:text-lg ${
      currentPath === path
        ? 'bg-[#FAF3E0] hover:shadow-black shadow-md'
        : 'hover:bg-[#FAF3E0] hover:shadow-black'
    }`;
 
  const menuItems = [
    {
      to: `/HomeSeller/${websiteId}`,
      icon: FaHome,
      label: 'خانه',
      mobileLabel: 'خانه'
    },
    {
      to: `/products/${websiteId}`,
      icon: FaBox,
      label: 'محصولات',
      mobileLabel: 'محصولات'
    },
    {
      to: `/customers/${websiteId}`,
      icon: FaUsers,
      label: 'مشتریان',
      mobileLabel: 'مشتریان'
    },
    {
      to: `/orders/${websiteId}`,
      icon: FaClipboardList,
      label: 'سفارش‌ها',
      mobileLabel: 'سفارش‌ها'
    },
    {
      to: `/appearance/${websiteId}`,
      icon: FaPaintBrush,
      label: 'محتوای ظاهری',
      mobileLabel: 'ظاهری'
    },
    {
      to: `/profile/${websiteId}`,
      icon: FaUserCircle,
      label: 'پروفایل',
      mobileLabel: 'پروفایل'
    }
  ];
 
  return (
    <div className="w-full h-full text-[#1E212D] font-modam font-medium p-4 lg:p-6 flex flex-col">
      {/* لوگو برای موبایل */}
      <div className="flex items-center justify-center mb-6 lg:hidden">
        <img src="/TradePageimages/shop_logo.png" alt="logo" className="w-8 h-8" />
        <h1 className="font-jua text-xl text-[#1E212D] font-semibold ml-2">Trade Hub</h1>
      </div>
 
      {/* فاصله از بالا برای دسکتاپ */}
      <div className="hidden lg:block lg:mb-8"></div>
 
      <div className="flex-1 flex flex-col">
        <ul className="space-y-1 flex-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <Link
                   to={item.to}
                   className={linkClass(item.to)}
                >
                  <div className="flex items-center justify-center lg:justify-start w-full">
                    <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8">
                      <IconComponent className="text-lg lg:text-xl" />
                    </div>
                    <span className="hidden lg:inline ml-3 lg:ml-4">
                      {item.label}
                    </span>
                    <span className="lg:hidden text-xs mt-1 text-center w-full">
                      {item.mobileLabel}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
 
        {/* فوتر برای موبایل */}
        <div className="mt-auto pt-4 border-t border-[#1E212D]/20 lg:hidden">
          <div className="text-center text-xs text-[#1E212D]/60">
            پنل فروشنده
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;