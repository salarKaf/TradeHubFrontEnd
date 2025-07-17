import axios from "axios";
import { coreBaseURL } from './api';

export const getLatestOrders = async (websiteId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${coreBaseURL}/websites/orders/latest/${websiteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ خطا در دریافت آخرین سفارشات:", error);
    return [];
  }
};
