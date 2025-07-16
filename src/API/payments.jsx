// 1. ایجاد فایل services/paymentService.js
import axios from 'axios';

import {coreBaseURL} from './api';
// گرفتن لیست پلن‌ها
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