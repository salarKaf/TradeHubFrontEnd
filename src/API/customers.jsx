// فایل: /src/API/customers.js
import { coreBaseURL } from './api';

export const fetchCustomerSummary = async (websiteId, token) => {
    const response = await fetch(`${coreBaseURL}/websites/buyers/summary/${websiteId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'خطا در دریافت اطلاعات مشتریان');
        error.response = data;
        throw error;
    }

    return data;
};







// تعداد کل مشتریان
export const getTotalBuyers = async (websiteId, token) => {
    const res = await fetch(`${coreBaseURL}/websites/buyers/count/${websiteId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error('خطا در دریافت تعداد مشتریان');
    return await res.json();
};

// میانگین سفارش هر مشتری
export const getAverageOrder = async (websiteId, token) => {
    const res = await fetch(`${coreBaseURL}/websites/buyers/average-order/${websiteId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error('خطا در دریافت میانگین سفارش');
    return await res.json();
};

// تعداد مشتریان فعال
export const getActiveBuyers = async (websiteId, token) => {
    const res = await fetch(`${coreBaseURL}/websites/buyers/active/count/${websiteId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error('خطا در دریافت مشتریان فعال');
    return await res.json();
};
