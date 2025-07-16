import React from 'react';

const PricingCard = ({ plan, onSelect, isProcessing, selectedPlan }) => {
    const isCurrentlyProcessing = isProcessing && selectedPlan === plan.id;

    return (
        <div className={`relative group ${plan.popular ? 'transform scale-105' : ''}`}>
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-3xl ${
                plan.popular
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                    : plan.isFree
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20'
                    : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
            } blur-xl group-hover:blur-2xl transition-all duration-300`}></div>

            {/* Card */}
            <div className={`relative bg-white/10 backdrop-blur-xl rounded-3xl border ${
                plan.popular
                    ? 'border-purple-500/30 shadow-purple-500/20'
                    : plan.isFree
                    ? 'border-green-500/30 shadow-green-500/20'
                    : 'border-white/20'
            } shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 flex flex-col`}>

                {/* Popular Badge */}
                {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white px-8 py-3 rounded-bl-3xl shadow-lg z-10">
                        <span className="text-sm font-bold">{plan.badge}</span>
                    </div>
                )}

                {/* Free Badge */}
                {plan.isFree && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-emerald-500 text-white px-8 py-3 rounded-bl-3xl shadow-lg z-10">
                        <span className="text-sm font-bold">{plan.badge}</span>
                    </div>
                )}

                {/* Regular Badge */}
                {!plan.popular && !plan.isFree && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                        {plan.badge}
                    </div>
                )}

                {/* Plan Header */}
                <div className="p-8 text-center relative min-h-[200px] flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-t-3xl"></div>
                    <div className="relative">
                        <h3 className="text-3xl font-bold mb-2 text-white">{plan.name}</h3>
                        <p className="text-gray-300 mb-4">{plan.subtitle}</p>

                        {/* Price Section */}
                        <div className="mb-4">
                            {plan.isFree ? (
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-4xl font-bold text-green-400">رایگان</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-4xl font-bold text-white">
                                        {new Intl.NumberFormat('fa-IR').format(plan.price)}
                                    </span>
                                    <span className="text-xl text-gray-300">تومان</span>
                                </div>
                            )}
                            <p className="text-gray-400 mt-2">
                                {plan.isFree 
                                    ? 'هفت روز تست کامل رایگان!' 
                                    : `فقط ${new Intl.NumberFormat('fa-IR').format(plan.dailyPrice)} تومان در روز!`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                        <h4 className="font-bold text-lg text-white mb-4">✨ امکانات شامل:</h4>
                        <ul className="space-y-3">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mt-0.5 shadow-md">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-300 leading-relaxed text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-6 pt-4">
                        <button
                            onClick={() => onSelect(plan.id)}
                            disabled={isCurrentlyProcessing}
                            className={`w-full py-3 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                                isCurrentlyProcessing
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : plan.isFree
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105'
                                        : plan.color === 'gradient'
                                        ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white hover:from-purple-600 hover:via-blue-600 hover:to-pink-600 hover:scale-105'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105'
                            }`}
                        >
                            {isCurrentlyProcessing ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>
                                        {plan.isFree ? 'در حال فعال‌سازی...' : 'در حال اتصال به درگاه پرداخت...'}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>
                                        {plan.isFree ? 'شروع تست رایگان' : 'خرید پلن'}
                                    </span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        {/* Trust Indicators */}
                        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                                <span>{plan.isFree ? 'بدون نیاز کارت' : 'پرداخت امن'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span>فعالسازی فوری</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingCard;