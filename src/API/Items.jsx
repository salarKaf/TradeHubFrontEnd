import axios from "axios";
import { coreBaseURL } from './api';

export const getNewestItems = async (websiteId, limit = 3) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
     `${coreBaseURL}/items/newest_items?website_id=${websiteId}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ خطا در دریافت آخرین محصولات:", error);
    return [];
  }
};
