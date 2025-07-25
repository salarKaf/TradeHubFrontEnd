import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Search, X, Link, CheckCircle } from 'lucide-react';

const PurchasedProduct = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const productImages = [
        '/public/website/a3655ad2f99985ab6b83020118c028d9 1.png',
        '/public/website/a3655ad2f99985ab6b83020118c028d9 1.png',
        '/public/website/a3655ad2f99985ab6b83020118c028d9 1.png',
        '/public/website/a3655ad2f99985ab6b83020118c028d9 1.png'
    ];

    const productData = {
        category: "لوازم دیجیتال",
        subCategory: "موبایل هوشمند",
        name: "اسم محصول",
        price: "2,500,000 تومان",
        rating: 4.4,
        buyers: 9, // تعداد خریداران
        commentsCount: 30, // تعداد کامنت‌ها
        questionsCount: 12 // تعداد پرسش‌ها
    };

    // محاسبه تعداد ستاره‌ها
    const getStars = (rating) => {
        const fullStars = Math.floor(rating); // تعداد ستاره‌های پر
        const halfStar = rating % 1 >= 0.5 ? 1 : 0; // اگر نیم‌ستاره باشد
        const emptyStars = 5 - fullStars - halfStar; // تعداد ستاره‌های خالی

        return {
            fullStars,
            halfStar,
            emptyStars
        };
    };

    const { fullStars, halfStar, emptyStars } = getStars(productData.rating);

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

    return (
        <div className='font-rubik'>
            <div className="max-w-6xl mx-auto p-6 bg-white" dir="rtl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={productImages[selectedImage]}
                                alt="محصول"
                                className="w-full h-96 object-cover"
                            />
                            {/* Navigation Arrows */}
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

                            {/* Search/Zoom Icon */}
                            <button
                                onClick={() => setIsZoomed(true)}
                                className="absolute bottom-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-2 justify-center">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img src={image} alt={`تصویر ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* خریداری شده بخش */}
                        <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="w-6 h-6" />
                            <span className="text-xl font-semibold">خریداری شده</span>
                        </div>

                        <div className="mb-2">
                            <span className="text-gray-600 text-base font-semibold">
                                {productData.category} / {productData.subCategory}
                            </span>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">{productData.name}</h1>
                            <div className="text-2xl font-bold text-red-500">{productData.price}</div>
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

                                <span className="text-sm text-gray-600 mr-2">{productData.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">{productData.buyers} خریدار</span>
                        </div>

                        {/* لینک محافظت‌شده */}
                        <div className="border border-blue-500 rounded-lg p-4">
                            <a href="https://example.com" className="text-blue-500 flex items-center">
                                <Link className="w-4 h-4 mr-2" />
                                لینک محافظت شده دسترسی به محصول
                            </a>
                        </div>

                        {/* مطالعه معرفی و دیدگاه‌های محصول */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => window.location.href = '/product'}
                                className="px-3 py-1 text-blue-500 underline text-sm transition-colors"
                            >
                                 طالعه معرفی و دیدگاه‌های محصول &gt;
                            </button>
                        </div>

                    </div>
                </div>
                <div id="introduction" className="mt-20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r  from-black via-gray-600 to-gray-800 rounded-full text-white">
                                توضیحات پس از خرید                            </div>
                        </div>

                    </div>
                    <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>
                    <p className="text-gray-600 leading-relaxed mr-6">
                        توضیحات کامل مربوط به محصول اینجا قرار می‌گیرد.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PurchasedProduct;
