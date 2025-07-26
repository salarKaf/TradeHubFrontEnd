import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // ✅ اضافه کردن useParams
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

import CommentsSystem from './ProductCommentList';
import QuestionAnswerSystem from './ProductQuestionList';
import { getProductById, getItemImages, getItemImageById, getItemRating } from '../../../../API/Items'; // ✅ import کردن API functions

const ProductShow = () => {
    const { productId } = useParams(); // ✅ گرفتن productId از URL
    
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ✅ State های جدید برای داده‌های دینامیک
    const [productData, setProductData] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [productRating, setProductRating] = useState(0);

    // ✅ useEffect برای بارگذاری اطلاعات محصول
    useEffect(() => {
        const loadProductData = async () => {
            try {
                setLoading(true);
                
                // دریافت اطلاعات محصول
                const product = await getProductById(productId);
                setProductData(product);

                // دریافت تصاویر محصول
                try {
                    const images = await getItemImages(productId);
                    const imageUrls = await Promise.all(
                        images.map(async (img) => {
                            const url = await getItemImageById(img.image_id);
                            return { url, isMain: img.is_main };
                        })
                    );
                    
                    // مرتب کردن تصاویر - تصویر اصلی اول
                    const sortedImages = imageUrls.sort((a, b) => b.isMain - a.isMain);
                    setProductImages(sortedImages.map(img => img.url));
                } catch (imgError) {
                    console.warn("خطا در بارگذاری تصاویر:", imgError);
                    // در صورت عدم وجود تصویر، یک تصویر پیش‌فرض قرار بده
                    setProductImages(['/public/website/default-product.png']);
                }

                // دریافت امتیاز محصول
                try {
                    const rating = await getItemRating(productId);
                    setProductRating(rating.average_rating || 0);
                } catch (ratingError) {
                    console.warn("خطا در دریافت امتیاز:", ratingError);
                    setProductRating(0);
                }

            } catch (err) {
                console.error("خطا در بارگذاری محصول:", err);
                setError("خطا در بارگذاری اطلاعات محصول");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadProductData();
        }
    }, [productId]);

    // محاسبه تعداد ستاره‌ها
    const getStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return {
            fullStars,
            halfStar,
            emptyStars
        };
    };

    const handlePrevImage = () => {
        setSelectedImage(prev => prev > 0 ? prev - 1 : productImages.length - 1);
    };

    const handleNextImage = () => {
        setSelectedImage(prev => prev < productImages.length - 1 ? prev + 1 : 0);
    };

    const handleKeyDown = (e) => {
        if (isZoomed) {
            if (e.key === 'Escape') {
                setIsZoomed(false);
            } else if (e.key === 'ArrowLeft') {
                handleNextImage();
            } else if (e.key === 'ArrowRight') {
                handlePrevImage();
            }
        }
    };

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        if (isZoomed) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isZoomed]);

    // ✅ نمایش لودینگ
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // ✅ نمایش خطا
    if (error || !productData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">خطا در بارگذاری محصول</h2>
                    <p className="text-gray-600">{error || "محصول یافت نشد"}</p>
                </div>
            </div>
        );
    }

    const { fullStars, halfStar, emptyStars } = getStars(productRating);

    return (
        <div className='font-rubik'>
            <div className="max-w-6xl mx-auto p-6 bg-white" dir="rtl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={productImages[selectedImage] || '/public/website/default-product.png'}
                                alt={productData.name || "محصول"}
                                className="w-full h-96 object-cover"
                                onError={(e) => {
                                    e.target.src = '/public/website/default-product.png';
                                }}
                            />
                            {/* Navigation Arrows - فقط اگر بیش از یک تصویر باشد */}
                            {productImages.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                        onClick={handlePrevImage}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <button
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                        onClick={handleNextImage}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {/* Search/Zoom Icon */}
                            <button
                                onClick={() => setIsZoomed(true)}
                                className="absolute bottom-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thumbnails - فقط اگر بیش از یک تصویر باشد */}
                        {productImages.length > 1 && (
                            <div className="flex gap-2 justify-center">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img 
                                            src={image} 
                                            alt={`تصویر ${index + 1}`} 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => {
                                                e.target.src = '/public/website/default-product.png';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="mb-2">
                            <span className="text-gray-600 text-base font-semibold">
                                {productData.category_name || "دسته‌بندی"} / {productData.subcategory_name || "زیردسته"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">{productData.name || "نام محصول"}</h1>
                            <div className="text-2xl font-bold text-red-500">
                                {productData.price ? `${productData.price.toLocaleString()} تومان` : "قیمت نامشخص"}
                            </div>
                        </div>

                        {/* خط جداکننده */}
                        <div className="border-t-[1px] border-gray-300 my-2" />

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {/* ستاره‌های پر */}
                                {[...Array(fullStars)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}

                                {/* ستاره نیمه‌پر */}
                                {halfStar === 1 && (
                                    <Star key="half" className="w-5 h-5 fill-yellow-200 text-yellow-200" />
                                )}

                                {/* ستاره‌های خالی */}
                                {[...Array(emptyStars)].map((_, i) => (
                                    <Star key={i + fullStars + halfStar} className="w-5 h-5 fill-gray-300 text-gray-300" />
                                ))}

                                <span className="text-sm text-gray-600 mr-2">{productRating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-gray-500">{productData.sales_count || 0} خریدار</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollToSection('comments')}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                            >
                                نظرات ({productData.reviews_count || 0})
                            </button>
                            <button
                                onClick={() => scrollToSection('questions')}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                            >
                                پرسش‌ها ({productData.questions_count || 0})
                            </button>
                            <button
                                onClick={() => scrollToSection('introduction')}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                            >
                                معرفی
                            </button>
                        </div>

                        <div className="flex gap-4 pt-28 justify-end">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${isFavorite
                                    ? 'border-red-500 text-red-500 bg-red-50'
                                    : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                افزودن به علاقه‌مندی‌ها
                            </button>

                            <button className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all">
                                <ShoppingCart className="w-5 h-5" />
                                خرید فوری
                            </button>
                        </div>
                    </div>
                </div>
                
                <div id="introduction" className="mt-20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r from-black via-gray-600 to-gray-800 rounded-full text-white">
                                معرفی محصول
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>
                    <p className="text-gray-600 leading-relaxed mr-6">
                        {productData.description || "توضیحات کامل مربوط به محصول اینجا قرار می‌گیرد."}
                    </p>
                </div>

                {/* سایر بخش‌ها */}
                <div id="comments" className="mt-20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r from-black via-gray-600 to-gray-800 rounded-full text-white">
                                دیدگاه‌ها
                            </div>
                            <span className="text-sm text-gray-500">({productData.reviews_count || 0} دیدگاه)</span>
                        </div>
                    </div>
                    <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>
                    <CommentsSystem />
                </div>

                <div id="questions" className="mt-20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r from-black via-gray-600 to-gray-800 rounded-full text-white">
                                پرسش‌ها
                            </div>
                            <span className="text-sm text-gray-500">({productData.questions_count || 0} پرسش)</span>
                        </div>
                    </div>
                    <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>
                    <QuestionAnswerSystem />
                </div>
            </div>

            {/* ✅ Modal برای نمایش تصویر بزرگ */}
            {isZoomed && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative max-w-4xl max-h-4xl">
                        <img
                            src={productImages[selectedImage]}
                            alt="نمایش بزرگ"
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        {productImages.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductShow;