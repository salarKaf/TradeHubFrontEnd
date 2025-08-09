import React, { useState, useEffect } from "react";
import { Heart, Eye, ShoppingCart, Star, CheckCircle, AlertCircle, X } from "lucide-react";
import { addItemToCart } from "../../../../API/cart";
import { addToFavorites, removeFromFavorites, isItemInFavorites, getFavoriteIdByItemId } from "../../../../API/favorites";
import { getMyCart } from '../../../../API/cart';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteItemFromCart, removeOneFromCart } from "../../../../API/cart";
import { getItemImages, getItemImageById, getItemRating } from '../../../../API/Items';

const Modal = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="mb-4">
            {type === 'success' ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            ) : (
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 font-Kahroba">
            {title}
          </h3>

          <p className="text-gray-600 mb-6 font-Kahroba">
            {message}
          </p>

          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 font-Kahroba ${
              type === 'success'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({
  product,
  discount,
  image,
  name = "نام محصول",
  rating = 5,
  id,
  websiteId,
  onAddToCart,
  onClick,
  price,
  discountedPrice,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [cartItem, setCartItem] = useState(null);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [actualRating, setActualRating] = useState(0);
  const [mainImage, setMainImage] = useState(null);
  
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const { slug } = useParams();
  const navigate = useNavigate();

  const showModal = (type, title, message) => {
    setModal({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const fetchMainImage = async () => {
      try {
        const images = await getItemImages(id);

        if (!images || images.length === 0) {
          setMainImage(null);
          return;
        }

        const main = images.find(img => img.is_main) || images[0];

        try {
          const url = await getItemImageById(main.image_id);
          setMainImage(url);
        } catch (imgErr) {
          console.warn("خطا در دریافت عکس:", imgErr);
          setMainImage(null);
        }

      } catch (error) {
        console.warn("خطا در گرفتن لیست عکس:", error);
        setMainImage(null);
      }
    };

    if (id) fetchMainImage();
  }, [id]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (id) {
          const ratingData = await getItemRating(id);
          setActualRating(ratingData.rating || 0);
        }
      } catch (error) {
        console.warn("خطا در دریافت امتیاز:", error);
        setActualRating(0);
      }
    };

    if (id) {
      fetchRating();
    }
  }, [id]);

  useEffect(() => {
    const checkStates = async () => {
      const currentWebsiteId = websiteId || localStorage.getItem('current_store_website_id');
      const token = localStorage.getItem(`buyer_token_${currentWebsiteId}`);
      if (!token || !id) return;

      try {
        const isFavorite = await isItemInFavorites(id, currentWebsiteId);
        setIsLiked(isFavorite);
        if (isFavorite) {
          const favId = await getFavoriteIdByItemId(id, currentWebsiteId);
          setFavoriteId(favId);
        }

        const items = await getMyCart();
        const itemInCart = items.find(item => String(item.item_id) === String(id));
        setCartItem(itemInCart || null);

      } catch (error) {
        console.warn('خطا در بررسی وضعیت‌ها:', error);
      }
    };

    checkStates();

    window.addEventListener('cartUpdated', checkStates);

    return () => {
      window.removeEventListener('cartUpdated', checkStates);
    };
  }, [id, websiteId]);

  const handleQuantityChange = async (newQuantity) => {
    if (!cartItem) return;

    setIsUpdatingQuantity(true);
    const currentWebsiteId = websiteId || localStorage.getItem('current_store_website_id');

    try {
      if (newQuantity <= 0) {
        await deleteItemFromCart(cartItem.id);
        setCartItem(null);
      } else if (newQuantity < cartItem.quantity) {
        await removeOneFromCart(cartItem.id);
      } else {
        await addItemToCart(id, newQuantity);
      }

      const items = await getMyCart();
      const updatedItem = items.find(item => String(item.item_id) === String(id));
      setCartItem(updatedItem || null);

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(' خطا در تغییر تعداد:', error);
      showModal('error', 'خطا!', 'مشکلی در تغییر تعداد محصول پیش آمد');
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent || originalPrice === undefined || originalPrice === null) return null;

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
        showModal('error', 'نیاز به ورود', 'برای افزودن به سبد خرید باید وارد شوید');
        setTimeout(() => {
          navigate(`/${slug}/login`);
        }, 2000);
        return;
      }

      const result = await addItemToCart(id, currentWebsiteId, 1, token);

      const items = await getMyCart();
      const itemInCart = items.find(item => String(item.item_id) === String(id));
      setCartItem(itemInCart || null);

      window.dispatchEvent(new Event("cartUpdated"));

      showModal('success', 'موفقیت آمیز!', 'محصول با موفقیت به سبد خرید اضافه شد');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showModal('error', 'خطا!', 'مشکلی در افزودن محصول به سبد خرید پیش آمد');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      setIsUpdatingFavorite(true);

      const currentWebsiteId = websiteId || localStorage.getItem('current_store_website_id');
      const token = localStorage.getItem(`buyer_token_${currentWebsiteId}`);

      if (!token) {
        showModal('error', 'نیاز به ورود', 'برای افزودن به علاقه‌مندی‌ها باید وارد شوید');
        setTimeout(() => {
          navigate(`/${slug}/login`);
        }, 2000);
        return;
      }

      if (isLiked && favoriteId) {
        await removeFromFavorites(favoriteId, currentWebsiteId);
        setIsLiked(false);
        setFavoriteId(null);
        showModal('success', 'حذف شد', 'محصول از علاقه‌مندی‌ها حذف شد');
      } else {
        const result = await addToFavorites(id, currentWebsiteId);
        setIsLiked(true);
        setFavoriteId(result.id);
        showModal('success', 'اضافه شد', 'محصول به علاقه‌مندی‌ها اضافه شد');
      }

    } catch (error) {
      console.error('❌ Error updating favorites:', error);

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        showModal('error', 'خطا!', 'توکن شما منقضی شده. لطفاً دوباره وارد شوید');
        setTimeout(() => {
          navigate(`/${slug}/login`);
        }, 3000);
      } else {
        showModal('error', 'خطا!', 'مشکلی در به‌روزرسانی علاقه‌مندی‌ها پیش آمد');
      }
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

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

  const { fullStars, hasHalfStar, emptyStars } = getStars(actualRating);

  return (
    <>
      <div className="group relative font-Kahroba bg-white shadow-lg rounded-2xl p-4 w-full max-w-[260px] transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-2xl z-10">
          <div className="absolute inset-0 flex items-center justify-center">
            {cartItem ? (
              <div className="flex gap-2 items-center bg-white px-3 py-1 rounded-full shadow-md min-w-[100px] justify-center">
                {isUpdatingQuantity ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                ) : (
                  <>
                    <button
                      onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                      disabled={isUpdatingQuantity}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                    >
                      −
                    </button>
                    <span className="font-bold text-gray-800">{cartItem.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                      disabled={isUpdatingQuantity}
                      className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 text-white text-lg font-bold"
                    >
                      +
                    </button>
                  </>
                )}
              </div>

            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`opacity-0 group-hover:opacity-100 bg-black text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2 hover:bg-gray-800 ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <ShoppingCart size={18} />
                {isAddingToCart ? 'در حال افزودن...' : 'افزودن به سبد'}
              </button>
            )}
          </div>

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

        <div className="relative mb-4 overflow-hidden rounded-xl">
          <div className="h-52 flex items-center justify-center bg-gray-50">
            <img
              src={mainImage || image || "/website/Image(1).png"}
              alt={name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              onError={(e) => { e.target.src = "/website/Image(1).png"; }}
            />
          </div>

          {discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-20">
              {discount}%
            </span>
          )}
        </div>

        <div className="text-right space-y-2">
          <h3 className="text-gray-800 font-bold text-lg leading-tight">{name}</h3>

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

          <div className="flex justify-end items-center gap-1">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}

            {hasHalfStar && (
              <div className="relative">
                <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            )}

            {[...Array(emptyStars)].map((_, i) => (
              <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-4 h-4 fill-gray-300 text-gray-300" />
            ))}

            <span className="text-sm text-gray-600 mr-1">
              {actualRating > 0 ? actualRating.toFixed(1) : '۰'}
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </>
  );
};

export default ProductCard;