import axios from "axios";
import { coreBaseURL, mediaBaseURL } from './api';

export const getNewestItems = async (websiteId, limit = 3) => {
  try {
    const response = await axios.get(
      `${coreBaseURL}/items/newest_items?website_id=${websiteId}&limit=${limit}`,
      {
        headers: {
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




export const getItemRating = async (itemId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${coreBaseURL}/review/items/get-rating/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ خطا در دریافت امتیاز:", error);
    throw error;
  }
};




export const getItemImages = async (itemId) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${mediaBaseURL}/item/get_item_images/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; 
};

export const getItemImageById = async (imageId) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${mediaBaseURL}/item/get_item_image/${imageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob", 
  });

  return URL.createObjectURL(res.data); 
};


export const editItem = async (itemId, data) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${coreBaseURL}/items/edit_item/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('خطا در ویرایش محصول');
  }

  return await response.json();
};

export const createItem = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${coreBaseURL}/items/create_item`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};





export const getItemsBySubcategoryId = async (subcategoryId) => {
  const response = await fetch(`${coreBaseURL}/items/items/by_subcategory/${subcategoryId}`);
  const data = await response.json();
  return data; 
};




export const deleteItemImage = async (imageId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${mediaBaseURL}/item/delete/${imageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("خطا در حذف تصویر");
  }

  return true;
};



export const setMainItemImage = async (imageId) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.put(
      `${mediaBaseURL}/item/update_main_flag/${imageId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ خطا در تنظیم تصویر اصلی:", error);
    throw error;
  }
};




export const getItemRevenue = async (itemId) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${coreBaseURL}/order/items/${itemId}/revenue`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.revenue; 
};

export const getItemSalesCount = async (itemId) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${coreBaseURL}/order/items/${itemId}/sales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.total_sold; 
};




export const getItemReviews = async (itemId) => {
    try {
        const response = await axios.get(`${coreBaseURL}/review/items/${itemId}/reviews`);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching reviews:', error);
        throw error;
    }
};




export const createReview = async ({ website_id, item_id, rating, text }) => {
    try {
        const response = await fetch(`${coreBaseURL}/review/create_review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                website_id,
                item_id,
                rating,
                text,
            }),
        });

        if (!response.ok) throw new Error('Failed to create review');

        return await response.json();
    } catch (error) {
        console.error('❌ Error creating review:', error);
        throw error;
    }
};




export const getBestSellingItems = async (websiteId) => {
  try {
    const res = await axios.get(`${coreBaseURL}/websites/items/best-selling/${websiteId}`);
    return res.data || [];
  } catch (err) {
    console.error("Error fetching best-selling items:", err);
    return [];
  }
};
