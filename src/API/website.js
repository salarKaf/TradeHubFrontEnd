import axios from "axios";
import { coreBaseURL, mediaBaseURL } from './api';

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
          section: "",
          subsection: "",
        },
      ],
      store_slogan: "",
      social_links: {
        phone: "",
        telegram: "",
        instagram: "",
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

  console.log("✅ پاسخ دریافتی از سرور:", response.data);

  return response.data;
};


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
    return response.data; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; 
    }
    throw new Error("خطا در دریافت فروشگاه کاربر");
  }
};

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


export const getLogo = async (websiteId) => {
  const response = await axios.get(`${mediaBaseURL}/website/get_logo/${websiteId}`, { responseType: 'blob' });
  return URL.createObjectURL(response.data);  
};

// گرفتن بنر
export const getBanner = async (websiteId) => {
  const response = await axios.get(`${mediaBaseURL}/website/get_banner/${websiteId}`, { responseType: 'blob' });
  return URL.createObjectURL(response.data);  
};

export const getStoreSlug = async (websiteId) => {
  try {
    const response = await axios.get(
      `${coreBaseURL}/slug/get-slug-by/${websiteId}`
    );
    
    console.log('Raw API response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    
    if (typeof response.data === 'string') {
      return response.data;
    }
    
    if (response.data?.slug) {
      return response.data.slug;
    }
    
    return 'store';
  } catch (error) {
    console.error('Error getting slug:', {
      message: error.message,
      response: error.response?.data
    });
    return 'store';
  }
};





export const updateSlug = async (websiteId, newSlug) => {
  const response = await axios.put(`${coreBaseURL}/slug/update-slug`, null, {
    params: {
      website_id: websiteId,
      new_slug: newSlug
    }
  });
  return response.data;
};
