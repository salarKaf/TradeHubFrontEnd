


// components/PricingHeader.jsx
import React from 'react';

const PricingHeader = () => {
    return (
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
                قدرت واقعی فروش آنلاین
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                با سیستم مدیریت حرفه‌ای ما، فروش خود را <span className="font-bold text-purple-400">5 برابر</span> افزایش دهید
                <br />
                هزاران کسب‌وکار موفق از ما استفاده می‌کنند
            </p>
        </div>
    );
};

export default PricingHeader;