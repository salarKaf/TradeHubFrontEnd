import React, { useState, useEffect } from "react";
import { FaAsterisk, FaTimes, FaArrowLeft, FaSave, FaStar, FaRegStar } from "react-icons/fa";
import InfoCard from '../Layouts/card'
import ProductQuestions from "./question";
import ProductReviews from "./Comment";
import { getProductById, getItemRating } from '../../../API/Items'
import { useParams } from 'react-router-dom';
import { editItem } from '../../../API/Items';
import CategoryDropdown from './CategoryDropdown';
import ImageManager from './ImageManager';




const ShowProduct = () => {


    const { productId, websiteId } = useParams();


    const reviewsData = [
    ];

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

    const questionsData = [
    ];


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

    const [errors, setErrors] = useState({});





    // شبیه‌سازی دریافت اطلاعات محصول از بک‌اند
    // تو useEffect اول، جایی که داده‌های محصول رو میگیری:
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const data = await getProductById(productId);


                console.log("🧪 category_name:", data.category_name);
                console.log("🧪 subcategory_name:", data.subcategory_name, typeof data.subcategory_name);


                const hasSubcategory =
                    data.subcategory_name &&
                    data.subcategory_name !== 'null' &&
                    data.subcategory_name !== null;

                const fullCategoryPath = data.category_name
                    ? hasSubcategory
                        ? `${data.category_name}/${data.subcategory_name}`
                        : data.category_name
                    : '';



                setProductData({
                    name: data.name || '',
                    price: data.price || '',
                    category: fullCategoryPath, // حالا کامل مسیر رو ذخیره می‌کنه
                    link: data.delivery_url || '',
                    description: data.description || '',
                    additionalInfo: data.post_purchase_note || '',
                    images: [],
                    primaryImageIndex: 0,
                    discount: data.discount_percent || '',
                    isActive: data.is_available || true,
                    rating: 0,
                    salesCount: 0,
                    totalSales: 0,
                    isBestSeller: false
                });
            } catch (err) {
                console.error("❌ خطا در دریافت محصول:", err);
            }
        };

        fetchProductData();
    }, [productId]);





    useEffect(() => {
        const fetchRating = async () => {
            try {
                const ratingData = await getItemRating(productId);
                setProductData(prev => ({
                    ...prev,
                    rating: ratingData.average_rating || 0,
                }));
            } catch (error) {
                console.error("❌ خطا در دریافت امتیاز:", error);
            }
        };

        if (productId) {
            fetchRating();
        }
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






    // ذخیره تغییرات
    const handleSave = async () => {
        if (!validateFields()) return;

        // تجزیه مسیر دسته‌بندی
        const categoryParts = productData.category.split('/');
        const categoryName = categoryParts[0];
        const subcategoryName = categoryParts.length > 1 ? categoryParts[1] : null;

        const payload = {
            name: productData.name,
            price: Number(productData.price),
            category_name: categoryName,
            subcategory_name: subcategoryName, // این خط رو اضافه کن
            delivery_url: productData.link,
            description: productData.description,
            post_purchase_note: productData.additionalInfo,
            is_available: productData.isActive,
            discount_percent: Number(productData.discount) || 0
        };

        try {
            await editItem(productId, payload);
            alert("✅ تغییرات با موفقیت ذخیره شد");
        } catch (error) {
            console.error("❌ خطا در ذخیره محصول:", error);
            alert("❌ خطا در ذخیره محصول");
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
        <>
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
                            title={(productData.rating || 0).toFixed(1)}
                            subtitle="امتیاز کسب شده از خریداران"
                            logo="/public/SellerPanel/Products/stars.png"
                            titleColor="text-green-700"
                        />


                        <InfoCard
                            title={(productData.salesCount ?? 0).toLocaleString()}
                            subtitle="تعداد فروش محصول"
                            logo="/public/SellerPanel/Home/icons8-package-64(1).png"
                            titleColor="text-black"
                        />

                        <InfoCard
                            title={(productData.totalSales ?? 0).toLocaleString()}
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
                        <ImageManager
                            productId={productId}
                            onImagesChange={(imageData) => {
                                setProductData(prev => ({
                                    ...prev,
                                    images: imageData.images,
                                    primaryImageIndex: imageData.primaryImageIndex
                                }));
                            }}
                        />


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
                                    <CategoryDropdown
                                        value={productData.category}
                                        onChange={(category) => setProductData({ ...productData, category })}
                                        error={errors.category}
                                        placeholder="دسته بندی محصول"
                                        websiteId={websiteId} // این خط رو اضافه کن
                                    />
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





        </ >
    );
};


export default ShowProduct;





