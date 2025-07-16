import { useState, useEffect } from 'react';

// API functions
const fetchPlans = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch('/api/v1/plan/get-all-plans/', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
};

const requestPlanPayment = async (planId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/v1/payment/plan_payment_request/${planId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
};

const checkPaymentStatus = async () => {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const response = await fetch(`/api/v1/payment/plan_payment/callback?${urlParams.toString()}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
};

const PaymentResultPage = () => {
    const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', 'pending'
    const [planData, setPlanData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const isCallback = urlParams.has('status') || urlParams.has('success') || urlParams.has('order_id');
        
        if (isCallback) {
            // Handle payment callback
            checkPaymentStatus()
                .then(data => {
                    setPaymentStatus(data.status || 'success'); // assuming API returns {status: 'success'/'failed'/'pending'}
                    if (data.plan) {
                        setPlanData(data.plan);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Payment status check failed:', error);
                    setPaymentStatus('failed');
                    setLoading(false);
                });
        } else {
            // Load plans from API and set default status
            fetchPlans()
                .then(plans => {
                    console.log('Available plans:', plans);
                    const planParam = urlParams.get('plan');
                    console.log('Plan parameter from URL:', planParam);
                    let selectedPlan = null;
                    
                    if (planParam) {
                        // Try to find by ID first (UUID format)
                        selectedPlan = plans.find(p => p.id === planParam);
                        
                        // If not found by ID, try to find by name (for backward compatibility)
                        if (!selectedPlan) {
                            selectedPlan = plans.find(p => p.name.toLowerCase() === planParam.toLowerCase());
                        }
                    }
                    
                    // Default to first plan if none found
                    if (!selectedPlan && plans.length > 0) {
                        selectedPlan = plans[0];
                    }
                    
                    console.log('Selected plan:', selectedPlan);
                    setPlanData(selectedPlan);
                    
                    // If we have a plan parameter but no plan found, show failed
                    if (planParam && !selectedPlan) {
                        setPaymentStatus('failed');
                    } else {
                        setPaymentStatus('success'); // default for demo
                    }
                    
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Failed to fetch plans:', error);
                    setPaymentStatus('failed');
                    setLoading(false);
                });
        }
    }, []);

    const getExpiryDate = () => {
        const today = new Date();
        const expiry = new Date(today);
        expiry.setDate(today.getDate() + 30);
        return expiry.toLocaleDateString('fa-IR');
    };

    const handleReturnToDashboard = () => {
        window.location.replace('/storeForm');
    };

    const handleRetryPayment = () => {
        console.log('Retrying payment for plan:', planData);
        if (planData?.id) {
            setLoading(true);
            console.log('Sending payment request for plan ID:', planData.id);
            requestPlanPayment(planData.id)
                .then(response => {
                    console.log('Payment response:', response);
                    if (response.payment_url) {
                        window.location.href = response.payment_url;
                    } else {
                        window.location.replace('/PricingPlans');
                    }
                })
                .catch(error => {
                    console.error('Payment request failed:', error);
                    setLoading(false);
                    alert('خطا در درخواست پرداخت: ' + error.message);
                });
        } else {
            console.log('No plan data available, redirecting to pricing');
            window.location.replace('/PricingPlans');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                    <h2 className="text-xl font-bold">در حال بررسی وضعیت پرداخت...</h2>
                    <p>لطفاً کمی صبر کنید</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4" dir="rtl">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center relative overflow-hidden">
                <div className={`absolute inset-0 opacity-10 animate-pulse bg-gradient-to-r ${
                    paymentStatus === 'success'
                        ? 'from-green-400/20 to-blue-400/20'
                        : paymentStatus === 'failed'
                        ? 'from-red-400/20 to-pink-400/20'
                        : 'from-yellow-400/20 to-orange-400/20'
                }`}></div>

                <div className="relative">
                    {paymentStatus === 'success' && (
                        <>
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-green-600 mb-4">پرداخت با موفقیت انجام شد</h1>
                            <p className="text-gray-600 mb-6">
                                پلن <strong className="text-purple-600">{planData?.name}</strong> فعال شده و تا تاریخ <strong>{getExpiryDate()}</strong> معتبر است.
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700 mb-6">
                                <p><strong>مبلغ پرداختی:</strong> {planData?.price ? new Intl.NumberFormat('fa-IR').format(planData.price) : 'نامشخص'} تومان</p>
                                <p><strong>مدت اعتبار:</strong> 30 روز</p>
                            </div>
                            <button
                                onClick={handleReturnToDashboard}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-blue-700"
                            >
                                🚀 ورود به داشبورد
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200"
                            >
                                📄 چاپ رسید
                            </button>
                        </>
                    )}

                    {paymentStatus === 'failed' && (
                        <>
                            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-red-600 mb-4">پرداخت ناموفق</h1>
                            <p className="text-gray-600 mb-6">لطفاً مجدد تلاش کنید یا با پشتیبانی تماس بگیرید.</p>
                            <button
                                onClick={handleRetryPayment}
                                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-red-700 hover:to-pink-700"
                                disabled={loading}
                            >
                                {loading ? 'در حال انتقال...' : 'تلاش مجدد'}
                            </button>
                            <button
                                onClick={() => window.location.href = '/support'}
                                className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200"
                            >
                                📞 تماس با پشتیبانی
                            </button>
                        </>
                    )}

                    {paymentStatus === 'pending' && (
                        <>
                            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-spin">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-yellow-600 mb-4">در انتظار تایید</h1>
                            <p className="text-gray-600 mb-6">پرداخت شما هنوز تایید نشده، لطفاً چند دقیقه دیگر دوباره بررسی کنید.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600"
                            >
                                🔄 بررسی مجدد
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentResultPage;