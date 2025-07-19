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



export const getItemsByCategoryId = async (categoryId) => {
  try {
    const response = await axios.get(`${coreBaseURL}/items/items/by_category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("❌ خطا در دریافت محصولات دسته:", error);
    throw error;
  }
};


export const deleteItemById = async (itemId) => {

  try {
    const token = localStorage.getItem("token");
    return axios.delete(`${coreBaseURL}/items/delete_item/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


  } catch (error) {
    console.error("❌ خطا در حذف محصول:", error);
    throw error;
  }

};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${coreBaseURL}/items/items/${productId}`);
    return response.data;
  } catch (error) {
    console.error("❌ خطا در API گرفتن محصول:", error);
    throw error;
  }
};
