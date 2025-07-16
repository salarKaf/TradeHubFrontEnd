import { useState } from 'react';
import axios from 'axios';

const usePayment = () => {
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const callPaymentApi = async (planId) => {
        try {
            const token = localStorage.getItem("token");

            console.log('Sending payment request for plan:', planId);

            const response = await axios.post(
                `http://tradehub.localhost/api/v1/payment/plan_payment_request/${planId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const paymentUrl = response.data?.payment_url;

            if (paymentUrl) {
                window.location.href = paymentUrl;
                return { success: true };
            } else {
                throw new Error("آدرس درگاه دریافت نشد!");
            }
        } catch (error) {
            console.error('Payment API Error:', error);

            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);

                if (error.response.status === 422) {
                    alert('داده‌های ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.');
                } else if (error.response.status === 404) {
                    alert('پلن مورد نظر یافت نشد.');
                } else {
                    alert('خطا در پردازش درخواست. لطفاً دوباره تلاش کنید.');
                }
            } else {
                alert('خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.');
            }

            throw error;
        }
    };

    const callFreeTrialApi = async () => {
        try {
            const token = localStorage.getItem("token");

            console.log('Sending free trial request');

            const response = await axios.post(
                `http://tradehub.localhost/api/v1/payment/order_request`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Free trial response:', response.data);

            return { success: true };
        } catch (error) {
            console.error('Free trial API Error:', error);

            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);

                if (error.response.status === 422) {
                    alert('داده‌های ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.');
                } else {
                    alert('خطا در پردازش درخواست. لطفاً دوباره تلاش کنید.');
                }
            } else {
                alert('خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.');
            }

            throw error;
        }
    };


    const activateFreePlan = async (websiteId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://tradehub.localhost/api/v1/plan/activate-free-plan",
                { website_id: websiteId }, // 👈 اینجا نیازی به stringify نیست
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("✅ Free plan activated:", response.data);
            return { success: true };
        } catch (error) {
            console.error("❌ Error activating free plan:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
            return { success: false };
        }
    };





    return {
        isProcessingPayment,
        setIsProcessingPayment,
        callPaymentApi,
        callFreeTrialApi,
        activateFreePlan, // 🔥 اضافه کن اینجا
    };


};

export default usePayment;