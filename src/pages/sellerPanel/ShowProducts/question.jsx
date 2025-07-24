    import React, { useState } from "react";
    import { FaThumbsUp, FaThumbsDown, FaQuestionCircle, FaSortAmountDown } from "react-icons/fa";

    const ProductQuestions = ({ questions, onAddAnswer, onLikeAnswer, onDislikeAnswer }) => {
        const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'mostAnswered'
        const [activeAnswerForm, setActiveAnswerForm] = useState(null);
        const [newAnswer, setNewAnswer] = useState('');
        const [answerType, setAnswerType] = useState('buyer'); // 'buyer' or 'seller'

        // مرتب سازی پرسش‌ها
        const sortedQuestions = [...questions].sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'mostAnswered') {
                return b.answers.length - a.answers.length;
            }
            return 0;
        });

        const handleSubmitAnswer = (questionId) => {
            if (newAnswer.trim()) {
                onAddAnswer(questionId, {
                    text: newAnswer,
                    type: answerType,
                    createdAt: new Date().toISOString(),
                    likes: 0,
                    dislikes: 0
                });
                setNewAnswer('');
                setActiveAnswerForm(null);
            }
        };

        return (
            <div className="bg-[#fef8e7] rounded-xl p-6 space-y-6 shadow border border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">پرسش‌ها</h3>
                </div>

                <p className="text-sm text-gray-700">{`تعداد ${questions.length} پرسش درباره‌ی این محصول وجود دارد.`}</p>

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
                            onClick={() => setSortBy('mostAnswered')}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${sortBy === 'mostAnswered'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            بیشترین پاسخ
                        </button>
                    </div>
                </div>

                {/* پرسش‌ها */}
                {sortedQuestions.map((question, index) => (
                    <div key={question.id} className="border-b border-gray-300 pb-6 last:border-b-0">
                        {/* متن پرسش */}
                        <div className="flex items-start gap-3 mb-4">
                            <FaQuestionCircle className="text-blue-600 text-lg mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-lg font-medium text-gray-800">{question.text}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <span>{new Date(question.createdAt).toLocaleDateString('fa-IR')}</span>
                                    <span>•</span>
                                    <span>{question.answers.length} پاسخ</span>
                                </div>
                            </div>
                        </div>

                        {/* پاسخ‌ها */}
                        <div className="pr-8 space-y-4">
                            {question.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} className="bg-white rounded-lg p-4 border border-gray-100">
                                    <p className="text-sm text-gray-700 mb-3">{answer.text}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${answer.type === 'seller'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {answer.type === 'seller' ? 'فروشنده' : 'خریدار'}
                                            </span>

                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span>آیا این پاسخ مفید بود؟</span>
                                                <button
                                                    onClick={() => onLikeAnswer(question.id, answerIndex)}
                                                    className="flex items-center gap-1 hover:text-green-600 transition-colors"
                                                >
                                                    <FaThumbsUp />
                                                    <span>{answer.likes}</span>
                                                </button>
                                                <button
                                                    onClick={() => onDislikeAnswer(question.id, answerIndex)}
                                                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                                                >
                                                    <FaThumbsDown />
                                                    <span>{answer.dislikes}</span>
                                                </button>
                                            </div>
                                        </div>

                                        <span className="text-xs text-gray-400">
                                            {new Date(answer.createdAt).toLocaleDateString('fa-IR')}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* دکمه ثبت پاسخ */}
                            <div className="pt-2">
                                {activeAnswerForm !== question.id ? (
                                    <button
                                        onClick={() => setActiveAnswerForm(question.id)}
                                        className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                                    >
                                        ثبت پاسخ
                                    </button>
                                ) : (
                                    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setAnswerType('buyer')}
                                                className={`px-3 py-1 rounded-full text-xs transition-colors ${answerType === 'buyer'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                خریدار
                                            </button>
                                            <button
                                                onClick={() => setAnswerType('seller')}
                                                className={`px-3 py-1 rounded-full text-xs transition-colors ${answerType === 'seller'
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                فروشنده
                                            </button>
                                        </div>

                                        <textarea
                                            value={newAnswer}
                                            onChange={(e) => setNewAnswer(e.target.value)}
                                            placeholder="پاسخ خود را بنویسید..."
                                            className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm"
                                            rows="3"
                                        />

                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => {
                                                    setActiveAnswerForm(null);
                                                    setNewAnswer('');
                                                }}
                                                className="px-4 py-2 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                                            >
                                                انصراف
                                            </button>
                                            <button
                                                onClick={() => handleSubmitAnswer(question.id)}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                ارسال پاسخ
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    export default ProductQuestions;