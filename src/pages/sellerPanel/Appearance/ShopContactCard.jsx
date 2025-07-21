import { Contact } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import { getWebsiteById, updateWebsitePartial } from '../../../API/website'; // فرض میکنم path درسته

const ContactInfo = () => {
  const { websiteId } = useParams();

  // حالت برای نگهداری داده‌ها
  const [socialLinks, setSocialLinks] = useState({
    phone: "",
    telegram: "",
    instagram: ""
  });

  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [editError, setEditError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempLink, setTempLink] = useState('');
  const [addingNewLink, setAddingNewLink] = useState(false);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // تابع برای دریافت اطلاعات از بک‌اند
  const fetchWebsiteData = async () => {
    try {
      setLoading(true);
      const result = await getWebsiteById(websiteId);

      // بررسی وجود social_links و تنظیم مقادیر
      if (result.social_links) {
        setSocialLinks({
          phone: result.social_links.phone || "",
          telegram: result.social_links.telegram || "",
          instagram: result.social_links.instagram || ""
        });
      }
    } catch (error) {
      console.error('Error fetching website data:', error);
      setEditError('خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  // استفاده از useEffect برای دریافت اطلاعات در ابتدا
  useEffect(() => {
    if (websiteId) {
      fetchWebsiteData();
    }
  }, [websiteId]);

  // تابع برای تغییر وضعیت باز و بسته شدن
  const toggleOpen = () => setOpen(!open);

  // تابع برای ذخیره تغییرات در social links
  const saveSocialLinks = async () => {
    try {
      await updateWebsitePartial(websiteId, { social_links: socialLinks });
      setSuccessMessage('راه‌های ارتباطی با موفقیت به‌روزرسانی شد');
    } catch (error) {
      setEditError('خطا در ذخیره‌سازی. لطفاً دوباره تلاش کنید.');
    }
  };

  // تابع برای تغییر مقادیر social links
  const handleSocialLinkChange = (key, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // تابع برای اضافه کردن شبکه اجتماعی جدید (فقط phone, telegram, instagram پذیرفته میشه)
  const addLink = async () => {
    if (newLinkTitle && newLinkUrl) {
      const linkKey = newLinkTitle.toLowerCase();
      if (['phone', 'telegram', 'instagram'].includes(linkKey)) {
        const updatedLinks = {
          ...socialLinks,
          [linkKey]: newLinkUrl
        };
        setSocialLinks(updatedLinks);

        try {
          await updateWebsitePartial(websiteId, { social_links: updatedLinks });
          setNewLinkTitle('');
          setNewLinkUrl('');
          setSuccessMessage('با موفقیت اضافه شد');
          setAddingNewLink(false);
        } catch (error) {
          setEditError('خطا در ذخیره‌سازی. لطفاً دوباره تلاش کنید.');
        }
      } else {
        setEditError('فقط phone، telegram و instagram قابل قبول است');
      }
    }
  };

  // تابع برای حذف شبکه اجتماعی (خالی کردن مقدار)
  const removeLink = async () => {
    if (linkToDelete) {
      const updatedLinks = {
        ...socialLinks,
        [linkToDelete]: ""
      };
      setSocialLinks(updatedLinks);

      try {
        await updateWebsitePartial(websiteId, { social_links: updatedLinks });
        setSuccessMessage('فیلد با موفقیت پاک شد');
        setIsModalOpen(false);
      } catch (error) {
        setEditError('خطا در حذف. لطفاً دوباره تلاش کنید.');
      }
    }
  };

  // تابع برای ویرایش عنوان و لینک شبکه اجتماعی
  const editLink = (key) => {
    setIsEditing(key);
    setTempTitle(key); // کلید را به عنوان عنوان قرار می‌دهیم
    setTempLink(socialLinks[key]); // مقدار فعلی لینک
  };

  // ذخیره تغییرات ویرایش
  const saveEdit = async (key) => {
    if (!tempLink) {
      setEditError('راه ارتباطی نباید خالی باشد');
      return;
    }
    setEditError('');

    const updatedLinks = {
      ...socialLinks,
      [key]: tempLink
    };
    setSocialLinks(updatedLinks);

    try {
      await updateWebsitePartial(websiteId, { social_links: updatedLinks });
      setIsEditing(null);
      setSuccessMessage('تغییرات با موفقیت ذخیره شد');
    } catch (error) {
      setEditError('خطا در ذخیره‌سازی. لطفاً دوباره تلاش کنید.');
    }
  };

  // لغو ویرایش
  const cancelEdit = () => {
    setIsEditing(null);
    setTempTitle('');
    setTempLink('');
  };

  // تبدیل socialLinks object به array برای نمایش
  const socialLinksArray = Object.entries(socialLinks)
    .filter(([key, value]) => value && value.trim() !== '')
    .map(([key, value]) => ({ id: key, title: key, link: value }));

  return (
    <div className="p-6 rounded-lg relative">
      {/* پیغام موفقیت‌آمیز */}
      {successMessage && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <i className="fa fa-check text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{successMessage}</h3>
              <button
                onClick={() => setSuccessMessage('')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* پیغام خطا */}
      {editError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {editError}
          <button onClick={() => setEditError('')} className="ml-2 text-red-500">×</button>
        </div>
      )}

      {/* Title Section */}
      <div onClick={toggleOpen} className="flex items-center gap-2 cursor-pointer w-fit font-modam mb-4">
        <img src='/public/SellerPanel/Settings/Group 257.png' className="text-[#1E212D] w-9 h-9" />
        <h1 className="font-bold text-[#1E212D] opacity-80 text-2xl">راه های ارتباط با مشتری</h1>
        {open ? (
          <FaChevronDown className="w-5 h-5 text-[#1E212D]" />
        ) : (
          <FaChevronLeft className="w-5 h-5 text-[#1E212D]" />
        )}
      </div>

      {/* خط زیر تیتر */}
      <div className="w-full h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)] mb-10" />

      {/* Social Links Section */}
      {open && !loading && (
        <div>
          {/* نمایش فیلدهای اصلی */}
          <div className="bg-white border rounded-xl mx-4 overflow-hidden mb-4">
            {['phone', 'telegram', 'instagram'].map((key, index) => (
              <div key={key} className={`p-4 flex justify-between items-center ${index !== 2 ? 'border-b' : ''}`}>
                <div className="flex items-center space-x-6 flex-1">
                  <span className="text-sm font-semibold text-gray-700 min-w-[100px] capitalize">{key}</span>

                  {isEditing === key ? (
                    <input
                      type="text"
                      value={tempLink}
                      onChange={(e) => setTempLink(e.target.value)}
                      className="p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
                      placeholder={`${key} خود را وارد کنید`}
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1">
                      <span className="text-sm text-gray-600">
                        {socialLinks[key] || 'مقداری وارد نشده است'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {isEditing === key ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveEdit(key)}
                        className="bg-green-100 hover:bg-green-200 text-green-600 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <i className="fa fa-save ml-1"></i> ذخیره
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <i className="fa fa-times ml-1"></i> لغو
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => { setIsModalOpen(true); setLinkToDelete(key); }}
                        className="hover:bg-red-200 text-[#1E212D] px-3 py-2 rounded-lg transition-colors duration-200"
                        title="پاک کردن فیلد"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                      <button
                        onClick={() => editLink(key)}
                        className="hover:bg-blue-200 text-[#1E212D] px-3 py-2 rounded-lg transition-colors duration-200"
                        title="ویرایش"
                      >
                        <i className="fa fa-pencil-alt"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && open && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">در حال بارگذاری...</div>
        </div>
      )}

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">آیا مطمئن هستید که می‌خواهید این فیلد را پاک کنید؟</h3>
            <div className="flex justify-center space-x-3 gap-10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                لغو
              </button>
              <button
                onClick={removeLink}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                پاک کردن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;