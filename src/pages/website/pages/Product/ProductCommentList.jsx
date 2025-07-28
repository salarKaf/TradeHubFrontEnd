import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, User, MessageSquare, Star } from 'lucide-react';
import { createReview, getItemReviews } from '../../../../API/reviews'; // مسیر فایل API رو درست کن
import { useParams } from 'react-router-dom';
const CommentsSystem = () => {
    const { productId } = useParams(); // برای گرفتن ID محصول


    const [comments, setComments] = useState([]); // خالی کن تا از API بیاد
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [newComment, setNewComment] = useState('');
    const [sortBy, setSortBy] = useState('جدیدترین');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewCommentForm, setShowNewCommentForm] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState({});
    const [newRating, setNewRating] = useState(5);
    // بعد از useState ها اضافه کن
    useEffect(() => {
        const loadReviews = async () => {
            try {
                setLoading(true);
                const reviews = await getItemReviews(productId);

                // تبدیل format API به format کامپوننت
                // تبدیل format API به format کامپوننت
                const formattedComments = reviews.map(review => ({
                    id: review.review_id,
                    text: review.text,
                    author: review.buyer_name, // ✅ تغییر از buyer_id به buyer_name
                    rating: review.rating,
                    timestamp: new Date(review.created_at).getTime(),
                }));

                setComments(formattedComments);
            } catch (err) {
                console.error('Error loading reviews:', err);
                setError('خطا در بارگذاری نظرات');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadReviews();
        }
    }, [productId]);

    // محاسبه تعداد کل نظرات
    const totalComments = comments.length;

    // مرتب‌سازی نظرات
    const sortedComments = useMemo(() => {
        const sorted = [...comments];
        switch (sortBy) {
            case 'جدیدترین':
                return sorted.sort((a, b) => b.timestamp - a.timestamp);
            case 'بالاترین امتیاز':
                return sorted.sort((a, b) => b.rating - a.rating);
            default:
                return sorted;
        }
    }, [comments, sortBy]);

    // فیلتر کردن نظرات بر اساس جستجو
    const filteredComments = useMemo(() => {
        if (!searchTerm.trim()) return sortedComments;
        return sortedComments.filter(comment =>
            comment.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedComments, searchTerm]);

    const addComment = async () => {
        if (newComment.trim()) {
            try {
                setLoading(true);

                // ساخت نظر در سرور
                const newReview = await createReview(productId, newRating, newComment);

                // اضافه کردن به state محلی
                const comment = {
                    id: newReview.review_id,
                    text: newReview.text,
                    author: 'شما',
                    rating: newReview.rating,
                    timestamp: new Date(newReview.created_at).getTime(),
                };

                setComments([comment, ...comments]);
                setNewComment('');
                setNewRating(5);
                setShowNewCommentForm(false);
            } catch (err) {
                console.error('Error creating review:', err);
                alert('خطا در ثبت نظر. لطفاً دوباره تلاش کنید.');
            } finally {
                setLoading(false);
            }
        }
    };




    const renderStars = (rating, interactive = false, onRate = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                        onClick={interactive ? () => onRate(star) : undefined}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSort = (sortType) => {
        setSortBy(sortType);
    };


    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen font-sans bg-gray-50/30" dir="rtl">
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        تلاش مجدد
                    </button>
                </div>
            ) : (
                <div className="flex gap-6">
                    {/* سایدبار ثبت نظر */}
                    <div className="w-80">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6 shadow-sm">
                            <button
                                onClick={() => setShowNewCommentForm(!showNewCommentForm)}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg w-full justify-center mb-4"
                            >
                                <Plus size={18} />
                                ثبت نظر
                            </button>

                            <p className="text-gray-600 text-center text-sm leading-relaxed">
                                دیدگاه خود درباره این محصول را با ما و سایر کاربران به اشتراک بگذارید
                            </p>
                        </div>
                    </div>

                    {/* محتوای اصلی */}
                    <div className="flex-1">
                        {/* کنترل‌ها */}
                        <div className="bg-white rounded-2xl  p-6 mb-6">
                            <div className="flex items-center justify-between gap-4">
                                {/* فیلترها */}
                                <div dir='ltr' className="flex items-center gap-2 font-sans">
                                    <button
                                        onClick={() => handleSort('بالاترین امتیاز')}
                                        className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'بالاترین امتیاز'
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-700'
                                            }`}
                                    >
                                        بالاترین امتیاز
                                    </button>
                                    <button
                                        onClick={() => handleSort('جدیدترین')}
                                        className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'جدیدترین'
                                            ? 'text-red-600 font-medium'
                                            : 'text-gray-700'
                                            }`}
                                    >
                                        جدیدترین
                                    </button>
                                    <h1 className="px-4 py-2 text-gray-700 font-semibold rounded-lg transition-colors">
                                        : مرتب سازی بر اساس
                                    </h1>
                                    <img src='/public/website/icons8-sort-by-50 2.png' className="w-6 h-6 flex items-center justify-center" alt="sort icon" />
                                </div>

                                {/* تعداد نظرات */}
                                <div className="text-gray-600 font-medium">
                                    {totalComments} نظر
                                </div>
                            </div>
                        </div>

                        {/* فرم ثبت نظر جدید */}
                        {showNewCommentForm && (
                            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">ثبت نظر جدید</h3>

                                {/* امتیاز */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">امتیاز شما:</label>
                                    {renderStars(newRating, true, setNewRating)}
                                </div>

                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="نظر خود درباره این محصول را بنویسید..."
                                    className="w-full p-4 border border-gray-200 rounded-lg resize-none h-32 text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    dir="rtl"
                                />

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={addComment}
                                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        ارسال نظر
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowNewCommentForm(false);
                                            setNewComment('');
                                            setNewRating(5);
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl transition-colors"
                                    >
                                        لغو
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* لیست نظرات */}
                        <div className="space-y-6">
                            {filteredComments.map((comment, index) => (
                                <div key={comment.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* نظر اصلی */}
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                <User size={20} />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-bold text-gray-800">{comment.author}</h4>
                                                    <span className="text-gray-500 text-sm">{formatDate(comment.timestamp)}</span>
                                                </div>

                                                {/* امتیاز */}
                                                <div className="mb-3">
                                                    {renderStars(comment.rating)}
                                                </div>

                                                <p className="text-gray-700 leading-relaxed mb-4">{comment.text}</p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* پیام عدم وجود نظر */}
                        {filteredComments.length === 0 && (
                            <div className="text-center py-12">
                                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    {searchTerm ? 'نظری با این عبارت پیدا نشد' : 'هنوز نظری ثبت نشده است'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );


};

export default CommentsSystem;