import axios from 'axios';
import { coreBaseURL } from './api';

const api = axios.create({
    baseURL: coreBaseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const getBuyerToken = () => {
  const websiteId = localStorage.getItem('current_store_website_id');
  return localStorage.getItem(`buyer_token_${websiteId}`); // توکن مخصوص این فروشگاه
};

api.interceptors.request.use((config) => {
  const token = getBuyerToken(); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getStoreWebsiteId = () => {
    return localStorage.getItem('current_store_website_id');
};

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




export const getMyCart = async () => {
    try {
        const websiteId = localStorage.getItem('current_store_website_id');
        if (!websiteId) throw new Error('Store website ID not found');

        const response = await api.get('/carts/my_cart');
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





export const getMyCartItem = async () => {
  try {
    const websiteId = localStorage.getItem('current_store_website_id');
    if (!websiteId) throw new Error('Store website ID not found');

    const response = await api.get('/carts/my_cart');
    const filteredItems = response.data.filter(item => item.website_id === websiteId);
    return { items: filteredItems }; 
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