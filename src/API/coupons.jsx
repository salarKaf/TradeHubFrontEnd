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

// ساخت کوپن جدید
export const createCoupon = async (couponData) => {
    try {
        const response = await axios.post(`${coreBaseURL}/coupon/create_coupon`, couponData,
            getAuthHeader() // 🔥 باید این باشه!

        );
        return response.data;
    } catch (error) {
        console.error('❌ خطا در ساخت کوپن:', error);
        throw error;
    }
};

// دریافت لیست کوپن‌های یک وبسایت
export const getCouponsByWebsite = async (websiteId) => {
    try {
        const response = await axios.get(`${coreBaseURL}/coupon/website/${websiteId}/coupons`,
            getAuthHeader() // 🔥 باید این باشه!
        );
        return response.data;
    } catch (error) {
        console.error('❌ خطا در دریافت کوپن‌ها:', error);
        throw error;
    }
};

// حذف کوپن
export const deleteCoupon = async (couponId) => {
    try {
        const response = await axios.delete(`${coreBaseURL}/coupon/coupon/${couponId}`,
            getAuthHeader() // 🔥 باید این باشه!

        );
        return response.data;
    } catch (error) {
        console.error('❌ خطا در حذف کوپن:', error);
        throw error;
    }
};