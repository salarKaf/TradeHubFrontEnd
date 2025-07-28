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
// API functions for orders and payment
// Add these to your API folder

// orders.js

export const createOrder = async (websiteId, token) => {
  try {
    const response = await fetch(`${coreBaseURL}/order/create_order?website_id=${websiteId}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Order created successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
};

