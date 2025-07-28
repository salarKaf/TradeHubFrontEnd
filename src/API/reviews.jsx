// reviewsAPI.js
import axios from 'axios';

import {coreBaseURL} from './api';

// دریافت توکن خریدار
const getBuyerToken = () => {
    const websiteId = localStorage.getItem('current_store_website_id');
    if (websiteId) {
        return localStorage.getItem(`buyer_token_${websiteId}`);
    }
    return null;
};

// دریافت website_id
const getWebsiteId = () => {
    return localStorage.getItem('current_store_website_id');
};

// ساخت هدرهای احراز هویت
const getAuthHeaders = () => {
    const token = getBuyerToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// ایجاد نظر جدید
export const createReview = async (itemId, rating, text) => {
    try {
        const websiteId = getWebsiteId();
        if (!websiteId) {
            throw new Error('Website ID not found');
        }

        const response = await fetch(`${coreBaseURL}/review/create_review`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                website_id: websiteId,
                item_id: itemId,
                rating: rating,
                text: text
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

// دریافت نظرات یک محصول
export const getItemReviews = async (itemId) => {
    try {
        const response = await fetch(`${coreBaseURL}/review/items/${itemId}/reviews`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

// دریافت یک نظر خاص
export const getReview = async (reviewId) => {
    try {
        const response = await fetch(`${coreBaseURL}/review/reviews/${reviewId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching review:', error);
        throw error;
    }
};