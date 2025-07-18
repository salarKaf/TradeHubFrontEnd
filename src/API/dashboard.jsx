import axios from 'axios';
import { coreBaseURL } from './api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// گرفتن مجموع درآمد
export const getTotalRevenue = async (websiteId) => {
  try {
    const response = await axios.get(
      `${coreBaseURL}/websites/sales/total-revenue/${websiteId}`,
      getAuthHeader()
    );

    return response.data;

  } catch (error) {
    console.error("خطا در گرفتن درآمد کل:", error);
    console.log("token:", localStorage.getItem("token"));
    console.log("websiteId:", websiteId);

    throw error;
  }
};

// گرفتن تعداد فروش
export const getTotalSalesCount = async (websiteId) => {
  try {
    const response = await axios.get(
      `${coreBaseURL}/websites/sales/total-count/${websiteId}`,
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error("خطا در گرفتن تعداد فروش:", error);
    throw error;
  }
};


export const getLast6MonthsSales = async (websiteId) => {
  try {
    const response = await axios.get(
      `${coreBaseURL}/websites/sales/last-6-months/${websiteId}`,
      getAuthHeader() // 🔥 باید این باشه!
    );
    console.log("📊 داده ۶ ماه اخیر:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ خطا در دریافت نمودار فروش ۶ ماه اخیر:", error);
    throw error;
  }
};




export const getProductCount  = async (websiteId) => {
  try {
    const response = await axios.get(
      `${coreBaseURL}/items/items/count/${websiteId}`,
      getAuthHeader() // 🔥 باید این باشه!
    );
    console.log("📊 داده ۶ ماه اخیر:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ خطا در دریافت تعداد محصولات:", error);
    throw error;
  }
};


