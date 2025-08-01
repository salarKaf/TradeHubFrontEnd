import React, { useState, useEffect } from "react";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { addItemToCart } from "../../../../API/cart";
import { addToFavorites, removeFromFavorites, isItemInFavorites, getFavoriteIdByItemId } from "../../../../API/favorites";
import { useParams, useNavigate } from 'react-router-dom';

const ProductCard = ({
  product,
  discount,
  image,
  name = "نام محصول",
  rating = 5,
  id, // اضافه کردن id
  websiteId, // اضافه کردن websiteId
  onAddToCart, // callback برای اطلاع والد از تغییرات سبد
  onClick, // callback برای کلیک روی مشاهده
  price, // عددی باشه
  discountedPrice, // عددی باشه
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  // ✅ چک کردن وضعیت علاقه‌مندی هنگام بارگذاری کامپوننت
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const currentWebsiteId = websiteId || localStorage.getItem('current_store_website_id');
        const token = localStorage.getItem(`buyer_token_${currentWebsiteId}`);

        if (!token || !id) return;

        const isFavorite = await isItemInFavorites(id, currentWebsiteId);
        setIsLiked(isFavorite);

        if (isFavorite) {
          const favId = await getFavoriteIdByItemId(id, currentWebsiteId);
          setFavoriteId(favId);
        }
      } catch (error) {
        console.warn('خطا در چک کردن وضعیت علاقه‌مندی:', error);
      }
    };

    checkFavoriteStatus();
  }, [id, websiteId]);

  // محاسبه قیمت تخفیف‌دار
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent || originalPrice === undefined || originalPrice === null) return null;

    // اگر originalPrice عدد باشه، مستقیم استفاده کن
    const numericPrice = typeof originalPrice === "number"
      ? originalPrice
      : parseInt(originalPrice.replace(/[^\d]/g, ''));

    const discountAmount = (numericPrice * parseInt(discountPercent)) / 100;
    const discountedPrice = numericPrice - discountAmount;

    return discountedPrice.toLocaleString('fa-IR') + ' ریال';
  };


  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);

      const currentWebsiteId = websiteId || localStorage.getItem('current_store_website_id');
      const token = localStorage.getItem(`buyer_token_${currentWebsiteId}`);

      if (!token) {
        alert('برای افزودن به سبد خرید باید وارد شوید');
        navigate(`/${slug}/login`);
        return;
      }

      console.log('🛒 Adding to cart:', { id, currentWebsiteId, token });

      const result = await addItemToCart(id, currentWebsiteId, 1, token);

      console.log('✅ Product added to cart successfully:', result);

      if (onAddToCart) {
        onAddToCart(id, result);
      }
      window.dispatchEvent(new Event("cartUpdated"));

      alert('محصول با موفقیت به سبد خرید اضافه شد!');

    } catch (error) {
      console.error('❌ Error adding to cart:', error);

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        alert('توکن شما منقضی شده. لطفاً دوباره وارد شوید');
        navigate(`/${slug}/login`);
      } else if (error.message.includes('stock')) {
        alert('متأسفانه این محصول در انبار موجود نیست');
      } else {
        alert('خطا در افزودن محصول به سبد خرید. لطفاً دوباره تلاش کنید');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ✅ Handle favorites toggle
  const handleFavoriteToggle = async () => {
    try {
      setIsUpdatingFavorite(true);

      const currentWebsiteId = websiteId || localStorage.getItem('current_store_website_id');
      const token = localStorage.getItem(`buyer_token_${currentWebsiteId}`);

      if (!token) {
        alert('برای افزودن به علاقه‌مندی‌ها باید وارد شوید');
        navigate(`/${slug}/login`);
        return;
      }

      if (isLiked && favoriteId) {
        // حذف از علاقه‌مندی‌ها
        await removeFromFavorites(favoriteId, currentWebsiteId);
        setIsLiked(false);
        setFavoriteId(null);
        console.log('✅ Removed from favorites');
      } else {
        // افزودن به علاقه‌مندی‌ها
        const result = await addToFavorites(id, currentWebsiteId);
        setIsLiked(true);
        setFavoriteId(result.id);
        console.log('✅ Added to favorites:', result);
      }

    } catch (error) {
      console.error('❌ Error updating favorites:', error);

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        alert('توکن شما منقضی شده. لطفاً دوباره وارد شوید');
        navigate(`/${slug}/login`);
      } else {
        alert('خطا در به‌روزرسانی علاقه‌مندی‌ها');
      }
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  return (
    <div className="group relative font-rubik bg-white shadow-lg rounded-2xl p-4 w-full max-w-[260px] transition-all duration-300 hover:shadow-2xl hover:scale-105">
      {/* Hover Overlay for entire card */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-2xl z-10">
        {/* Add to Cart Button - Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`opacity-0 group-hover:opacity-100 bg-black text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2 hover:bg-gray-800 ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ShoppingCart size={18} />
            {isAddingToCart ? 'در حال افزودن...' : 'افزودن به سبد'}
          </button>
        </div>

        {/* Action Buttons - Bottom Full Width */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 flex transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button
            onClick={handleFavoriteToggle}
            disabled={isUpdatingFavorite}
            className={`flex items-center justify-center gap-1 px-3 py-2 w-1/2 mr-1 rounded-lg transition-all duration-200 ${isLiked
              ? 'bg-black text-red-400 hover:bg-gray-800'
              : 'bg-black text-white hover:bg-gray-800'
              } ${isUpdatingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-medium">
              {isUpdatingFavorite ? 'صبر...' : 'پسندیدن'}
            </span>
          </button>

          <button
            onClick={() => onClick && onClick(id)}
            className="flex items-center justify-center gap-1 px-3 py-2 w-1/2 ml-1 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-200"
          >
            <Eye size={16} />
            <span className="text-sm font-medium">مشاهده</span>
          </button>
        </div>
      </div>

      {/* Product Image Container */}
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <div className="h-52 flex items-center justify-center bg-gray-50">
          <img
            src={image || "/public/website/Image(1).png"}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-20">
            {discount}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="text-right space-y-2">
        <h3 className="text-gray-800 font-bold text-lg leading-tight">{name}</h3>

        {/* Price Section */}
        <div className="space-y-1 font-modam">
          {discount && discountedPrice ? (
            <>
              <p className="text-gray-400 text-sm line-through">
                {price.toLocaleString('fa-IR')} ریال
              </p>
              <p className="text-red-500 font-bold text-xl">
                {discountedPrice.toLocaleString('fa-IR')} ریال
              </p>
            </>
          ) : discount ? (
            <>
              <p className="text-gray-400 text-sm line-through">
                {price.toLocaleString('fa-IR')} ریال
              </p>
              <p className="text-red-500 font-bold text-xl">
                {calculateDiscountedPrice(price, discount.replace('%', '')).toLocaleString('fa-IR')} ریال
              </p>
            </>
          ) : (
            <p className="text-blue-600 font-bold text-xl">
              {price.toLocaleString('fa-IR')} ریال
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="flex justify-end items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;