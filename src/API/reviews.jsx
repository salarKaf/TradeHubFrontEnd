import axios from 'axios';

import {coreBaseURL} from './api';

const getBuyerToken = () => {
    const websiteId = localStorage.getItem('current_store_website_id');
    if (websiteId) {
        return localStorage.getItem(`buyer_token_${websiteId}`);
    }
    return null;
};

const getWebsiteId = () => {
    return localStorage.getItem('current_store_website_id');
};

const getAuthHeaders = () => {
    const token = getBuyerToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

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