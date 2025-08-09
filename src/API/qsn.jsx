import axios from 'axios';

import { coreBaseURL } from './api';
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

export const answerQuestion = async (questionId, answerText) => {
    try {
        const sellerToken = localStorage.getItem('token'); 
        
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