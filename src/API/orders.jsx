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

export const getMyOrders = async () => {
  const websiteId = localStorage.getItem('current_store_website_id');
  const token = localStorage.getItem(`buyer_token_${websiteId}`);

  if (!token) throw new Error('توکن موجود نیست');

  const response = await axios.get(`${coreBaseURL}/order/my_orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};





import { getProductById } from './Items'; // مسیر صحیح به API محصول

export const getOrderWithProduct = async (orderId) => {
  const websiteId = localStorage.getItem('current_store_website_id');
  const token = localStorage.getItem(`buyer_token_${websiteId}`);

  const response = await axios.get(`${coreBaseURL}/order/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const order = response.data;

  if (!order?.order_items?.length) {
    throw new Error('آیتمی در سفارش یافت نشد');
  }

  const orderItem = order.order_items[0]; // اگر همیشه فقط یک آیتم داریم

  const product = await getProductById(orderItem.item_id);

  return {
    product,
    priceAtPurchase: parseFloat(orderItem.price),
    itemId: orderItem.item_id,
    quantity: orderItem.quantity,
    status: order.status,
    createdAt: order.created_at
  };
};
