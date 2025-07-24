import React, { useState, useMemo } from 'react';
import { Plus, Search, User, MessageSquare, Star } from 'lucide-react';

const CommentsSystem = () => {
    const [comments, setComments] = useState([
        {
            id: 1,
            text: 'نظر فوق‌العاده‌ای از این محصول دارم. کیفیت بسیار بالا و ارزش خرید دارد. پیشنهاد می‌کنم حتماً تهیه کنید',
            author: 'نام خریدار',
            rating: 5,
            timestamp: Date.now() - 86400000,

        },
        {
            id: 2,
            text: 'محصول خوبی است ولی قیمت کمی بالا به نظر می‌رسد. در کل راضی هستم از خریدم',
            author: 'مشتری راضی',
            rating: 4,
            timestamp: Date.now() - 172800000,
        },
        {
            id: 3,
            text: 'دیدگاه خود درباره خرید درج کنید تا دیگران هم بتوانند استفاده کنند',
            author: 'کاربر جدید',
            rating: 3,
            timestamp: Date.now() - 259200000,
        }
    ]);

    const [newComment, setNewComment] = useState('');
    const [sortBy, setSortBy] = useState('جدیدترین');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewCommentForm, setShowNewCommentForm] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState({});
    const [newRating, setNewRating] = useState(5);

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

    const addComment = () => {
        if (newComment.trim()) {
            const comment = {
                id: Date.now(),
                text: newComment,
                author: 'شما',
                rating: newRating,
                isVerified: false,
                timestamp: Date.now(),
            };
            setComments([comment, ...comments]);
            setNewComment('');
            setNewRating(5);
            setShowNewCommentForm(false);
        }
    };



 
    const renderStars = (rating, interactive = false, onRate = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${
                            star <= rating 
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
        </div>
    );
};

export default CommentsSystem;