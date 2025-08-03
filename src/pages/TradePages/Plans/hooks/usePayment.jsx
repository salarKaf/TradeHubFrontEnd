import { useState } from 'react';
import axios from 'axios';

const usePayment = () => {
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const callPaymentApi = async (planId, websiteId) => {
        try {
            setIsProcessingPayment(true);
            const token = localStorage.getItem("token");

            console.log('🔥 Sending payment request for plan:', planId, 'website:', websiteId);

            const response = await axios.post(
                `https://core-tradehub.liara.run/api/v1/payment/plan_payment_request/${planId}`,
                {
                    website_id: websiteId 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Payment response:', response.data);
            const paymentUrl = response.data?.payment_url;

            if (paymentUrl) {
                localStorage.setItem('payment_info', JSON.stringify({
                    planId: planId,
                    websiteId: websiteId,
                    timestamp: Date.now()
                }));

                window.location.href = paymentUrl;
                return { success: true };
            } else {
                throw new Error("آدرس درگاه پرداخت دریافت نشد!");
            }
        } catch (error) {
            console.error('❌ Payment API Error:', error);

            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);

                if (error.response.status === 422) {
                    alert('داده‌های ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.');
                } else if (error.response.status === 404) {
                    alert('پلن مورد نظر یافت نشد.');
                } else if (error.response.status === 401) {
                    alert('احراز هویت شما منقضی شده. لطفاً مجدداً وارد شوید.');
                } else {
                    alert('خطا در پردازش درخواست پرداخت. لطفاً دوباره تلاش کنید.');
                }
            } else if (error.request) {
                alert('خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
            } else {
                alert('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.');
            }

            throw error;
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const callFreeTrialApi = async (websiteId) => {
        try {
            setIsProcessingPayment(true);
            const token = localStorage.getItem("token");

            console.log('🔥 Sending free trial request for website:', websiteId);

            const response = await axios.post(
                `https://core-tradehub.liara.run/api/v1/payment/order_request`,
                {
                    website_id: websiteId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Free trial response:', response.data);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Free trial API Error:', error);

            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);

                if (error.response.status === 422) {
                    alert('داده‌های ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.');
                } else if (error.response.status === 401) {
                    alert('احراز هویت شما منقضی شده. لطفاً مجدداً وارد شوید.');
                } else {
                    alert('خطا در پردازش درخواست. لطفاً دوباره تلاش کنید.');
                }
            } else {
                alert('خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.');
            }

            throw error;
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const activateFreePlan = async (websiteId) => {
        try {
            setIsProcessingPayment(true);
            const token = localStorage.getItem("token");

            console.log('🔥 Activating free plan for website:', websiteId);

            const response = await axios.post(
                `https://core-tradehub.liara.run/api/v1/plan/activate-free-plan?website_id=${websiteId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("✅ Free plan activated:", response.data);
            
            alert('🎉 تبریک! پلن رایگان شما با موفقیت فعال شد!\nهم‌اکنون می‌توانید از تمام امکانات به مدت ۷ روز استفاده کنید.');
            
            setTimeout(() => 1000);
            
            return { success: true, data: response.data };
        } catch (error) {
            console.error("❌ Error activating free plan:", error);
            
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                
                if (error.response.status === 422) {
                    alert('داده‌های ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.');
                } else if (error.response.status === 404) {
                    alert('وب‌سایت مورد نظر یافت نشد.');
                } else if (error.response.status === 400) {
                    alert('درخواست نامعتبر است.');
                } else if (error.response.status === 401) {
                    alert('احراز هویت شما منقضی شده. لطفاً مجدداً وارد شوید.');
                } else {
                    alert('خطا در فعال‌سازی پلن رایگان. لطفاً دوباره تلاش کنید.');
                }
            } else {
                alert('خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.');
            }
            
            return { success: false, error: error.response?.data };
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const checkPaymentCallback = async (authority, status, websiteId, planId) => {
        try {
            const token = localStorage.getItem("token");

            console.log('🔥 Checking payment callback:', {
                authority,
                status,
                websiteId,
                planId
            });

            const response = await axios.get(
                `https://core-tradehub.liara.run/api/v1/payment/plan_payment/callback`,
                {
                    params: {
                        website_id: websiteId,
                        plan_id: planId,
                        Authority: authority,
                        Status: status
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('✅ Payment callback response:', response.data);
            
            localStorage.removeItem('payment_info');
            
            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Payment callback error:', error);
            
            localStorage.removeItem('payment_info');
            
            return { success: false, error: error.response?.data };
        }
    };

    return {
        isProcessingPayment,
        setIsProcessingPayment,
        callPaymentApi,
        callFreeTrialApi,
        activateFreePlan,
        checkPaymentCallback,
    };
};

export default usePayment;