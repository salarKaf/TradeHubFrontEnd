import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [paymentResult, setPaymentResult] = useState(null);

    useEffect(() => {
        const processPaymentCallback = async () => {
            try {
                const status = searchParams.get('Status') || searchParams.get('status');
                console.log('🔥 Processing payment callback, status:', status);

                let websiteId = null;
                try {
                    const paymentInfo = JSON.parse(localStorage.getItem('payment_info') || '{}');
                    websiteId = paymentInfo.websiteId;
                } catch (e) {
                    console.log('LocalStorage payment info not found');
                }

                if (!websiteId) {
                    const referrer = document.referrer;
                    if (referrer && referrer.includes('PricingPlans/')) {
                        websiteId = referrer.split('PricingPlans/')[1];
                    }
                }

                if (status === 'success' || status === 'OK') {
                    setPaymentResult({
                        success: true,
                        message: 'پلن شما با موفقیت فعال شد!',
                        websiteId: websiteId
                    });
                } else {
                    setPaymentResult({
                        success: false,
                        message: 'پرداخت لغو شد یا ناموفق بود',
                        websiteId: websiteId
                    });
                }

                localStorage.removeItem('payment_info');

            } catch (error) {
                console.error('❌ Payment callback error:', error);
                setPaymentResult({
                    success: false,
                    message: 'خطا در پردازش نتیجه پرداخت',
                    websiteId: null
                });
            } finally {
                setLoading(false);
            }
        };

        setTimeout(processPaymentCallback, 1000);
    }, [searchParams]);

    const handleContinue = () => {
        if (paymentResult?.success && paymentResult?.websiteId) {
            navigate(`/rules/${paymentResult.websiteId}`);
        } else if (paymentResult?.websiteId) {
            navigate(`/PricingPlans/${paymentResult.websiteId}`);
        } else {
            navigate('/');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">در حال بررسی نتیجه پرداخت...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center" dir="rtl">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                        paymentResult?.success ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                        {paymentResult?.success ? (
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    
                    <h2 className={`text-2xl font-bold mb-4 ${
                        paymentResult?.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {paymentResult?.success ? 'پرداخت موفق!' : 'پرداخت ناموفق'}
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                        {paymentResult?.message}
                    </p>
                    
                    <button
                        onClick={handleContinue}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                            paymentResult?.success 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                        {paymentResult?.success ? 'ادامه و شروع' : 'تلاش مجدد'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCallback;