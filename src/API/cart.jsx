import axios from 'axios';
import { coreBaseURL } from './api';

const api = axios.create({
    baseURL: coreBaseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 🔴 تغییر ۱: اضافه کردن تابع جدید برای دریافت توکن مخصوص فروشگاه
const getBuyerToken = () => {
  const websiteId = localStorage.getItem('current_store_website_id');
  return localStorage.getItem(`buyer_token_${websiteId}`); // توکن مخصوص این فروشگاه
};

// 🔴 تغییر ۲: اصلاح اینترسپتور axios
api.interceptors.request.use((config) => {
  const token = getBuyerToken(); // استفاده از تابع جدید
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔴 تغییر 1: تابع کمکی برای دریافت website_id فروشگاه مشتری
const getStoreWebsiteId = () => {
    return localStorage.getItem('current_store_website_id');
};

// 🔴 تغییر 2: اصلاح تابع افزودن به سبد خرید
export const addItemToCart = async (itemId, quantity = 1) => {
    try {
        const websiteId = getStoreWebsiteId();
        if (!websiteId) throw new Error('Store website ID not found');

        const response = await api.post('/carts/add_item', {
            website_id: websiteId,
            item_id: itemId,
            quantity: quantity
        });
        return response.data;
    } catch (error) {
        console.error('Error adding item to cart:', error.response?.data || error);
        throw error;
    }
};

// 🔴 تغییر 3: اصلاح تابع دریافت سبد خرید
// دریافت سبد خرید فیلتر شده بر اساس website_id
export const getMyCart = async () => {
    try {
        const websiteId = localStorage.getItem('current_store_website_id');
        if (!websiteId) throw new Error('Store website ID not found');

        const response = await api.get('/carts/my_cart');
        // فیلتر کردن آیتم‌ها بر اساس website_id
        const filteredItems = response.data.filter(item => item.website_id === websiteId);
        return filteredItems;
    } catch (error) {
        console.error('Error fetching cart:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            localStorage.removeItem('buyer_access_token');
        }
        throw error;
    }
};

// 🔴 تغییر 4: اصلاح توابع دیگر به همین شکل
export const removeOneFromCart = async (cartItemId) => {
    try {
        const websiteId = getStoreWebsiteId();
        if (!websiteId) throw new Error('Store website ID not found');

        const response = await api.post(`/carts/remove_one_from_cart/${cartItemId}`, {
            website_id: websiteId
        });
        return response.data;
    } catch (error) {
        console.error('Error removing one from cart:', error.response?.data || error);
        throw error;
    }
};

export const deleteItemFromCart = async (cartItemId) => {
    try {
        const websiteId = getStoreWebsiteId();
        if (!websiteId) throw new Error('Store website ID not found');

        const response = await api.delete(`/carts/cart/delete_item/${cartItemId}`, {
            data: { website_id: websiteId }
        });
        return response.data;
    } catch (error) {
        console.error('Delete error:', error.response?.data || error);
        throw error;
    }
};