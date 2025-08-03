import React, { useState, useEffect } from "react";
import { FaQuestionCircle, FaSortAmountDown, FaUser, FaReply } from "react-icons/fa";
import { getItemQuestions, answerQuestion } from '../../../API/qsn'; // مسیر API تو

const ProductQuestions = ({ productId }) => {
    const [questions, setQuestions] = useState([]);
    const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'mostAnswered'
    const [activeAnswerForm, setActiveAnswerForm] = useState(null);
    const [newAnswer, setNewAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // بارگذاری سوالات
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);
                const questionsData = await getItemQuestions(productId);
                
                // تبدیل format API به format کامپوننت
                const formattedQuestions = questionsData.map(q => ({
                    id: q.question_id,
                    text: q.question_text,
                    buyerName: q.buyer_name,
                    createdAt: q.created_at,
                    hasAnswer: !!q.answer_text,
                    answerText: q.answer_text,
                    answeredAt: q.answered_at
                }));

                setQuestions(formattedQuestions);
            } catch (err) {
                console.error('Error loading questions:', err);
                setError('خطا در بارگذاری پرسش‌ها');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadQuestions();
        }
    }, [productId]);

    // مرتب سازی پرسش‌ها
    const sortedQuestions = [...questions].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'mostAnswered') {
            // اول پاسخ داده شده‌ها، بعد پاسخ داده نشده‌ها
            if (a.hasAnswer && !b.hasAnswer) return -1;
            if (!a.hasAnswer && b.hasAnswer) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    });

    // ارسال پاسخ
    const handleSubmitAnswer = async (questionId) => {
        if (!newAnswer.trim()) return;

        try {
            const updatedQuestion = await answerQuestion(questionId, newAnswer);
            
            // آپدیت کردن state محلی
            setQuestions(prevQuestions =>
                prevQuestions.map(q =>
                    q.id === questionId
                        ? {
                            ...q,
                            hasAnswer: true,
                            answerText: updatedQuestion.answer_text,
                            answeredAt: updatedQuestion.answered_at
                        }
                        : q
                )
            );

            setNewAnswer('');
            setActiveAnswerForm(null);
        } catch (error) {
            console.error('Error answering question:', error);
            alert('خطا در ثبت پاسخ. لطفاً دوباره تلاش کنید.');
        }
    };

    // فرمت کردن تاریخ
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-[#fef8e7] rounded-xl p-3 md:p-6 shadow border border-gray-200">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#fef8e7] rounded-xl p-3 md:p-6 shadow border border-gray-200">
                <div className="text-center py-8">
                    <p className="text-red-600 text-sm md:text-base">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-3 md:px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fef8e7] rounded-xl p-3 md:p-6 space-y-4 md:space-y-6 shadow border border-gray-200">
            <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-bold">پرسش‌های مشتریان</h3>
            </div>

            {questions.length === 0 ? (
                <div className="text-center py-8">
                    <FaQuestionCircle className="text-gray-400 text-3xl md:text-4xl mx-auto mb-4" />
                    <p className="text-gray-500 text-sm md:text-base">هنوز پرسشی ثبت نشده است</p>
                </div>
            ) : (
                <>
                    <p className="text-xs md:text-sm text-gray-700">
                        {`${questions.length} پرسش درباره‌ی این محصول وجود دارد.`}
                    </p>

                    {/* بخش مرتب سازی */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-4 border-b border-gray-200">
                        <span className="text-xs md:text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FaSortAmountDown className="text-sm" />
                            مرتب سازی بر اساس:
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy('newest')}
                                className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors ${
                                    sortBy === 'newest'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                جدیدترین
                            </button>
                            <button
                                onClick={() => setSortBy('mostAnswered')}
                                className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm transition-colors ${
                                    sortBy === 'mostAnswered'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                پاسخ داده شده‌ها
                            </button>
                        </div>
                    </div>

                    {/* پرسش‌ها */}
                    {sortedQuestions.map((question) => (
                        <div key={question.id} className="border-b border-gray-300 pb-4 md:pb-6 last:border-b-0">
                            {/* متن پرسش */}
                            <div className="flex items-start gap-2 md:gap-3 mb-4">
                                <FaQuestionCircle className="text-blue-600 text-base md:text-lg mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <FaUser className="text-gray-500 text-xs md:text-sm" />
                                            <span className="text-xs md:text-sm font-medium text-gray-700">
                                                {question.buyerName}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            • {formatDate(question.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm md:text-lg font-medium text-gray-800 mb-2">
                                        {question.text}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            question.hasAnswer
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {question.hasAnswer ? 'پاسخ داده شده' : 'در انتظار پاسخ'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* پاسخ موجود */}
                            {question.hasAnswer && (
                                <div className="pr-4 md:pr-8 mb-4">
                                    <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-100">
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <FaReply className="text-green-600 text-xs md:text-sm mt-1" />
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                                    <span className="text-xs md:text-sm font-medium text-green-800">
                                                        پاسخ شما:
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(question.answeredAt)}
                                                    </span>
                                                </div>
                                                <p className="text-xs md:text-sm text-gray-700">
                                                    {question.answerText}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* فرم پاسخ/ویرایش پاسخ */}
                            <div className="pr-4 md:pr-8">
                                {activeAnswerForm !== question.id ? (
                                    <button
                                        onClick={() => {
                                            setActiveAnswerForm(question.id);
                                            setNewAnswer(question.hasAnswer ? question.answerText : '');
                                        }}
                                        className="text-blue-600 text-xs md:text-sm hover:text-blue-700 transition-colors flex items-center gap-1 md:gap-2"
                                    >
                                        <FaReply />
                                        {question.hasAnswer ? 'ویرایش پاسخ' : 'ثبت پاسخ'}
                                    </button>
                                ) : (
                                    <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200 space-y-3">
                                        <textarea
                                            value={newAnswer}
                                            onChange={(e) => setNewAnswer(e.target.value)}
                                            placeholder="پاسخ خود را بنویسید..."
                                            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg resize-none text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows="3"
                                        />

                                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                            <button
                                                onClick={() => {
                                                    setActiveAnswerForm(null);
                                                    setNewAnswer('');
                                                }}
                                                className="px-3 md:px-4 py-2 text-gray-600 text-xs md:text-sm hover:text-gray-800 transition-colors order-2 sm:order-1"
                                            >
                                                انصراف
                                            </button>
                                            <button
                                                onClick={() => handleSubmitAnswer(question.id)}
                                                className="px-3 md:px-4 py-2 bg-blue-600 text-white text-xs md:text-sm rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
                                            >
                                                {question.hasAnswer ? 'ویرایش پاسخ' : 'ارسال پاسخ'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default ProductQuestions;