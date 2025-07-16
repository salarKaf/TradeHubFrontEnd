// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <h2 className="text-xl font-bold text-white">در حال بارگذاری پلن‌ها...</h2>
            </div>
        </div>
    );
};

export default LoadingSpinner;