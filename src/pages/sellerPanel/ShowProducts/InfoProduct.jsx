import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaArrowLeft, FaSave, FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaCheck, FaAsterisk, FaChevronDown, FaStar, FaRegStar, FaFire } from "react-icons/fa";
import InfoCard from '../Layouts/card'
import ProductQuestions from "./question";
import ProductReviews from "./Comment";
const ShowProduct = ({ productId }) => {





    // فرمت داده‌ای که کامپوننت ProductReviews باید دریافت کنه:

    const reviewsData = [
        {
            id: 1, // شناسه یکتا برای هر نظر
            userName: "علی احمدی", // نام کاربر
            isVerified: true, // آیا کاربر تایید شده است
            rating: 5, // امتیاز از 1 تا 5
            text: "محصول فوق‌العاده‌ای بود. کیفیت عالی و ارسال سریع. به همه پیشنهاد می‌کنم.", // متن نظر
            createdAt: "2024-12-01T10:30:00Z", // تاریخ ایجاد نظر
            likes: 12, // تعداد لایک
            dislikes: 1, // تعداد دیسلایک
            replies: [ // آرایه‌ای از پاسخ‌های خریداران به این نظر
                {
                    text: "من هم همین تجربه رو داشتم. واقعاً عالی بود.",
                    createdAt: "2024-12-01T14:20:00Z",
                    likes: 3,
                    dislikes: 0
                },
                {
                    text: "چه مدت طول کشید تا برسه؟",
                    createdAt: "2024-12-01T16:45:00Z",
                    likes: 1,
                    dislikes: 0
                }
            ]
        },
        {
            id: 2,
            userName: "مریم کریمی",
            isVerified: false,
            rating: 4,
            text: "محصول خوبی بود ولی بسته‌بندی می‌تونست بهتر باشه.",
            createdAt: "2024-12-02T09:15:00Z",
            likes: 5,
            dislikes: 2,
            replies: [
                {
                    text: "من هم همین مشکل رو داشتم با بسته‌بندی.",
                    createdAt: "2024-12-02T11:30:00Z",
                    likes: 2,
                    dislikes: 0
                }
            ]
        },
        {
            id: 3,
            userName: "حسن موسوی",
            isVerified: true,
            rating: 3,
            text: "محصول متوسطی بود. انتظار بیشتری داشتم.",
            createdAt: "2024-12-03T16:00:00Z",
            likes: 2,
            dislikes: 5,
            replies: [] // نظر بدون پاسخ
        }
    ];

    // نحوه استفاده از کامپوننت در صفحه محصول:


    const [reviews, setReviews] = useState(reviewsData);

    // تابع اضافه کردن پاسخ جدید به نظر
    const handleAddReply = (reviewId, newReply) => {
        setReviews(prevReviews =>
            prevReviews.map(review =>
                review.id === reviewId
                    ? { ...review, replies: [...review.replies, newReply] }
                    : review
            )
        );
    };

    // تابع لایک کردن نظر
    const handleLikeReview = (reviewId) => {
        setReviews(prevReviews =>
            prevReviews.map(review =>
                review.id === reviewId
                    ? { ...review, likes: review.likes + 1 }
                    : review
            )
        );
    };

    // تابع دیسلایک کردن نظر
    const handleDislikeReview = (reviewId) => {
        setReviews(prevReviews =>
            prevReviews.map(review =>
                review.id === reviewId
                    ? { ...review, dislikes: review.dislikes + 1 }
                    : review
            )
        );
    };

    // تابع لایک کردن پاسخ
    const handleLikeReply = (reviewId, replyIndex) => {
        setReviews(prevReviews =>
            prevReviews.map(review =>
                review.id === reviewId
                    ? {
                        ...review,
                        replies: review.replies.map((reply, index) =>
                            index === replyIndex
                                ? { ...reply, likes: reply.likes + 1 }
                                : reply
                        )
                    }
                    : review
            )
        );
    };

    // تابع دیسلایک کردن پاسخ
    const handleDislikeReply = (reviewId, replyIndex) => {
        setReviews(prevReviews =>
            prevReviews.map(review =>
                review.id === reviewId
                    ? {
                        ...review,
                        replies: review.replies.map((reply, index) =>
                            index === replyIndex
                                ? { ...reply, dislikes: reply.dislikes + 1 }
                                : reply
                        )
                    }
                    : review
            )
        );
    };

    // فرمت داده‌ای که کامپوننت ProductQuestions باید دریافت کنه:

    const questionsData = [
        {
            id: 1, // شناسه یکتا برای هر پرسش
            text: "آیا این محصول مناسب برای کودکان است؟", // متن پرسش
            createdAt: "2024-12-01T10:30:00Z", // تاریخ ایجاد پرسش
            answers: [ // آرایه‌ای از پاسخ‌ها
                {
                    text: "بله، این محصول کاملاً مناسب برای کودکان است و استانداردهای ایمنی رو داره.", // متن پاسخ
                    type: "seller", // نوع پاسخ دهنده: "buyer" یا "seller"
                    createdAt: "2024-12-01T11:15:00Z", // تاریخ ایجاد پاسخ
                    likes: 5, // تعداد لایک
                    dislikes: 1 // تعداد دیسلایک
                },
                {
                    text: "من خریدم و بچه‌ام خیلی راضی بود.",
                    type: "buyer",
                    createdAt: "2024-12-01T14:20:00Z",
                    likes: 3,
                    dislikes: 0
                }
            ]
        },
        {
            id: 2,
            text: "چه مدت طول می‌کشه تا ارسال بشه؟",
            createdAt: "2024-12-02T09:00:00Z",
            answers: [
                {
                    text: "معمولاً 2-3 روز کاری طول می‌کشه.",
                    type: "seller",
                    createdAt: "2024-12-02T10:30:00Z",
                    likes: 8,
                    dislikes: 0
                }
            ]
        },
        {
            id: 3,
            text: "گارانتی این محصول چقدره؟",
            createdAt: "2024-12-03T16:45:00Z",
            answers: [] // پرسش بدون پاسخ
        }
    ];

    // نحوه استفاده از کامپوننت در صفحه محصول:



    const [questions, setQuestions] = useState(questionsData);

    // تابع اضافه کردن پاسخ جدید
    const handleAddAnswer = (questionId, newAnswer) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question =>
                question.id === questionId
                    ? { ...question, answers: [...question.answers, newAnswer] }
                    : question
            )
        );
    };

    // تابع لایک کردن پاسخ
    const handleLikeAnswer = (questionId, answerIndex) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question =>
                question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.map((answer, index) =>
                            index === answerIndex
                                ? { ...answer, likes: answer.likes + 1 }
                                : answer
                        )
                    }
                    : question
            )
        );
    };

    // تابع دیسلایک کردن پاسخ
    const handleDislikeAnswer = (questionId, answerIndex) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question =>
                question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.map((answer, index) =>
                            index === answerIndex
                                ? { ...answer, dislikes: answer.dislikes + 1 }
                                : answer
                        )
                    }
                    : question
            )
        );
    }



    const dummyQuestions = [
        { text: "آیا این محصول اصل است؟", answer: "بله، 100٪ اصل می‌باشد.", likes: 1, dislikes: 0 },
        { text: "چند روزه ارسال میشه؟", answer: "معمولاً بین ۲ تا ۴ روز کاری.", likes: 0, dislikes: 0 }
    ];

    const dummyReviews = [
        { user: "خریدار", date: "۳ روز پیش", rating: 4, text: "بسیار راضی بودم از خرید این محصول.", likes: 2, dislikes: 0 },
        { user: "خریدار", date: "۱ هفته پیش", rating: 5, text: "کیفیت عالی. بسته‌بندی مناسب.", likes: 1, dislikes: 0 }
    ];
    // دسته‌بندی‌های موجود
    const categories = {
        "لباس": {
            "مردانه": {
                "پیراهن": {},
                "شلوار": {},
                "کت": {}
            },
            "زنانه": {
                "مانتو": {},
                "شلوار": {},
                "بلوز": {}
            },
            "بچگانه": {
                "دخترانه": {},
                "پسرانه": {}
            }
        },
        "الکترونیک": {
            "موبایل": {
                "اندروید": {},
                "آیفون": {}
            },
            "لپ‌تاپ": {
                "گیمینگ": {},
                "اداری": {}
            },
            "لوازم جانبی": {}
        },
        "کتاب": {
            "آموزشی": {
                "ریاضی": {},
                "علوم": {}
            },
            "داستان": {
                "رمان": {},
                "داستان کوتاه": {}
            }
        },
        "خانه و آشپزخانه": {
            "لوازم آشپزخانه": {},
            "تزئینات": {},
            "مبلمان": {}
        }
    };

    // وضعیت برای فیلدها و تصاویر
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        category: '',
        link: '',
        description: '',
        additionalInfo: '',
        images: [],
        primaryImageIndex: 0,
        discount: '',
        isActive: true,
        rating: 0,
        salesCount: 0,
        totalSales: 0,
        isBestSeller: false
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showPrimarySetConfirm, setShowPrimarySetConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [selectedPath, setSelectedPath] = useState([]);

    // شبیه‌سازی دریافت اطلاعات محصول از بک‌اند
    useEffect(() => {
        // اینجا در واقع باید از API محصول را با productId دریافت کنید
        // این فقط برای شبیه‌سازی است
        const fetchProductData = async () => {
            // شبیه‌سازی delay دریافت داده
            await new Promise(resolve => setTimeout(resolve, 500));

            // داده‌های نمونه
            const mockProductData = {
                name: 'پیراهن مردانه آستین کوتاه',
                price: '250000',
                category: 'لباس/مردانه/پیراهن',
                link: 'https://example.com/product/123',
                description: 'پیراهن مردانه با جنس کتان و دوخت با کیفیت',
                additionalInfo: 'امکان مرجوعی تا ۷ روز پس از خرید',
                images: [
                    'https://via.placeholder.com/500x500?text=Product+Image+1',
                    'https://via.placeholder.com/500x500?text=Product+Image+2',
                    'https://via.placeholder.com/500x500?text=Product+Image+3'
                ],
                primaryImageIndex: 0,
                discount: '15',
                isActive: true,
                rating: 4.2,
                salesCount: 128,
                totalSales: 32000000,
                isBestSeller: true
            };

            setProductData(mockProductData);
            setSelectedPath(mockProductData.category.split('/'));
        };

        fetchProductData();
    }, [productId]);

    // تغییرات ورودی‌ها
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData({
            ...productData,
            [name]: type === 'checkbox' ? checked : value
        });

        // پاک کردن خطا وقتی کاربر شروع به تایپ می‌کند
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // اعتبارسنجی فیلدها
    const validateFields = () => {
        const newErrors = {};

        if (!productData.name.trim()) {
            newErrors.name = 'نام محصول الزامی است';
        }
        if (!productData.price.trim()) {
            newErrors.price = 'قیمت محصول الزامی است';
        }
        if (!productData.category.trim()) {
            newErrors.category = 'دسته‌بندی محصول الزامی است';
        }
        if (!productData.link.trim()) {
            newErrors.link = 'لینک محصول الزامی است';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // افزودن تصویر جدید
    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductData({
                    ...productData,
                    images: [...productData.images, reader.result]
                });
            };
            reader.readAsDataURL(file);
        }
        e.target.value = ''; // Reset input
    };

    // تنظیم عکس اصلی
    const setPrimaryImage = () => {
        setProductData({
            ...productData,
            primaryImageIndex: currentImageIndex
        });
        setShowPrimarySetConfirm(true);
        setTimeout(() => {
            setShowPrimarySetConfirm(false);
        }, 2000);
    };

    // حذف تصویر
    const confirmDeleteImage = (index) => {
        setShowDeleteConfirm(index);
    };

    const deleteImage = () => {
        const newImages = productData.images.filter((_, i) => i !== showDeleteConfirm);
        let newPrimaryIndex = productData.primaryImageIndex;

        if (showDeleteConfirm === productData.primaryImageIndex) {
            newPrimaryIndex = 0;
        } else if (showDeleteConfirm < productData.primaryImageIndex) {
            newPrimaryIndex = productData.primaryImageIndex - 1;
        }

        if (showDeleteConfirm === currentImageIndex) {
            setCurrentImageIndex(0);
        } else if (showDeleteConfirm < currentImageIndex) {
            setCurrentImageIndex(currentImageIndex - 1);
        }

        setProductData({
            ...productData,
            images: newImages,
            primaryImageIndex: newPrimaryIndex
        });
        setShowDeleteConfirm(null);
    };

    // تبدیل عکس قبلی/بعدی
    const prevImage = () => {
        setCurrentImageIndex(currentImageIndex === 0 ? productData.images.length - 1 : currentImageIndex - 1);
    };

    const nextImage = () => {
        setCurrentImageIndex(currentImageIndex === productData.images.length - 1 ? 0 : currentImageIndex + 1);
    };

    // انتخاب دسته‌بندی
    const handleCategorySelect = (category, level) => {
        const newPath = selectedPath.slice(0, level);
        newPath.push(category);
        setSelectedPath(newPath);

        const categoryString = newPath.join('/');
        setProductData({
            ...productData,
            category: categoryString
        });

        // بررسی اینکه آیا زیر دسته دارد یا نه
        let currentLevel = categories;
        for (let i = 0; i < newPath.length; i++) {
            currentLevel = currentLevel[newPath[i]];
        }

        // اگر زیر دسته نداشت، دراپ‌داون را ببند
        if (!currentLevel || Object.keys(currentLevel).length === 0) {
            setShowCategoryDropdown(false);
        }
    };

    // رندر کردن گزینه‌های دسته‌بندی
    const renderCategoryOptions = (categories, level = 0) => {
        // اگر هیچ مسیری انتخاب نشده، همه دسته‌های اصلی رو نشون بده
        if (selectedPath.length === 0) {
            return Object.keys(categories).map(category => (
                <button
                    key={category}
                    onClick={() => handleCategorySelect(category, 0)}
                    className="w-full text-right px-4 py-2 hover:bg-gray-100"
                >
                    {category}
                </button>
            ));
        }

        // اگر مسیری انتخاب شده، فقط زیردسته‌های اون رو نشون بده
        let currentLevel = categories;
        for (let i = 0; i < selectedPath.length; i++) {
            currentLevel = currentLevel[selectedPath[i]];
        }

        if (!currentLevel || Object.keys(currentLevel).length === 0) {
            return null;
        }

        return Object.keys(currentLevel).map(category => (
            <button
                key={category}
                onClick={() => handleCategorySelect(category, selectedPath.length)}
                className="w-full text-right px-4 py-2 hover:bg-gray-100"
            >
                {category}
            </button>
        ));
    };

    // ذخیره تغییرات
    const handleSave = () => {
        if (validateFields()) {
            console.log("Product data saved:", productData);
            // اینجا می‌توانید عملیات ذخیره را انجام دهید
        }
    };

    // رندر ستاره‌های امتیاز
    const renderRatingStars = () => {
        const stars = [];
        const fullStars = Math.floor(productData.rating);
        const hasHalfStar = productData.rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-400" />);
            }
        }

        return stars;
    };

    return (
        <div className="p-6 min-h-screen">
            {/* برگشت به صفحه قبلی */}
            <button
                onClick={() => window.history.back()}
                className="flex items-center mb-6 text-blue-500 hover:text-blue-700"
            >
                <FaArrowLeft className="mr-2" />
                برگشت به صفحه قبل
            </button>

            {/* بخش اطلاعات محصول */}
            <div className=" rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">اطلاعات محصول</h2>

                    {/* وضعیت پرفروش بودن */}
                    {productData.isBestSeller && (
                        <div className="flex items-center px-10 py-5 border-black border-opacity-50 rounded-lg">
                            <span className="font-modam font-medium text-lg px-2">از پرفروش های فروشگاه شما</span>
                            <img className='w-10 h-10' src='/public/SellerPanel/Products/icons8-instagram-check-mark-50 2.png'></img>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {/* امتیاز محصول */}
                    {/* دومین کارت */}
                    {/* دومین کارت */}
                    <InfoCard
                        title={productData.rating.toFixed(1)}
                        subtitle="امتیاز کسب شده از خریداران"
                        logo="/public/SellerPanel/Products/stars.png"
                        titleColor="text-green-700"
                    />


                    <InfoCard
                        title={productData.salesCount.toLocaleString()}
                        subtitle=" تعداد فروش محصول"
                        logo="/public/SellerPanel/Home/icons8-package-64(1).png"
                        titleColor="text-black"
                    />

                    <InfoCard
                        title={productData.totalSales.toLocaleString()}
                        subtitle="میزان درآمد کسب شده"
                        logo="/public/SellerPanel/Home/icons8-package-64(1).png"
                        titleColor="text-black"
                    />

                </div>
            </div>

            {/* فرم ویرایش محصول */}
            <div className="p-6 font-modam">
                <p className="text-lg mb-12">فروشنده‌ی گرامی! پس از ویرایش و یا افزودن اطلاعات محصول برای ذخیره شدن و اعمال تغییرات دکمه‌ی ذخیره را بزنید.</p>
                <h2 className="text-2xl font-semibold mb-12">ویرایش محصول</h2>

                <div className="flex gap-24 justify-center">
                    {/* بخش تصاویر */}
                    <div className="flex flex-col items-center space-y-4 w-1/3">
                        {/* تصویر اصلی */}
                        <div className="w-[420px] h-[420px] relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                            {productData.images.length > 0 ? (
                                <>
                                    <img
                                        src={productData.images[currentImageIndex]}
                                        alt={`تصویر ${currentImageIndex + 1}`}
                                        className="object-cover w-full h-full"
                                    />

                                    {/* دکمه‌های ناوبری */}
                                    {productData.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                            >
                                                <FaChevronLeft />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                            >
                                                <FaChevronRight />
                                            </button>
                                        </>
                                    )}

                                    {/* دکمه تنظیم به عنوان اصلی */}
                                    <button
                                        onClick={setPrimaryImage}
                                        className={`absolute bottom-2 left-2 px-3 py-1 text-xs rounded-md transition-all ${currentImageIndex === productData.primaryImageIndex
                                            ? 'bg-green-600 text-white'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {currentImageIndex === productData.primaryImageIndex ? (
                                            <span className="flex items-center gap-1">
                                                <FaCheck className="text-xs" />
                                                عکس اصلی
                                            </span>
                                        ) : (
                                            'تنظیم اصلی'
                                        )}
                                    </button>

                                    {/* دکمه تمام صفحه */}
                                    <button
                                        onClick={() => setIsFullscreen(true)}
                                        className="absolute bottom-2 right-2 bg-gray-700 bg-opacity-70 text-white p-2 rounded-md hover:bg-opacity-90"
                                    >
                                        <FaExpand />
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center justify-center w-96 h-96 text-gray-400">
                                    <span>هیچ تصویری انتخاب نشده</span>
                                </div>
                            )}
                        </div>

                        {/* تصاویر کوچک */}
                        <div className="flex items-center gap-2 flex-wrap max-w-72">
                            {productData.images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image}
                                        alt={`تصویر کوچک ${index + 1}`}
                                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all ${index === currentImageIndex
                                            ? 'border-blue-500 opacity-100'
                                            : 'border-gray-300 opacity-70 hover:opacity-100'
                                            } ${index === productData.primaryImageIndex ? 'ring-2 ring-green-400' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                    {/* دکمه حذف */}
                                    <button
                                        onClick={() => confirmDeleteImage(index)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ fontSize: '10px' }}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            ))}

                            {/* دکمه افزودن تصویر */}
                            <label className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                <FaPlus className="text-gray-400 text-sm mb-1" />
                                <span className="text-xs text-gray-500">افزودن</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAddImage}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* بخش فرم */}
                    <div className="space-y-6 w-2/4">
                        {/* نام محصول */}
                        <div className="font-modam text-lg">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 ${errors.name ? 'border-red-500' : 'border-gray-800 border-opacity-40'}`}
                                    placeholder="نام محصول"
                                />
                                <FaAsterisk className="absolute left-4 top-6 text-red-500 text-xs" />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="flex gap-2 font-modam text-lg">
                            {/* قیمت محصول */}
                            <div className="w-[30%]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="price"
                                        value={productData.price}
                                        onChange={handleChange}
                                        className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 ${errors.price ? 'border-red-500' : 'border-gray-800 border-opacity-40'}`}
                                        placeholder="قیمت محصول"
                                    />
                                    <FaAsterisk className="absolute left-4 top-6 text-red-500 text-xs" />
                                </div>
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                            </div>

                            {/* دسته بندی محصول */}
                            <div className="w-[70%]">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                        className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 text-right flex items-center justify-between ${errors.category ? 'border-red-500' : 'border-gray-800 border-opacity-40'}`}
                                    >
                                        <span className={productData.category ? 'text-black' : 'text-gray-500'}>
                                            {productData.category || 'دسته بندی محصول'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <FaAsterisk className="text-red-500 text-xs" />
                                            <FaChevronDown className={`text-gray-500 text-sm transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>

                                    {showCategoryDropdown && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                                            {renderCategoryOptions(categories)}
                                        </div>
                                    )}
                                </div>
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>
                        </div>

                        {/* لینک محصول دیجیتال */}
                        <div className="font-modam text-lg">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="link"
                                    value={productData.link}
                                    onChange={handleChange}
                                    className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 ${errors.link ? 'border-red-500' : 'border-gray-800 border-opacity-40'}`}
                                    placeholder="لینک محصول دیجیتال"
                                />
                                <FaAsterisk className="absolute left-4 top-6 text-red-500 text-xs" />
                            </div>
                            {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
                        </div>

                        {/* وضعیت فعال بودن محصول */}
                        <div className="font-modam text-lg flex items-center gap-4">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={productData.isActive}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`block w-14 h-8 rounded-full ${productData.isActive ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${productData.isActive ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                                <div className="mr-3 text-gray-700">
                                    {productData.isActive ? 'محصول فعال' : 'محصول غیرفعال'}
                                </div>
                            </label>
                        </div>

                        {/* توضیحات محصول */}
                        <div className="font-modam text-lg">
                            <textarea
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                className="bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36 mt-2"
                                placeholder="توضیحات محصول"
                                rows="4"
                            />
                        </div>

                        {/* اطلاعات اضافی */}
                        <div className="font-modam text-lg">
                            <textarea
                                name="additionalInfo"
                                value={productData.additionalInfo}
                                onChange={handleChange}
                                className="bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36 mt-2"
                                placeholder="شرح امکان مرجوعی کالا"
                                rows="2"
                            />
                        </div>

                        <div className="flex justify-between items-center font-modam">
                            <div>
                                <p>آیا میخواهید تخفیفی برای این محصول قائل شوید؟</p>
                                <p>درصد مورد نظر خود را در فیلد رو به رو وارد کنید.</p>
                            </div>

                            {/* درصد تخفیف */}
                            <div className="w-[50%]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="discount"
                                        value={productData.discount}
                                        onChange={handleChange}
                                        className="bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-16 mt-2 pr-12"
                                        placeholder="درصد تخفیف"
                                    />
                                    <img src='/SellerPanel/Products/icons8-discount-64 1(1).png' className="absolute right-4 top-6 text-gray-500"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* توضیحات پس از خرید */}
                <div className="mx-16 my-0">
                    <div
                        className="ml-auto mb-0  bg-gradient-to-l from-[#1E212D] via-[#2E3A55] to-[#626C93] font-modam font-medium text-lط w-64 h-4/5  text-white py-4 px-6 rounded-full shadow-md"
                    >
                        توضیحات پس از خرید محصول
                    </div>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className="bg-[#fbf7ed] w-full px-6 py-6  border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36"
                        placeholder="توضیحات خود را در اینجا وارد کنید."
                        rows="4"
                    />
                </div>

                {/* دکمه ذخیره تغییرات */}
                <div className="flex justify-end mt-6 pl-16">
                    <button
                        onClick={handleSave}
                        className="bg-[#eac09f87] text-[#1E212D] border-[0.2px] border-[#1e212d8b] shadow-inner py-2 px-4 rounded-lg flex items-center hover:bg-[#B68973] transition-colors"
                    >
                        <FaSave className="mr-2" />
                        ذخیره تغییرات
                    </button>
                </div>
            </div>

            {/* مودال تمام صفحه */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative max-w-4xl max-h-4xl">
                        <img
                            src={productData.images[currentImageIndex]}
                            alt={`تصویر بزرگ ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30"
                        >
                            <FaTimes />
                        </button>

                        {productData.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30"
                                >
                                    <FaChevronRight />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* مودال تایید حذف */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold mb-4 text-center">تایید حذف</h3>
                        <p className="text-gray-600 mb-6 text-center">آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                انصراف
                            </button>
                            <button
                                onClick={deleteImage}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* نوتیفیکیشن تنظیم عکس اصلی */}
            {showPrimarySetConfirm && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50 flex items-center gap-2">
                    <FaCheck />
                    <span>عکس به عنوان تصویر اصلی تنظیم شد</span>
                </div>
            )}

            {/* کلیک بیرون دراپ‌داون برای بستن */}
            {showCategoryDropdown && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowCategoryDropdown(false)}
                />
            )}


            <div>
                {/* سایر اجزای صفحه محصول */}

                <ProductQuestions
                    questions={questions}
                    onAddAnswer={handleAddAnswer}
                    onLikeAnswer={handleLikeAnswer}
                    onDislikeAnswer={handleDislikeAnswer}
                />
            </div>

            <ProductReviews
                reviews={reviews}
                onAddReply={handleAddReply}
                onLikeReview={handleLikeReview}
                onDislikeReview={handleDislikeReview}
                onLikeReply={handleLikeReply}
                onDislikeReply={handleDislikeReply}
            />





        </div>
    );
};


export default ShowProduct;





