// questionsAPI.js
; // آدرس API خودت رو اینجا بذار
// reviewsAPI.js
import axios from 'axios';

import { coreBaseURL } from './api';
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

// ایجاد سوال جدید
export const createQuestion = async (itemId, questionText) => {
    try {
        const websiteId = getWebsiteId();
        if (!websiteId) {
            throw new Error('Website ID not found');
        }

        const response = await fetch(`${coreBaseURL}/question/create_question`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                website_id: websiteId,
                item_id: itemId,
                question_text: questionText
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
};

// پاسخ دادن به سوال
export const answerQuestion = async (questionId, answerText) => {
    try {
        // مستقیماً seller token رو از localStorage بگیر
        const sellerToken = localStorage.getItem('token'); // یا هر key که برای seller token استفاده می‌کنی
        
        const response = await fetch(`${coreBaseURL}/question/questions/${questionId}/answer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(sellerToken && { 'Authorization': `Bearer ${sellerToken}` })
            },
            body: JSON.stringify({
                answer_text: answerText
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error answering question:', error);
        throw error;
    }
};

// دریافت سوالات یک محصول
export const getItemQuestions = async (itemId) => {
    try {
        const response = await fetch(`${coreBaseURL}/question/items/${itemId}/questions`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

// دریافت یک سوال خاص
export const getQuestion = async (questionId) => {
    try {
        const response = await fetch(`${coreBaseURL}/question/questions/${questionId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
};