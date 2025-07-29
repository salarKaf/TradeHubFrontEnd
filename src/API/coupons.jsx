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



// دریافت لیست کوپن‌های یک وبسایت
export const getCouponsByWebsiteInStore = async (websiteId) => {
    try {
        // 🔧 گرفتن buyer token از localStorage
        const buyerToken = localStorage.getItem(`buyer_token_${websiteId}`);
        
        if (!buyerToken) {
            throw new Error('توکن buyer یافت نشد');
        }

        const response = await axios.get(`${coreBaseURL}/coupon/website/${websiteId}/coupons`, {
            headers: {
                'Authorization': `Bearer ${buyerToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('❌ خطا در دریافت کوپن‌ها:', error);
        throw error;
    }
};
export const applyCouponToOrder = async (orderId, couponCode) => {
  try {
    const websiteId = localStorage.getItem('current_store_website_id');
    const buyerToken = localStorage.getItem(`buyer_token_${websiteId}`);
    
    if (!buyerToken) {
      throw new Error('توکن buyer یافت نشد');
    }

    console.log('🔍 Sending request with:', { orderId, couponCode }); // اضافه کن

    const response = await axios.post(`${coreBaseURL}/order/apply_coupon`, {}, {
      params: {
        order_id: orderId,  // چک کن orderId null نباشه
        coupon_code: couponCode
      },
      headers: {
        'Authorization': `Bearer ${buyerToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('❌ خطا در اعمال کوپن:', error);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response detail:', error.response.data.detail); // اضافه کن
      console.error('Response status:', error.response.status);
    }
    
    throw error;
  }
};