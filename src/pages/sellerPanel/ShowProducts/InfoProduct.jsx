import React, { useState, useEffect } from "react";
import { FaAsterisk, FaArrowLeft, FaSave, FaStar, FaRegStar, FaCalendarAlt } from "react-icons/fa";
import InfoCard from '../Layouts/card';
import ProductQuestions from "./question";
import ProductReviews from "./Comment";
import { getProductById, getItemRating } from '../../../API/Items'
import { useParams } from 'react-router-dom';
import { editItem } from '../../../API/Items';
import ImageManager from './ImageManager';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
dayjs.extend(jalaliday);
import { getItemSalesCount, getItemRevenue, getItemReviews } from '../../../API/Items';
import { getActivePlan } from '../../../API/website'; // ✅ درست
import JalaliDatePicker from './JalaliDatePicker';

function convertJalaliToGregorian({ year, month, day }) {
    return dayjs()
        .calendar('jalali')
        .year(year)
        .month(month - 1)
        .date(day)
        .toDate();
}


const ShowProduct = () => {


    const { productId, websiteId } = useParams();


    const reviewsData = [
    ];

    const [reviews, setReviews] = useState(reviewsData);
    const [planType, setPlanType] = useState(null);


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












    // وضعیت برای فیلدها و تصاویر
    const [productData, setProductData] = useState({
        discountExpiresAt: null,
        name: '',
        price: '',
        category: '',
        link: '',
        description: '',
        additionalInfo: '',
        images: [],
        primaryImageIndex: 0,
        isActive: true,
        rating: 0,
        salesCount: 0,
        totalSales: 0,
        isBestSeller: false,
        discount: '',
        discountActive: false,

    });

    const [errors, setErrors] = useState({});





    // شبیه‌سازی دریافت اطلاعات محصول از بک‌اند
    // تو useEffect اول، جایی که داده‌های محصول رو میگیری:
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const data = await getProductById(productId);

                const hasSubcategory =
                    data.subcategory_name &&
                    data.subcategory_name !== 'null' &&
                    data.subcategory_name !== null;

                const fullCategoryPath = data.category_name
                    ? hasSubcategory
                        ? `${data.category_name}/${data.subcategory_name}`
                        : data.category_name
                    : '';
                console.log('🔍 Expiration Date:', data.discount_expires_at);

                setProductData({
                    name: data.name || '',
                    price: data.price || '',
                    category: fullCategoryPath,
                    link: data.delivery_url || '',
                    description: data.description || '',
                    additionalInfo: data.post_purchase_note || '',
                    images: [],
                    primaryImageIndex: 0,
                    isActive: data.stock > 0,
                    stock: data.stock || 0,
                    rating: 0,
                    salesCount: 0,
                    totalSales: 0,
                    isBestSeller: false,
                    discount: typeof data.discount_percent === 'number' ? data.discount_percent : 0,
                    discountActive: data.discount_active || false,
                    discountExpiresAt: data.discount_expires_at
                        ? {
                            year: Number(dayjs(data.discount_expires_at).calendar('jalali').format('YYYY')),
                            month: Number(dayjs(data.discount_expires_at).calendar('jalali').format('MM')),
                            day: Number(dayjs(data.discount_expires_at).calendar('jalali').format('DD')),
                        }
                        : null,





                });
                console.log('📆 formatted date for calendar:', {
                    year: Number(dayjs(data.discount_expires_at).calendar('jalali').format('YYYY')),
                    month: Number(dayjs(data.discount_expires_at).calendar('jalali').format('MM')),
                    day: Number(dayjs(data.discount_expires_at).calendar('jalali').format('DD')),
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
                    rating: ratingData.rating || 0  // تغییر از average_rating به rating
                }));
            } catch (error) {
                console.error("❌ خطا در دریافت امتیاز:", error);
            }
        };

        if (productId) {
            fetchRating();
        }
    }, [productId]);



    useEffect(() => {
        const fetchSalesAndRevenue = async () => {
            try {
                const [salesCountRaw, revenueRaw] = await Promise.all([
                    getItemSalesCount(productId),
                    getItemRevenue(productId),
                ]);

                console.log("🎯 salesCount:", salesCountRaw);
                console.log("💰 revenue:", revenueRaw);

                setProductData(prev => ({
                    ...prev,
                    salesCount: salesCountRaw,
                    totalSales: revenueRaw,
                }));
            } catch (error) {
                console.error("❌ خطا در دریافت فروش یا درآمد:", error);
            }
        };

        if (productId) {
            fetchSalesAndRevenue();
        }
    }, [productId]);




    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const raw = await getItemReviews(productId);

                const formatted = raw.map((r) => ({
                    id: r.review_id,
                    userName: "خریدار",
                    createdAt: r.created_at,
                    rating: r.rating,
                    text: r.text,
                    likes: 0,
                    dislikes: 0,
                    replies: [],
                }));

                setReviews(formatted);
            } catch (error) {
                console.error("❌ خطا در دریافت نظرات:", error);
            }
        };

        if (productId) fetchReviews();
    }, [productId]);




    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const plan = await getActivePlan(websiteId);
                setPlanType(plan?.plan?.name || null);

            } catch (err) {
                console.error("❌ خطا در دریافت پلن:", err);
            }
        };
        if (websiteId) fetchPlan();
    }, [websiteId]);









    // تغییرات ورودی‌ها
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = type === 'checkbox' ? checked : value;
        let updatedData = {
            ...productData,
            [name]: newValue,
        };

        // اگر isActive تغییر کرده، مقدار stock را هم تنظیم کن
        if (name === "isActive") {
            updatedData.stock = newValue ? 10000 : 0;
        }

        setProductData(updatedData);

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
    // ذخیره تغییرات
    const handleSave = async () => {
        if (!validateFields()) return;

        const payload = {
            name: productData.name,
            description: productData.description,
            price: Number(productData.price),
            delivery_url: productData.link,
            post_purchase_note: productData.additionalInfo,
            is_available: productData.isActive,
            stock: productData.stock,
            discount_active: productData.discountActive,
        };

        // فقط اگر تخفیف فعال باشه، این فیلدها رو اضافه کن
        if (productData.discountActive) {
            payload.discount_percent = Number(productData.discount) || 0;
            payload.discount_expires_at = productData.discountExpiresAt
                ? convertJalaliToGregorian(productData.discountExpiresAt).toISOString()
                : null;
        }

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
                                    <input
                                        type="text"
                                        value={productData.category}
                                        disabled
                                        className="bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-3xl h-16 mt-2 text-gray-500 cursor-not-allowed"
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


                            {/* بخش تخفیف */}
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 font-modam">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <img src='/SellerPanel/Products/icons8-discount-64 1(1).png' className="w-8 h-8" />
                                            <h3 className="text-xl font-semibold text-gray-800">تنظیمات تخفیف</h3>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            با فعال کردن تخفیف، درصد و تاریخ انقضای مورد نظر خود را تعیین کنید
                                        </p>
                                    </div>

                                    {/* سوئیچ فعال/غیرفعال تخفیف */}
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    name="discountActive"
                                                    checked={productData.discountActive}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <div className={`block w-16 h-8 rounded-full shadow-inner ${productData.discountActive
                                                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                                                    : 'bg-gray-400'
                                                    }`}></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow transition-transform duration-200 ${productData.discountActive ? 'transform translate-x-8' : ''
                                                    }`}></div>
                                            </div>
                                            <div className="mr-3 font-medium text-gray-700">
                                                {productData.discountActive ? 'تخفیف فعال' : 'تخفیف غیرفعال'}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* فیلدهای تخفیف */}
                                {productData.discountActive && (
                                    <div className="grid grid-cols-2 gap-6 mt-6">
                                        {/* درصد تخفیف */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                درصد تخفیف
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="discount"
                                                    value={productData.discount}
                                                    onChange={handleChange}
                                                    className="bg-white w-full px-4 py-3 pl-12 border border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl transition-colors"
                                                    placeholder="مثال: 25"
                                                    min="1"
                                                    max="100"
                                                />
                                                <div className="absolute left-3 top-3 flex items-center gap-1">
                                                    <span className="text-orange-500 font-bold">%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* تاریخ انقضای تخفیف */}
                                        {/* تاریخ انقضای تخفیف (شمسی) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                تاریخ انقضا (شمسی)
                                            </label>
                                            <div className="relative z-10">
                                                <JalaliDatePicker
                                                    value={productData.discountExpiresAt}
                                                    onChange={(value) => {
                                                        setProductData((prev) => ({
                                                            ...prev,
                                                            discountExpiresAt: value,
                                                        }));
                                                    }}
                                                    placeholder="انتخاب تاریخ انقضا"
                                                />



                                            </div>
                                            {productData.discountExpiresAt && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    انقضا: {`${productData.discountExpiresAt.year}/${productData.discountExpiresAt.month}/${productData.discountExpiresAt.day}`}
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                )}

                                {/* پیش‌نمایش قیمت با تخفیف */}
                                {productData.discountActive && productData.discount && productData.price && (
                                    <div className="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-orange-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">پیش‌نمایش قیمت:</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg line-through text-gray-400">
                                                    {Number(productData.price).toLocaleString()} تومان
                                                </span>
                                                <span className="text-xl font-bold text-green-600">
                                                    {(Number(productData.price) * (1 - Number(productData.discount) / 100)).toLocaleString()} تومان
                                                </span>
                                                <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                                                    {productData.discount}% تخفیف
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* توضیحات پس از خرید  */}

                    <div className="mx-16 my-0">
                        <div className="ml-auto mb-0 bg-gradient-to-l from-[#1E212D] via-[#2E3A55] to-[#626C93] font-modam font-medium text-lg w-64 h-4/5 text-white py-4 px-6 rounded-full shadow-md">
                            توضیحات پس از خرید محصول
                        </div>
                        <textarea
                            name="additionalInfo"
                            value={productData.additionalInfo}
                            onChange={handleChange}
                            className="bg-[#fbf7ed] w-full px-6 py-6 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36"
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
                    {planType === "Pro" && (
                        <ProductQuestions
                            productId={productId}
                        />
                    )}
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

