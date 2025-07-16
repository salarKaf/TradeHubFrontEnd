 import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import usePayment from '../hooks/usePayment';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkPaymentCallback } = usePayment();
    
    const [loading, setLoading] = useState(true);
    const [paymentResult, setPaymentResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const processPaymentCallback = async () => {
            try {
                // گرفتن پارامترهای callback از URL
                const authority = searchParams.get('Authority');
                const status = searchParams.get('Status');
                
                console.log('🔥 Processing payment callback:', { authority, status });

                // گرفتن اطلاعات پرداخت از localStorage
                const paymentInfo = JSON.parse(localStorage.getItem('payment_info') || '{}');
                const { planId, websiteId } = paymentInfo;

                if (!authority || !status) {
                    throw new Error('پارامترهای callback ناقص هستند');
                }

                if (!planId || !websiteId) {
                    throw new Error('اطلاعات پرداخت یافت نشد');
                }

                // بررسی وضعیت پرداخت
                const result = await checkPaymentCallback(authority, status, websiteId, planId);
                
                if (result.success) {
                    setPaymentResult({
                        success: true,
                        message: 'پرداخت با موفقیت انجام شد',
                        planId,
                        websiteId
                    });
                } else {
                    setPaymentResult({
                        success: false,
                        message: 'پرداخت ناموفق بود',
                        planId,
                        websiteId
                    });
                }
            } catch (error) {
                console.error('❌ Payment callback error:', error);
                setError(error.message || 'خطا در پردازش نتیجه پرداخت');
            } finally {
                setLoading(false);
            }
        };

        processPaymentCallback();
    }, [searchParams, checkPaymentCallback]);

    const handleContinue = () => {
        if (paymentResult?.success) {
            // در صورت موفقیت، به صفحه rules هدایت کن
            navigate(`/rules/${paymentResult.websiteId}`);
        } else {
            // در صورت ناموفق بودن، به صفحه pricing برگرد
            navigate(`/pricing/${paymentResult?.websiteId || ''}`);
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center" dir="rtl">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">خطا در پردازش</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/pricing')}
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            بازگشت به صفحه پلن‌ها
                        </button>
                    </div>
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
                        {paymentResult?.success ? 'پرداخت موفق' : 'پرداخت ناموفق'}
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
                        {paymentResult?.success ? 'ادامه' : 'تلاش مجدد'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCallback;