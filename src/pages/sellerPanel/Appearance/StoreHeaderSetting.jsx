import {
  Save,
  ChevronDown,
  ChevronLeft,
  Settings,
  Upload,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { uploadLogo, uploadBanner } from '../../../API/website';
import { useParams } from "react-router-dom";
import { updateWebsitePartial } from '../../../API/website';


const StoreHeaderSettings = () => {
  const [open, setOpen] = useState(true);
  const [fileNames, setFileNames] = useState({ logo: "", header: "" });
  const [textValues, setTextValues] = useState({ name: "", slogan: "" });
  const [notifications, setNotifications] = useState([]);
  const [files, setFiles] = useState({ logo: null, header: null });



  const { websiteId } = useParams();

  const toggleOpen = () => setOpen(prev => !prev);

  const showNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };




  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [key]: file }));
      setFileNames(prev => ({ ...prev, [key]: file.name }));
    }
  };


  const handleTextChange = (e, key) => {
    setTextValues(prev => ({ ...prev, [key]: e.target.value }));
  };



  const handleSave = async (key, type) => {
    if (type === "file" && !files[key]) {
      showNotification("error", `لطفاً ${key === "logo" ? "لوگو" : "تصویر سرصفحه"} را آپلود کنید.`);
      return;
    }

    if (type === "text" && !textValues[key].trim()) {
      showNotification("error", `لطفاً ${key === "name" ? "نام فروشگاه" : "شعار فروشگاه"} را وارد کنید.`);
      return;
    }

    try {
      if (type === "file") {
        if (key === "logo") {
          await uploadLogo(websiteId, files.logo);
        } else if (key === "header") {
          await uploadBanner(websiteId, files.header);
        }
      }

      if (type === "text") {
        const payload = {
          website_id: websiteId, // 👈 این حتما باید باشه
        };

        if (key === "name") {
          payload.business_name = textValues.name;
        } else if (key === "slogan") {
          payload.store_slogan = textValues.slogan;
        }

        await updateWebsitePartial(websiteId, payload);
      }

      showNotification("success", "با موفقیت ذخیره شد.");
    } catch (error) {
      showNotification("error", "خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.");
      console.error(error);
    }
  };



  const fields = [
    {
      label: "تغییر لوگوی فروشگاه",
      type: "file",
      key: "logo",
      placeholder: "فایل لوگوی خود را در اینجا آپلود کنید.",
      accept: "image/*",
    },
    {
      label: "تغییر عکس سر صفحه‌ی فروشگاه",
      type: "file",
      key: "header",
      placeholder: "فایل تصویری خود را در اینجا آپلود کنید.",
      accept: "image/*",
    },
    {
      label: "تغییر نام فروشگاه",
      type: "text",
      key: "name",
      placeholder: "نام جدید فروشگاه خود را در اینجا وارد کنید.",
    },
    {
      label: "تغییر شعار فروشگاه",
      type: "text",
      key: "slogan",
      placeholder: "متن خود را در اینجا وارد کنید.",
    },
  ];

  return (
    <div className="p-4 space-y-3 mt-5 relative">

      {/* نوتیفیکیشن‌ها */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 space-y-2 z-10">
        {notifications.map(({ id, type, message }) => (
          <div
            key={id}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm shadow border ${type === "success"
              ? "bg-green-100 text-green-700 border-green-400"
              : "bg-red-100 text-red-700 border-red-400"
              }`}
          >
            {type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>{message}</span>
          </div>
        ))}
      </div>

      {/* Title */}
      <div onClick={toggleOpen} className="flex items-center gap-2 cursor-pointer w-fit font-modam">
        <Settings className="text-[#1E212D] w-7 h-7" />
        <h1 className="font-bold text-[#1E212D] opacity-80 text-2xl">تنظیمات سر صفحه</h1>
        {open ? (
          <FaChevronDown className="w-5 h-5 text-[#1E212D]" />
        ) : (
          <FaChevronLeft className="w-5 h-5 text-[#1E212D]" />
        )}
      </div>

      {/* خط زیر تیتر */}
      <div className="w-full h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)] " />


      {/* Fields */}
      {open && (
        <div className="space-y-6 px-5 pt-6">
          {fields.map((field, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-16">

              {/* Label + Dot */}
              <div className="flex items-center gap-2 w-full md:w-[240px]">
                <span className="relative w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-[#1E212D] opacity-80" />
                </span>
                <label className="text-md font-medium text-[#1E212D] font-modam">
                  {field.label}
                </label>
              </div>

              {/* Input Group */}
              <div className="flex items-center gap-2 flex-1 max-w-md">
                {field.type === "file" ? (
                  <label className="flex items-center justify-between border border-[#d6c2aa] rounded-lg px-3 py-2 w-full bg-white cursor-pointer hover:bg-[#fff7ec] text-sm text-gray-700">
                    <span className="truncate">
                      {fileNames[field.key] || field.placeholder}
                    </span>
                    <Upload className="w-5 h-5 text-[#1E212D]" />
                    <input
                      type="file"
                      accept={field.accept}
                      className="hidden"
                      onChange={e => handleFileChange(e, field.key)}
                    />
                  </label>
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={textValues[field.key]}
                    onChange={e => handleTextChange(e, field.key)}
                    className="flex-1 px-3 py-2 border border-[#d6c2aa] rounded-lg bg-white text-sm focus:outline-none max-w-md"
                  />
                )}

                {/* Save Button */}
                <button
                  onClick={() => handleSave(field.key, field.type)}
                  title="برای ثبت تغییرات کلیک کنید"
                  className="p-2 rounded-md bg-[#fff0d9] border border-[#d6c2aa] hover:bg-[#f7e5cc] transition"
                >
                  <Save className="w-4 h-4 text-[#1E212D]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreHeaderSettings;
