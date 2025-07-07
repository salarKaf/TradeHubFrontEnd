import { Contact } from 'lucide-react';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa'; // به‌منظور استفاده از آیکن‌ها

const ContactInfo = () => {
  // حالت برای نگهداری داده‌ها
  const [socialLinks, setSocialLinks] = useState([
    { id: 1, title: 'تلگرام', link: 'https://t.me/example' },
    { id: 2, title: 'اینستاگرام', link: 'https://instagram.com/example' }
  ]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [editError, setEditError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(null); // برای تعیین اینکه کدام لینک در حال ویرایش است
  const [tempTitle, setTempTitle] = useState(''); // ذخیره موقت عنوان در هنگام ویرایش
  const [tempLink, setTempLink] = useState(''); // ذخیره موقت لینک در هنگام ویرایش
  const [addingNewLink, setAddingNewLink] = useState(false); // برای تشخیص زمانی که کاربر در حال افزودن لینک جدید است
  const [open, setOpen] = useState(true); // متغیر برای کنترل باز و بسته شدن بخش تنظیمات

  // تابع برای تغییر وضعیت باز و بسته شدن
  const toggleOpen = () => setOpen(!open);

  // تابع برای اضافه کردن شبکه اجتماعی جدید
  const addLink = () => {
    if (newLinkTitle && newLinkUrl) {
      setSocialLinks([...socialLinks, { id: Date.now(), title: newLinkTitle, link: newLinkUrl }]);
      setNewLinkTitle('');
      setNewLinkUrl('');
      setSuccessMessage('با موفقیت اضافه شد');
      setAddingNewLink(false); // مخفی کردن ورودی‌ها بعد از افزودن لینک
    }
  };

  // تابع برای حذف شبکه اجتماعی
  const removeLink = () => {
    if (linkToDelete) {
      setSocialLinks(socialLinks.filter((link) => link.id !== linkToDelete));
      setSuccessMessage('لینک با موفقیت حذف شد');
      setIsModalOpen(false);
    }
  };

  // تابع برای ویرایش عنوان و لینک شبکه اجتماعی
  const editLink = (id) => {
    setIsEditing(id);
    const link = socialLinks.find(link => link.id === id);
    setTempTitle(link.title); // عنوان موقت برای ویرایش
    setTempLink(link.link); // لینک موقت برای ویرایش
  };

  // ذخیره تغییرات ویرایش
  const saveEdit = (id) => {
    if (!tempTitle || !tempLink) {
      setEditError('عنوان و راه ارتباطی نباید خالی باشند');
      return;
    }
    setEditError('');
    setSocialLinks(socialLinks.map((link) =>
      link.id === id ? { ...link, title: tempTitle, link: tempLink } : link
    ));
    setIsEditing(null);
    setSuccessMessage('تغییرات با موفقیت ذخیره شد');
  };

  // لغو ویرایش
  const cancelEdit = () => {
    setIsEditing(null);
    setTempTitle(''); // پاک کردن عنوان موقت
    setTempLink(''); // پاک کردن لینک موقت
  };

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
      {open && (
        <div>
          {/* Table Style List of Social Links */}
          <div className="bg-white border rounded-xl mx-4 overflow-hidden">
            {socialLinks.map((link, index) => (
              <div key={link.id} className={`p-4 flex justify-between items-center ${index !== socialLinks.length - 1 ? 'border-b' : ''}`}>
                <div className="flex items-center space-x-6 flex-1">
                  {isEditing === link.id ? (
                    <div className="flex items-center space-x-4 w-full">
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/3"
                        placeholder="عنوان"
                      />
                      <input
                        type="text"
                        value={tempLink}
                        onChange={(e) => setTempLink(e.target.value)}
                        className="mt-2 p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
                        placeholder="راه ارتباطی"
                      />
                      {editError && <span className="text-red-500 text-xs mr-2">{editError}</span>}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-6">
                      <span className="text-sm font-semibold text-gray-700 min-w-[100px]">{link.title}</span>
                      <span className="text-sm text-gray-500">{link.link}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {isEditing !== link.id && (
                    <>
                      <button 
                        onClick={() => { setIsModalOpen(true); setLinkToDelete(link.id); }} 
                        className=" hover:bg-red-200 text-[#1E212D] px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                      <button 
                        onClick={() => editLink(link.id)} 
                        className=" hover:bg-blue-200 text-[#1E212D] px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <i className="fa fa-pencil-alt"></i>
                      </button>
                    </>
                  )}
                  {isEditing === link.id && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => saveEdit(link.id)} 
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
                  )}
                </div>
              </div>
            ))}
            
            {/* Add new link section inside table */}
            {addingNewLink && (
              <div className="p-4 flex justify-between items-center border-t bg-gray-50">
                <div className="flex items-center space-x-4 flex-1">
                  <input
                    type="text"
                    placeholder="عنوان"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    className="p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/3"
                  />
                  <input
                    type="text"
                    placeholder="راه ارتباطی"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
                  />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={addLink} 
                    className="bg-green-100 hover:bg-green-200 text-green-600 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <i className="fa fa-check ml-1"></i> ذخیره
                  </button>
                  <button 
                    onClick={() => setAddingNewLink(false)} 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <i className="fa fa-times ml-1"></i> لغو
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add button outside table */}
          {!addingNewLink && (
            <button
              onClick={() => setAddingNewLink(true)}
              className="mx-4 mt-2 font-modam bg-[#fff0d9] hover:bg-[#f7e5cc] px-4 py-4 rounded-lg text-base border border-[#d6c2aa] flex items-center gap-2 transition-colors"
            >
              <i className="fa fa-plus ml-2"></i>
              اضافه کردن راه ارتباطی جدید
            </button>
          )}
        </div>
      )}

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">آیا مطمئن هستید که می‌خواهید حذف کنید؟</h3>
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
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;