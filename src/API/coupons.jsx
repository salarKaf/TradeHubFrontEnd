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

export const createCoupon = async (couponData) => {
  try {
    const response = await axios.post(
      `${coreBaseURL}/coupon/create_coupon`,
      couponData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error creating coupon:', error);
    if (error?.response) {
      console.error('↪️ Response status:', error.response.status);
      console.error('↪️ Response data:', error.response.data);
    }
    throw error;
  }
};

export const getCouponsByWebsite = async (websiteId) => {
  try {
    const response = await axios.get(
      `${coreBaseURL}/coupon/website/${websiteId}/coupons`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching coupons:', error);
    if (error?.response) {
      console.error('↪️ Response status:', error.response.status);
      console.error('↪️ Response data:', error.response.data);
    }
    throw error;
  }
};

// Delete coupon
export const deleteCoupon = async (couponId) => {
  try {
    const response = await axios.delete(
      `${coreBaseURL}/coupon/coupon/${couponId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting coupon:', error);
    if (error?.response) {
      console.error('↪️ Response status:', error.response.status);
      console.error('↪️ Response data:', error.response.data);
    }
    throw error;
  }
};

export const getCouponsByWebsiteInStore = async (websiteId) => {
  try {
    const buyerToken = localStorage.getItem(`buyer_token_${websiteId}`);
    if (!buyerToken) {
      throw new Error('Buyer token not found');
    }

    const response = await axios.get(
      `${coreBaseURL}/coupon/website/${websiteId}/coupons`,
      {
        headers: {
          Authorization: `Bearer ${buyerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching coupons (store):', error);
    if (error?.response) {
      console.error('↪️ Response status:', error.response.status);
      console.error('↪️ Response data:', error.response.data);
    }
    throw error;
  }
};

export const applyCouponToOrder = async (orderId, couponCode) => {
  try {
    const websiteId = localStorage.getItem('current_store_website_id');
    const buyerToken = localStorage.getItem(`buyer_token_${websiteId}`);

    if (!buyerToken) {
      throw new Error('Buyer token not found');
    }

    console.log('🔍 Applying coupon with payload:', { orderId, couponCode });

    const response = await axios.post(
      `${coreBaseURL}/order/apply_coupon`,
      {},
      {
        params: {
          order_id: orderId,
          coupon_code: couponCode,
        },
        headers: {
          Authorization: `Bearer ${buyerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Error applying coupon:', error);
    if (error?.response) {
      console.error('↪️ Response status:', error.response.status);
      console.error('↪️ Response data:', error.response.data);
      if (error.response.data?.detail) {
        console.error('↪️ Response detail:', error.response.data.detail);
      }
    }
    throw error;
  }
};
