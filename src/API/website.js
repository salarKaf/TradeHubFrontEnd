import axios from "axios";
import { coreBaseURL, mediaBaseURL } from './api';

// ساخت فروشگاه با فیلدهای کامل اما خالی
export const createWebsite = async (business_name) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${coreBaseURL}/websites/create_website`,
    {
      business_name: business_name || "",
      welcome_text: "",
      guide_page: "",
      store_policy: [
        {
          section: "string",
          subsection: "string",
        },
      ],
      store_slogan: "",
      social_links: {
        phone: "",
        telegram: "https://example.com",
        instagram: "https://example.com",
      },
      faqs: [],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // 🔍 لاگ خروجی واقعی سرور
  console.log("✅ پاسخ دریافتی از سرور:", response.data);

  return response.data;
};

// api/slugApi.js

export const getWebsiteIdBySlug = async (slug) => {
  try {
    const response = await fetch(`${coreBaseURL}/slug/slug/${slug}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('فروشگاه یافت نشد');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('خطا در دریافت آیدی وبسایت:', error);
    throw error;
  }
};

// دریافت فروشگاه با ID (بدون توکن)
export const getWebsiteById = async (websiteId) => {
  try {
    const response = await fetch(`${coreBaseURL}/websites/get_website/${websiteId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('خطا در دریافت اطلاعات وبسایت:', error);
    throw error;
  }
};
// دریافت فروشگاه با ID
// export const getWebsiteById = async (websiteId) => {
//     const token = localStorage.getItem("token");

//     const response = await axios.get(
//         `${coreBaseURL}/websites/get_website/${websiteId}`,
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json"
//             },
//         }
//     );

//     return response.data;
// };

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

// تابع جدید برای چک کردن پلن فعال
export const getActivePlan = async (websiteId) => {
  try {
    const response = await axios.get(`${coreBaseURL}/websites/plans/active_plan/${websiteId}`, {
      headers: {

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
    {
      website_id: websiteId,
      ...data
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};









export const updateWebsiteFaqs = async (websiteId, faqs) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(
    `${coreBaseURL}/websites/update-website/${websiteId}/`,
    {
      website_id: websiteId,
      faqs,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


// گرفتن لوگو
export const getLogo = async (websiteId) => {
  const response = await axios.get(`${mediaBaseURL}/website/get_logo/${websiteId}`, { responseType: 'blob' });
  return URL.createObjectURL(response.data);  // تبدیل Blob به URL
};

// گرفتن بنر
export const getBanner = async (websiteId) => {
  const response = await axios.get(`${mediaBaseURL}/website/get_banner/${websiteId}`, { responseType: 'blob' });
  return URL.createObjectURL(response.data);  // تبدیل Blob به URL
};





export const getStoreSlug = async (websiteId) => {
  try {
    const response = await axios.get(
      `${coreBaseURL}/slug/get-slug-by/${websiteId}`,
      {
        headers: {
        }
      }
    );
    
    return response.data.slug || 'store';
  } catch (error) {
    console.error('Error getting store slug:', error);
    return 'store'; // مقدار پیش‌فرض
  }
};