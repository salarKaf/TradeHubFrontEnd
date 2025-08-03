// Sidebar.jsx


// MainLayout.jsx
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // تشخیص سایز صفحه
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      // روی دسکتاپ، sidebar همیشه باز باشه
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Header */}
      <Header />

      <div className="flex relative" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="fixed top-20 left-4 z-50 bg-[#EABF9F] text-[#1E212D] p-2 rounded-lg shadow-lg lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        {/* Overlay برای موبایل */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:static top-0 left-0 bg-[#EABF9F] z-40 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            w-64 h-full
          `}
          style={{ 
            height: isMobile ? '100vh' : '100%',
            top: isMobile ? '0' : 'auto'
          }}
        >
          <div 
            className="h-full" 
            style={{ 
              paddingTop: isMobile ? '80px' : '0',
              height: isMobile ? '100vh' : '100%'
            }}
          >
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`
            flex-1 transition-all duration-300 ease-in-out overflow-auto
            ${!isMobile && isSidebarOpen ? 'lg:ml-0' : ''}
            ${isMobile ? 'w-full' : ''}
          `}
        >
          <div className="p-4 lg:p-6 bg-[#FAF3E0] min-h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;