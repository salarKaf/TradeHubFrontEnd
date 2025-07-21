import axios from "axios";
import { coreBaseURL, mediaBaseURL } from './api';



// ساخت فروشگاه با فیلدهای کامل اما خالی
export const createWebsite = async (business_name) => {

    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${coreBaseURL}/websites/create_website`,
        {
            business_name: business_name || "",      // لازم
            welcome_text: "",                        // خالی ولی string
            guide_page: "",
            store_policy: "",
            store_slogan: "",
            social_links: {
                phone: "",
                telegram: "https://example.com", // 👈 باید URL معتبر باشه حتی اگر تستیه
                instagram: "https://example.com"
            },
            faqs: [] // باید آرایه باشه نه null
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        }
    );


    console.log("📦 payload در حال ارسال:", {
        business_name: business_name || "",
        welcome_text: "",
        guide_page: "",
        store_policy: "",
        store_slogan: "",
        social_links: {
            phone: "",
            telegram: "https://example.com",
            instagram: "https://example.com",
        },
        faqs: [],
    });


    return response.data;



};

// آپلود لوگو
export const uploadLogo = async (websiteId, file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.put(
        `${mediaBaseURL}/website/upload_logo/${websiteId}`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


// آپلود بنر
export const uploadBanner = async (websiteId, file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.put(
        `${mediaBaseURL}/website/upload_banner/${websiteId}`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


export const getMyWebsite = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`${coreBaseURL}/websites/my_website`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data; // اطلاعات فروشگاه
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // یعنی فروشگاهی وجود نداره
        }
        throw new Error("خطا در دریافت فروشگاه کاربر");
    }
};




// src/API/website.js (اضافه کردن به فایل موجود)


// تابع جدید برای چک کردن پلن فعال
export const getActivePlan = async (websiteId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${coreBaseURL}/websites/plans/active_plan/${websiteId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching active plan:', error);
        throw error;
    }
};





// ویرایش بخشی از سایت
export const updateWebsitePartial = async (websiteId, data) => {
  const token = localStorage.getItem('token');

  const response = await axios.put(
    `${coreBaseURL}/websites/update-website/${websiteId}/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};
