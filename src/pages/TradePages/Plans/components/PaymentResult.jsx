// components/PaymentResult.jsx
import React from 'react';

const PaymentResult = ({ paymentSuccess, selectedPlan, plans, onClose }) => {
    const selectedPlanData = plans.find(p => p.id === selectedPlan);

    const getExpiryDate = () => {
        const today = new Date();
        const expiry = new Date(today);
        expiry.setDate(today.getDate() + 30);
        return expiry.toLocaleDateString('fa-IR');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>

                {paymentSuccess ? (
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                            تبریک! 🎉
                        </h2>
                        <p className="text-gray-600 mb-6 text-lg">
                            پلن {selectedPlanData?.name} شما با موفقیت فعال شد
                        </p>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-sm font-medium text-blue-700">مدت اعتبار</span>
                            </div>
                            <p className="text-sm text-gray-700">
                                این پلن تا تاریخ <span className="font-bold text-blue-600">{getExpiryDate()}</span> فعال خواهد بود
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            شروع استفاده از پلن
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">اوپس! 😔</h2>
                        <p className="text-gray-600 mb-6 text-lg">
                            متأسفانه پرداخت شما با خطا مواجه شد
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            تلاش مجدد
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
