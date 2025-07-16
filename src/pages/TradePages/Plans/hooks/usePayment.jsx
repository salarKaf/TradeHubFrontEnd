
// hooks/usePayment.js
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

    return {
        isProcessingPayment,
        setIsProcessingPayment,
        callPaymentApi
    };
};

export default usePayment;
