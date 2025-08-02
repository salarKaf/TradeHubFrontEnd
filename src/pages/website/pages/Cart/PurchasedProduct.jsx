import React, { useState, useEffect } from 'react';
import {
    Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Search, X,
    Link, CheckCircle
} from 'lucide-react';

import { getItemImages, getItemImageById } from '../../../../API/Items';

import { useParams } from 'react-router-dom';
import { getOrderWithProduct } from '../../../../API/orders';
import { getProductById, getItemRating } from '../../../../API/Items'; // اگر نیست

const PurchasedProduct = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [product, setProduct] = useState(null);
    const [priceAtPurchase, setPriceAtPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams();
    const [productImages, setProductImages] = useState([]);


    const [rating, setRating] = useState(0);
    const [buyers, setBuyers] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const data = await getOrderWithProduct(orderId);

                // اگر سفارش کنسل شده بود، کاربر رو بفرست به صفحه محصول
                if (data?.order?.status === "Canceled") {
                    const slug = window.location.pathname.split('/')[1];
                    window.location.href = `/${slug}/product/${data.product.item_id}`;
                    return;
                }

                setProduct(data.product);
                setPriceAtPurchase(data.priceAtPurchase);

                // گرفتن اطلاعات کامل محصول برای تعداد خریدار
                const fullProductData = await getProductById(data.product.item_id);
                setBuyers(fullProductData?.sales_count || 0);

                // گرفتن امتیاز
                try {
                    const ratingData = await getItemRating(data.product.item_id);
                    setRating(ratingData?.rating || 0);
                } catch (ratingErr) {
                    console.warn("⚠️ خطا در دریافت امتیاز:", ratingErr);
                }

                // گرفتن تصاویر محصول
                try {
                    const images = await getItemImages(data.product.item_id);

                    if (!images || images.length === 0) {
                        setProductImages(['/public/website/Image(1).png']);
                    } else {
                        const imageUrls = await Promise.all(
                            images.map(async (img) => {
                                try {
                                    const url = await getItemImageById(img.image_id);
                                    return { url, isMain: img.is_main };
                                } catch {
                                    return { url: '/public/website/Image(1).png', isMain: false };
                                }
                            })
                        );

                        const sorted = imageUrls.sort((a, b) => b.isMain - a.isMain);
                        setProductImages(sorted.map(img => img.url));
                    }
                } catch (imgErr) {
                    console.warn("⚠️ خطا در گرفتن تصاویر محصول:", imgErr);
                    setProductImages(['/website/default-product.png']);
                }

            } catch (err) {
                console.error('❌ خطا در دریافت اطلاعات سفارش:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId]);





    const getStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return { fullStars, halfStar, emptyStars };
    };

    const { fullStars, halfStar, emptyStars } = getStars(rating);

    const handlePrevImage = () => {
        setSelectedImage(prev => prev > 0 ? prev - 1 : productImages.length - 1);
    };

    const handleNextImage = () => {
        setSelectedImage(prev => prev < productImages.length - 1 ? prev + 1 : 0);
    };

    const handleKeyDown = (e) => {
        if (isZoomed) {
            if (e.key === 'Escape') setIsZoomed(false);
            else if (e.key === 'ArrowLeft') handleNextImage();
            else if (e.key === 'ArrowRight') handlePrevImage();
        }
    };

    useEffect(() => {
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

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-600">در حال بارگذاری محصول...</div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-10 text-red-500">محصولی یافت نشد</div>
        );
    }

    return (
        <div className='font-rubik'>
            <div className="max-w-6xl mx-auto p-6 bg-white" dir="rtl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* تصاویر */}
                    <div className="space-y-4">
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={productImages[selectedImage]}
                                alt="محصول"
                                className="w-full h-96 object-cover"
                                onError={(e) => { e.target.src = '/website/default-product.png'; }}
                            />

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
                            <button
                                onClick={() => setIsZoomed(true)}
                                className="absolute bottom-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex gap-2 justify-center">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <img
                                        src={image}
                                        alt={`تصویر ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = '/public/website/Image(1).png'; }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* اطلاعات محصول */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="w-6 h-6" />
                            <span className="text-xl font-semibold">خریداری شده</span>
                        </div>

                        <div className="mb-2">
                            <span className="text-gray-600 text-base font-semibold">
                                {product?.category_name} {product?.subcategory_name !== "null" && `/ ${product?.subcategory_name}`}
                            </span>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {product?.name}
                            </h1>
                            {priceAtPurchase && (
                                <div className="text-2xl font-bold text-red-500">
                                    {priceAtPurchase.toLocaleString('fa-IR')} ریال
                                </div>
                            )}
                        </div>

                        <div className="border-t-[1px] border-gray-300 my-2" />

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(fullStars)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                                {halfStar === 1 && (
                                    <Star key="half" className="w-5 h-5 fill-yellow-200 text-yellow-200" />
                                )}
                                {[...Array(emptyStars)].map((_, i) => (
                                    <Star key={i + fullStars + halfStar} className="w-5 h-5 fill-gray-300 text-gray-300" />
                                ))}
                                <span className="text-sm text-gray-600 mr-2">{rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">{buyers} خریدار</span>
                        </div>

                        <div className="border border-blue-500 rounded-lg p-4">
                            <a href={product?.delivery_url || "#"} className="text-blue-500 flex items-center" target="_blank">
                                <Link className="w-4 h-4 mr-2" />
                                لینک محافظت شده دسترسی به محصول
                            </a>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => {
                                    if (product?.item_id) {
                                        const slug = window.location.pathname.split('/')[1]; // فرض بر اینه که URL تو فرمت /slug/...
                                        window.location.href = `/${slug}/product/${product.item_id}`;
                                    }
                                }}
                                className="px-3 py-1 text-blue-500 underline text-sm transition-colors"
                            >
                                مطالعه معرفی و دیدگاه‌های محصول &gt;
                            </button>

                        </div>
                    </div>
                </div>

                {/* توضیحات خرید */}
                <div id="introduction" className="mt-20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r from-black via-gray-600 to-gray-800 rounded-full text-white">
                                توضیحات پس از خرید
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>
                    <p className="text-gray-600 leading-relaxed mr-6">
                        {product?.post_purchase_note || "توضیحی برای این محصول ثبت نشده است."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PurchasedProduct;
