import React, { useState, useMemo } from 'react';
import { Plus, Search, User, MessageSquare } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { createQuestion, answerQuestion, getItemQuestions } from '../../../../API/qsn.jsx'; // مسیر درست کن
import { useEffect } from 'react';




const QuestionAnswerSystem = () => {


    const { productId } = useParams(); // برای گرفتن ID محصول
    const [questions, setQuestions] = useState([]); // خالی کن
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswers, setNewAnswers] = useState({});
    const [sortBy, setSortBy] = useState('جدیدترین');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
    const [showAnswerForm, setShowAnswerForm] = useState({});

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);
                const questionsData = await getItemQuestions(productId);

                // تبدیل format API به format کامپوننت
                // در useEffect، قسمت formattedQuestions رو اینطوری تغییر بده:
                const formattedQuestions = questionsData.map(q => ({
                    id: q.question_id,
                    text: q.question_text,
                    buyerName: q.buyer_name, // اضافه کردن اسم فرستنده
                    answers: q.answer_text ? [{
                        id: 1,
                        text: q.answer_text,
                        author: 'پشتیبانی',
                        timestamp: q.answered_at ? new Date(q.answered_at).getTime() : null
                    }] : [],
                    answerCount: q.answer_text ? 1 : 0,
                    timestamp: new Date(q.created_at).getTime(),
                    isAnswered: !!q.answer_text
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

    // محاسبه تعداد کل سوالات
    const totalQuestions = questions.length;

    // مرتب‌سازی سوالات
    const sortedQuestions = useMemo(() => {
        const sorted = [...questions];
        switch (sortBy) {
            case 'جدیدترین':
                return sorted.sort((a, b) => b.timestamp - a.timestamp);
            case 'بیشترین پاسخ':
                return sorted.sort((a, b) => {
                    // اول پاسخ داده شده‌ها، بعد بر اساس تعداد پاسخ
                    if (a.isAnswered && !b.isAnswered) return -1;
                    if (!a.isAnswered && b.isAnswered) return 1;
                    return b.answerCount - a.answerCount;
                });
            default:
                return sorted;
        }
    }, [questions, sortBy]);

    // فیلتر کردن سوالات بر اساس جستجو
    const filteredQuestions = useMemo(() => {
        if (!searchTerm.trim()) return sortedQuestions;
        return sortedQuestions.filter(question =>
            question.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedQuestions, searchTerm]);

    const addQuestion = async () => {
        if (newQuestion.trim()) {
            try {
                setLoading(true);

                // ساخت سوال در سرور
                const newQuestionData = await createQuestion(productId, newQuestion);

                // اضافه کردن به state محلی
                const question = {
                    id: newQuestionData.question_id,
                    text: newQuestionData.question_text,
                    answers: [],
                    answerCount: 0,
                    timestamp: new Date(newQuestionData.created_at).getTime(),
                    isAnswered: false
                };

                setQuestions([question, ...questions]);
                setNewQuestion('');
                setShowNewQuestionForm(false);
            } catch (err) {
                console.error('Error creating question:', err);
                alert('خطا در ثبت پرسش. لطفاً دوباره تلاش کنید.');
            } finally {
                setLoading(false);
            }
        }
    };

    const addAnswer = async (questionId) => {
        const answerText = newAnswers[questionId];
        if (answerText && answerText.trim()) {
            try {
                // پاسخ دادن در سرور
                const updatedQuestion = await answerQuestion(questionId, answerText);

                // آپدیت کردن state محلی
                setQuestions(questions.map(q => {
                    if (q.id === questionId) {
                        return {
                            ...q,
                            answers: [{
                                id: 1,
                                text: updatedQuestion.answer_text,
                                author: 'شما'
                            }],
                            answerCount: 1,
                            isAnswered: true
                        };
                    }
                    return q;
                }));

                setNewAnswers({ ...newAnswers, [questionId]: '' });
                setShowAnswerForm({ ...showAnswerForm, [questionId]: false });
            } catch (err) {
                console.error('Error answering question:', err);
                alert('خطا در ثبت پاسخ. لطفاً دوباره تلاش کنید.');
            }
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setNewAnswers({ ...newAnswers, [questionId]: value });
    };

    const toggleAnswerForm = (questionId) => {
        setShowAnswerForm({ ...showAnswerForm, [questionId]: !showAnswerForm[questionId] });
    };

    const handleSort = (sortType) => {
        setSortBy(sortType);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
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
                    {/* سایدبار ثبت پرسش */}
                    <div className="w-80">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6 shadow-sm">
                            <button
                                onClick={() => setShowNewQuestionForm(!showNewQuestionForm)}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg w-full justify-center mb-4"
                            >
                                <Plus size={18} />
                                ثبت پرسش
                            </button>

                            <p className="text-gray-600 text-center text-sm leading-relaxed">
                                پرسش خود را درباره این کالا با ما و سایر کاربران به اشتراک بگذارید
                            </p>
                        </div>
                    </div>

                    {/* محتوای اصلی */}
                    <div className="flex-1">
                        {/* کنترل‌ها */}
                        <div className="bg-white rounded-2xl p-6 mb-6">
                            <div className="flex items-center justify-between gap-4">
                                {/* فیلترها */}
                                <div dir='ltr' className="flex items-center gap-2 font-sans">
                                    <button
                                        onClick={() => handleSort('بیشترین پاسخ')}
                                        className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'بیشترین پاسخ'
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-700'
                                            }`}
                                    >
                                     پاسخ داده شده
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

                                {/* تعداد پرسش‌ها */}
                                <div className="text-gray-600 font-medium">
                                    {totalQuestions} پرسش
                                </div>
                            </div>
                        </div>

                        {/* فرم ثبت پرسش جدید */}
                        {showNewQuestionForm && (
                            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">ثبت پرسش جدید</h3>

                                <textarea
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="پرسش خود درباره این کالا را بنویسید..."
                                    className="w-full p-4 border border-gray-200 rounded-lg resize-none h-32 text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    dir="rtl"
                                />

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={addQuestion}
                                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        ارسال پرسش
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowNewQuestionForm(false);
                                            setNewQuestion('');
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl transition-colors"
                                    >
                                        لغو
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* لیست پرسش‌ها */}
                        <div className="space-y-6">
                            {filteredQuestions.map((question, index) => (
                                <div key={question.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* پرسش اصلی */}
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 flex items-center justify-center text-white font-bold text-lg">
                                                <img src='/public/website/icons8-question-64 1.png' alt="question icon" className="w-8 h-8" />
                                            </div>

                                            <div className="flex-1">
                                                {/* اضافه کردن نام فرستنده */}
                                                <div className="text-base font-semibold text-gray-700 mb-2">
                                                     {question.buyerName}
                                                </div>
                                                <p className="text-gray-700 leading-relaxed font-semibold mb-4">{question.text}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* فرم پاسخ - فقط اگر پاسخ داده نشده */}
                                    {!question.isAnswered && showAnswerForm[question.id] && (
                                        <div className="px-6 pb-4">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={newAnswers[question.id] || ''}
                                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                        placeholder="پاسخ خود را بنویسید..."
                                                        className="flex-1 p-3 border border-gray-200 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        dir="rtl"
                                                    />
                                                    <button
                                                        onClick={() => addAnswer(question.id)}
                                                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                                    >
                                                        ارسال
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* پاسخ‌ها */}
                                    {question.answers.length > 0 && (
                                        <div className="px-6 pb-6">
                                            <div className="space-y-4">
                                                <div className="text-sm font-medium text-gray-600 mb-2">پاسخ:</div>
                                                {question.answers.map((answer, answerIndex) => (
                                                    <div key={answer.id} className="bg-green-50 rounded-xl p-4 border border-green-100">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                                                                <User size={16} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-green-800 text-sm mb-1">{answer.author}</div>
                                                                <p className="text-gray-700 leading-relaxed">{answer.text}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* پیام عدم وجود پرسش */}
                        {filteredQuestions.length === 0 && (
                            <div className="text-center py-12">
                                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    {searchTerm ? 'پرسشی با این عبارت پیدا نشد' : 'هنوز پرسشی ثبت نشده است'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionAnswerSystem;