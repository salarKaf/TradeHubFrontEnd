import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Search, X, ShoppingBag } from 'lucide-react';
import { getActivePlan } from '../../../../API/website.js';
import CommentsSystem from './ProductCommentList';
import QuestionAnswerSystem from './ProductQuestionList';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getItemImages, getItemImageById, getItemRating } from '../../../../API/Items';
import { addItemToCart, getMyCart, removeOneFromCart, deleteItemFromCart } from '../../../../API/cart.jsx';
import { addToFavorites, removeFromFavorites, isItemInFavorites, getFavoriteIdByItemId } from '../../../../API/favorites';
const ProductShow = () => {
    const { productId, slug } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [productData, setProductData] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [productRating, setProductRating] = useState(0);


    const [cartItems, setCartItems] = useState([]);
    const [isInCart, setIsInCart] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [cartItemId, setCartItemId] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);



    const [hasPro, setHasPro] = useState(false);
    const [planLoading, setPlanLoading] = useState(true);

    const [favoriteId, setFavoriteId] = useState(null);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const websiteId = localStorage.getItem('current_store_website_id');
                const token = localStorage.getItem(`buyer_token_${websiteId}`);

                if (!token || !productId) return;

                const isFav = await isItemInFavorites(productId, websiteId);
                setIsFavorite(isFav);

                if (isFav) {
                    const favId = await getFavoriteIdByItemId(productId, websiteId);
                    setFavoriteId(favId);
                }
            } catch (error) {
                console.warn('خطا در چک کردن وضعیت علاقه‌مندی:', error);
            }
        };

        if (productId) {
            checkFavoriteStatus();
        }
    }, [productId]);


    useEffect(() => {
        const checkCartStatus = async () => {
            try {
                const websiteId = localStorage.getItem('current_store_website_id');
                const token = localStorage.getItem(`buyer_token_${websiteId}`);

                if (!token || !productId) return;

                const cartItems = await getMyCart();
                const currentItem = cartItems.find(item => item.item_id === productId);

                if (currentItem) {
                    setIsInCart(true);
                    setCartQuantity(currentItem.quantity);
                    setCartItemId(currentItem.id);
                } else {
                    setIsInCart(false);
                    setCartQuantity(0);
                    setCartItemId(null);
                }
            } catch (error) {
                console.error('خطا در چک کردن وضعیت سبد خرید:', error);
            }
        };

        if (productId) {
            checkCartStatus();
        }
    }, [productId]);

    const handleFavoriteToggle = async () => {
        try {
            const websiteId = localStorage.getItem('current_store_website_id');
            const token = localStorage.getItem(`buyer_token_${websiteId}`);

            if (!token) {
                alert('برای افزودن به علاقه‌مندی‌ها باید وارد شوید');
                return;
            }

            if (isFavorite && favoriteId) {
                await removeFromFavorites(favoriteId, websiteId);
                setIsFavorite(false);
                setFavoriteId(null);
            } else {
                const result = await addToFavorites(productId, websiteId);
                setIsFavorite(true);
                setFavoriteId(result.id);
            }
        } catch (error) {
            console.error('خطا در تغییر وضعیت علاقه‌مندی:', error);
            alert('خطا در تغییر وضعیت علاقه‌مندی');
        }
    };

    const handleAddToCart = async () => {
        try {
            setIsAddingToCart(true);
            const websiteId = localStorage.getItem('current_store_website_id');
            const token = localStorage.getItem(`buyer_token_${websiteId}`);

            if (!token) {
                alert('برای افزودن به سبد خرید باید وارد شوید');
                return;
            }

            await addItemToCart(productId);
            setIsInCart(true);
            setCartQuantity(1);
            alert('محصول با موفقیت به سبد خرید اضافه شد!');

            const cartItems = await getMyCart();
            const currentItem = cartItems.find(item => item.item_id === productId);
            if (currentItem) {
                setCartItemId(currentItem.id);
            }
        } catch (error) {
            console.error('خطا در افزودن به سبد خرید:', error);
            alert('خطا در افزودن محصول به سبد خرید');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleIncreaseQuantity = async () => {
        try {
            await addItemToCart(productId);
            setCartQuantity(prev => prev + 1);
        } catch (error) {
            console.error('خطا در افزایش تعداد:', error);
            alert('خطا در افزایش تعداد محصول');
        }
    };

    const handleDecreaseQuantity = async () => {
        try {
            if (cartQuantity > 1) {
                await removeOneFromCart(cartItemId);
                setCartQuantity(prev => prev - 1);
            } else {
                await deleteItemFromCart(cartItemId);
                setIsInCart(false);
                setCartQuantity(0);
                setCartItemId(null);
            }
        } catch (error) {
            console.error('خطا در کاهش تعداد:', error);
            alert('خطا در کاهش تعداد محصول');
        }
    };

    const handleGoToCart = () => {
        navigate(`/${slug}/cart`);
    };
    useEffect(() => {
        const loadProductData = async () => {
            setLoading(true);
            try {
                const product = await getProductById(productId);
                setProductData(product);

                try {
                    const websiteId = product?.website_id || localStorage.getItem('current_store_website_id');
                    const activePlan = await getActivePlan(websiteId);
                    setHasPro(activePlan?.is_active && activePlan?.plan?.name === 'Pro');
                } catch (planError) {
                    console.warn(" خطا در دریافت پلن:", planError);
                    setHasPro(false);
                } finally {
                    setPlanLoading(false);
                }

                try {
                    const images = await getItemImages(productId);
                    if (images.length === 0) {
                        setProductImages(['/website/Image(1).png']);
                    } else {
                        const imageUrls = await Promise.all(
                            images.map(async (img) => {
                                try {
                                    const url = await getItemImageById(img.image_id);
                                    return { url, isMain: img.is_main };
                                } catch (err) {
                                    console.warn(" خطا در بارگذاری تصویر:", err);
                                    return { url: '/website/default-product.png', isMain: false };
                                }
                            })
                        );
                        const sorted = imageUrls.sort((a, b) => b.isMain - a.isMain);
                        setProductImages(sorted.map(i => i.url));
                    }
                } catch (imgError) {
                    console.warn(" خطا کلی در دریافت تصاویر:", imgError);
                    setProductImages(['/website/default-product.png']);
                }

                try {
                    const rating = await getItemRating(productId);
                    setProductRating(rating.rating || 0);
                } catch (ratingError) {
                    console.warn(" خطا در دریافت امتیاز:", ratingError);
                    setProductRating(0);
                }

            } catch (err) {
                console.error(" خطا در بارگذاری محصول:", err);
                setError("خطا در بارگذاری اطلاعات محصول");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadProductData();
        }
    }, [productId]);

    const getStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = (rating % 1) >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return {
            fullStars,
            hasHalfStar,
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

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

    const { fullStars, hasHalfStar, emptyStars } = getStars(productRating);
    return (
        <div className='font-Kahroba'>
            <div className="max-w-6xl mx-auto p-6 bg-white" dir="rtl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={productImages[selectedImage] || '/website/default-product.png'}
                                alt={productData.name || "محصول"}
                                className="w-full h-96 object-cover"
                                onError={(e) => {
                                    e.target.src = '/website/default-product.png';
                                }}
                            />
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

                            <button
                                onClick={() => setIsZoomed(true)}
                                className="absolute bottom-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

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
                                                e.target.src = '/website/default-product.png';
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
                                {productData.category_name || "دسته‌بندی"}
                                {productData.subcategory_name && productData.subcategory_name !== "null" && (
                                    <> / {productData.subcategory_name}</>
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">{productData.name || "نام محصول"}</h1>

                            <div className="text-left">
                                {productData.discount_active ? (
                                    <div className="space-y-2">
                                        <div className="inline-block bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                                            {productData.discount_percent}% تخفیف
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl font-bold text-red-500">
                                                {parseInt(productData.discount_price).toLocaleString()} تومان
                                            </div>
                                            <div className="text-lg text-gray-500 line-through">
                                                {parseInt(productData.price).toLocaleString()} تومان
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-2xl font-bold text-red-500">
                                        {productData.price ? `${parseInt(productData.price).toLocaleString()} تومان` : "قیمت نامشخص"}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t-[1px] border-gray-300 my-2" />


                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(fullStars)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}

                                {hasHalfStar && (
                                    <div className="relative">
                                        <Star className="w-5 h-5 fill-gray-300 text-gray-300" />
                                        <div className="absolute inset-0 overflow-hidden w-1/2">
                                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </div>
                                )}

                                {[...Array(emptyStars)].map((_, i) => (
                                    <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-5 h-5 fill-gray-300 text-gray-300" />
                                ))}

                                <span className="text-sm text-gray-600 mr-2">{productRating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <ShoppingBag className="w-4 h-4" />
                                <span>{productData.sales_count || 0} فروش</span>
                            </div>                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollToSection('comments')}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                            >
                                نظرات
                            </button>

                            {hasPro && (
                                <button
                                    onClick={() => scrollToSection('questions')}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                                >
                                    پرسش‌ها
                                </button>
                            )}

                            <button
                                onClick={() => scrollToSection('introduction')}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                            >
                                معرفی
                            </button>
                        </div>

                        <div className="flex gap-4 pt-28 justify-end">
                            <button
                                onClick={handleFavoriteToggle}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${isFavorite
                                    ? 'border-red-500 text-red-500 bg-red-50'
                                    : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                افزودن به علاقه‌مندی‌ها
                            </button>

                            {isInCart ? (
                                <div className="flex gap-2">
                                    <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                        <button
                                            onClick={handleDecreaseQuantity}
                                            className="px-4 py-3 hover:bg-gray-100 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-3 bg-gray-50 font-bold">{cartQuantity}</span>
                                        <button
                                            onClick={handleIncreaseQuantity}
                                            className="px-4 py-3 hover:bg-gray-100 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleGoToCart}
                                        className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        مشاهده سبد خرید
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-lg transition-all ${isAddingToCart
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {isAddingToCart ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
                                </button>
                            )}
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

                <div id="comments" className="mt-20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r from-black via-gray-600 to-gray-800 rounded-full text-white">
                                دیدگاه‌ها
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>
                    <CommentsSystem />
                </div>

                {hasPro && (
                    <div id="questions" className="mt-20">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center text-xl justify-center px-12 py-4 bg-gradient-to-r from-black via-gray-600 to-gray-800 rounded-full text-white">
                                    پرسش‌ها
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 border-t-[1.4px] border-gray-800 mr-[27px] mb-10"></div>
                        <QuestionAnswerSystem />
                    </div>
                )}
            </div>

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