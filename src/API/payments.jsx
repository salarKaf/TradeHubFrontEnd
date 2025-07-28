import axios from 'axios';
import { coreBaseURL } from './api';

// گرفتن لیست پلنها
export const getAllPlans = async () => {
  try {
    const response = await axios.get(`${coreBaseURL}/plan/get-all-plans/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

// درخواست پرداخت برای پلن
export const requestPlanPayment = async (planId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('لطفاً وارد حساب کاربری خود شوید');
    }
    const response = await axios.post(
      `${coreBaseURL}/payment/plan_payment_request/${planId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error requesting payment:', error);
    throw error;
  }
};

// بررسی وضعیت پرداخت
export const checkPaymentStatus = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${coreBaseURL}/payment/order_payment/callback/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

export const requestOrderPayment = async (token) => {
  try {
    const websiteId = localStorage.getItem('current_store_website_id');
    if (!websiteId) {
      throw new Error('Website ID not found in localStorage');
    }
    if (!token) {
      throw new Error('لطفاً وارد حساب کاربری خود شوید');
    }
    const response = await axios.post(
      `${coreBaseURL}/payment/order_request?website_id=${websiteId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error requesting payment:', error);
    throw error;
  }
};
export const handlePaymentCallback = async (orderId, authority, status) => {
  try {
    const websiteId = localStorage.getItem('current_store_website_id');
    const token = localStorage.getItem(`buyer_token_${websiteId}`);
    if (!token) {
      throw new Error('توکن احراز هویت یافت نشد');
    }

    console.log('🔄 دریافت اطلاعات callback:', { authority, paymentStatus: status, orderId, websiteId });

    if (!authority || !status) {
      console.error('❌ اطلاعات پرداخت ناقص است');
      throw new Error('اطلاعات پرداخت ناقص است');
    }

    // ✅ استفاده از axios به جای fetch
    const response = await axios.get(
      `${coreBaseURL}/payment/order_payment/callback/${orderId}`,
      {
        params: {
          website_id: websiteId,  // ✅ اضافه کردن website_id
          Authority: authority,
          Status: status
        },
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ پرداخت با موفقیت پردازش شد:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error processing payment callback:', error);
    throw error;  
  }
};