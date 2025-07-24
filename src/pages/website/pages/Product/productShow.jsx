import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

import CommentsSystem from './ProductCommentList';
import QuestionAnswerSystem from './ProductQuestionList';

const ProductShow = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);



    const productImages = [
        '/public/website/a3655ad2f99985ab6b83020118c028d9 1.png',
        '/public/website/a3655ad2f99985ab6b83020118c028d9 1.png',
        '/public/website/a3655ad2f99985ab6b83020118c028d9 1.png',
        '/public/website/a3655ad2f99985ab6b83020118c028d9 1.png'
    ];

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
            {/* Zoom Modal */}
            {isZoomed && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative max-w-4xl max-h-screen p-4">
                        <img
                            src={productImages[selectedImage]}
                            alt="محصول بزرگ"
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Close Button */}
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation in Zoom */}
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {selectedImage + 1} / {productImages.length}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto p-6 bg-white" dir="rtl">
                {/* Header
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">نام محصول</h1>
          <div className="text-2xl font-bold text-red-500">قیمت</div>
        </div> */}

                {/* Product Images and Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Image Gallery */}
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


                        {/* Social Media Links */}
                        <div className="flex justify-center gap-4 mb-8">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>اشتراک‌گذاری در:</span>
                                <div className="flex gap-2">
                                    {/* اینجا می‌تونی آیکن‌های خودت رو بذاری */}
                                    <button className="w-8 h-8 flex items-center justify-centertransition-colors">
                                        {/* آیکن اینستاگرام - می‌تونی عوضش کنی */}
                                        <img src='/public/website/icons8-instagram-logo-48.png'></img>
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center  transition-colors">
                                        {/* آیکن توییتر - می‌تونی عوضش کنی */}
                                        <img src='/public/website/icons8-twitter-50.png'></img>
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center transition-colors">
                                        {/* آیکن X - می‌تونی عوضش کنی */}
                                        <img src='/public/website/icons8-telegram-logo-48.png'></img>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Product Info */}
                    <div className="space-y-6">


                        {/* نام و قیمت */}
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">نام محصول</h1>
                            <div className="text-2xl font-bold text-red-500">قیمت</div>
                        </div>
                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                                <Star className="w-5 h-5 text-gray-300" />
                                <span className="text-sm text-gray-600 mr-2">4.4</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scrollToSection('comments')}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                                >
                                    نظرات
                                </button>
                                <button
                                    onClick={() => scrollToSection('questions')}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                                >
                                    پرسش
                                </button>
                                <button
                                    onClick={() => scrollToSection('introduction')}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                                >
                                    معرفی
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
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



                {/* Product Introduction Section */}
                {/* <div className="flex justify-center mt-10">
          <div className="bg-blue-900 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md">
            معرفی محصول
          </div>
        </div> */}


                {/* معرفی محصول */}
                <div id="introduction" className="mt-20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r  from-black via-gray-600 to-gray-800 rounded-full text-white">
                                معرفی محصول
                            </div>
                        </div>

                    </div>
                    <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>
                    <p className="text-gray-600 leading-relaxed mr-6">
                        توضیحات کامل مربوط به محصول اینجا قرار می‌گیرد.
                    </p>
                </div>

                <div id="questions" className="mt-20">
                    {/* اضافه کردن بیضی برای عنوان پرسش‌ها */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r  from-black via-gray-600 to-gray-800 rounded-full text-white">
                                پرسش‌ها
                            </div>
                        </div>

                    </div>
                    <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>

                    {/* کامپوننت پرسش‌ها */}
                    <QuestionAnswerSystem />
                </div>




                <div id="comments" className="mt-20">
                    {/* اضافه کردن بیضی برای عنوان پرسش‌ها */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r  from-black via-gray-600 to-gray-800 rounded-full text-white">
                                دیدگاه ها
                            </div>
                        </div>

                    </div>
                    <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>

                    {/* کامپوننت پرسش‌ها */}
                    <CommentsSystem />
                </div>









            </div>


        </div>
    );
};

export default ProductShow;