import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaSortAmountDown, FaStar } from "react-icons/fa";

const ProductReviews = ({ reviews, onAddReply, onLikeReview, onDislikeReview, onLikeReply, onDislikeReply }) => {
    const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'mostHelpful'
    const [activeReplyForm, setActiveReplyForm] = useState(null);
    const [newReply, setNewReply] = useState('');

    // مرتب سازی نظرات
    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'mostHelpful') {
            return b.likes - a.likes;
        }
        return 0;
    });

    const handleSubmitReply = (reviewId) => {
        if (newReply.trim()) {
            onAddReply(reviewId, {
                text: newReply,
                createdAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0
            });
            setNewReply('');
            setActiveReplyForm(null);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#fef8e7] rounded-xl p-6 space-y-6 shadow border border-gray-200 mt-12">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">نظرات</h3>
            </div>

            <p className="text-sm text-gray-700">{`تعداد ${reviews.length} نظر درباره‌ی این محصول وجود دارد.`}</p>

            {/* بخش مرتب سازی */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaSortAmountDown />
                    مرتب سازی بر اساس:
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortBy('newest')}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${sortBy === 'newest'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        جدیدترین
                    </button>
                    <button
                        onClick={() => setSortBy('mostHelpful')}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${sortBy === 'mostHelpful'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        مفیدترین
                    </button>
                </div>
            </div>

            {/* نظرات */}
            {sortedReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-300 pb-6 last:border-b-0">
                    {/* اطلاعات کاربر و امتیاز */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800">{review.userName}</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString('fa-IR')}
                                </span>
                            </div>

                            {/* امتیاز با ستاره */}
                            <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-600">({review.rating}/5)</span>
                            </div>
                        </div>
                    </div>

                    {/* متن نظر */}
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">{review.text}</p>


                    {/* عملیات نظر */}

                    {/* فرم پاسخ */}
                    {activeReplyForm === review.id && (
                        <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                            <div className="mb-3">
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                    پاسخ به عنوان خریدار
                                </span>
                            </div>

                            <textarea
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="پاسخ خود را بنویسید..."
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm"
                                rows="3"
                            />

                            <div className="flex gap-2 justify-end mt-3">
                                <button
                                    onClick={() => {
                                        setActiveReplyForm(null);
                                        setNewReply('');
                                    }}
                                    className="px-4 py-2 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={() => handleSubmitReply(review.id)}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    ارسال پاسخ
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProductReviews;