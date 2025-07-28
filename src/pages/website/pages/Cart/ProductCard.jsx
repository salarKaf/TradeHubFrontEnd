import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Heart, Eye, Package, ChevronDown, CreditCard, Loader } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { addItemToCart, getMyCart, removeOneFromCart, deleteItemFromCart } from '../../../../API/cart';
import { createOrder } from '../../../../API/orders';
import { requestOrderPayment } from '../../../../API/payments';

// کامپوننت کارت محصول (همون قبلی)
const ProductCard = ({ product, discount, image, price = "150,000 تومان", name = "نام محصول", rating = 5 }) => {
  const [isLiked, setIsLiked] = useState(false);

  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent) return null;
    const numericPrice = parseInt(originalPrice.replace(/[^\d]/g, ''));
    const discountAmount = (numericPrice * parseInt(discountPercent)) / 100;
    const discountedPrice = numericPrice - discountAmount;
    return discountedPrice.toLocaleString('fa-IR') + ' تومان';
  };

  const discountedPrice = discount ? calculateDiscountedPrice(price, discount) : null;

  return (
    <div className="group relative font-sans bg-white shadow-lg rounded-2xl p-4 w-full max-w-[260px] transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-2xl z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 bg-black text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2 hover:bg-gray-800">
            <ShoppingCart size={18} />
            افزودن به سبد
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 flex transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center justify-center gap-1 px-3 py-2 w-1/2 mr-1 rounded-lg transition-all duration-200 ${isLiked
              ? 'bg-black text-red-400 hover:bg-gray-800'
              : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-medium">پسندیدن</span>
          </button>
          <button className="flex items-center justify-center gap-1 px-3 py-2 w-1/2 ml-1 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-200">
            <Eye size={16} />
            <span className="text-sm font-medium">مشاهده</span>
          </button>
        </div>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-xl">
        <div className="h-52 flex items-center justify-center bg-gray-50">
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400">تصویر محصول</span>
          </div>
        </div>
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-20">
            {discount}
          </span>
        )}
      </div>

      <div className="text-right space-y-2">
        <h3 className="text-gray-800 font-bold text-lg leading-tight">{name}</h3>
        <div className="space-y-1">
          {discount ? (
            <>
              <p className="text-gray-400 text-sm line-through">{price}</p>
              <p className="text-red-500 font-bold text-xl">{discountedPrice}</p>
            </>
          ) : (
            <p className="text-blue-600 font-bold text-xl">{price}</p>
          )}
        </div>
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

export default function Card() {
  const navigate = useNavigate();
  const { slug } = useParams(); // برای گرفتن slug
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // چک کردن لاگین و بارگذاری سبد خرید
  useEffect(() => {
    const checkLoginAndLoadCart = async () => {
      // 🔴 استفاده از توکن مخصوص فروشگاه فعلی
      const websiteId = localStorage.getItem('current_store_website_id');
      const token = localStorage.getItem(`buyer_token_${websiteId}`);

      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      await loadCartItems();
    };

    checkLoginAndLoadCart();
  }, []);

  // بارگذاری آیتم‌های سبد خرید
  const loadCartItems = async () => {
    try {
      setLoading(true);
      const cartItems = await getMyCart();

      // فرمت‌دهی آیتم‌های سبد خرید
      const formattedItems = cartItems.map(item => ({
        id: item.id,
        name: item.name || `محصول ${item.item_id.substring(0, 8)}`,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image_url || null,
        itemId: item.item_id,
        websiteId: item.website_id
      }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error("خطا در دریافت سبد خرید:", error);
      if (error.response?.status === 401) {
        const websiteId = localStorage.getItem('current_store_website_id');
        localStorage.removeItem(`buyer_token_${websiteId}`);
        setIsLoggedIn(false);
        navigate(`/${slug}/login`);
      }
    } finally {
      setLoading(false);
    }
  };

  // فرآیند پرداخت
  // ✅ فرآیند پرداخت درست شده
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('سبد خرید شما خالی است!');
      return;
    }

    try {
      setIsProcessingPayment(true);

      // گرفتن اطلاعات مورد نیاز
      const websiteId = localStorage.getItem('current_store_website_id');
      const token = localStorage.getItem(`buyer_token_${websiteId}`);

      if (!token || !websiteId) {
        alert('لطفاً دوباره وارد شوید');
        navigate(`/${slug}/login`);
        return;
      }

      console.log('🚀 Starting checkout process...');
      console.log('Website ID:', websiteId);
      console.log('Token exists:', !!token);
      console.log('Cart items count:', cartItems.length);

      // مرحله 1: ایجاد سفارش (این website_id می‌خواهد)
      console.log('📝 Step 1: Creating order...');
      const orderResponse = await createOrder(websiteId, token);

      if (!orderResponse || !orderResponse.order_id) {
        throw new Error('خطا در ایجاد سفارش - order_id دریافت نشد');
      }

      console.log('✅ Order created with ID:', orderResponse.order_id);

      // مرحله 2: درخواست پرداخت (این هیچ پارامتری نمی‌خواهد، فقط توکن)
      console.log('💳 Step 2: Requesting payment...');
      const paymentResponse = await requestOrderPayment(token);  // فقط توکن

      if (!paymentResponse || !paymentResponse.payment_url) {
        throw new Error('خطا در دریافت لینک پرداخت - payment_url دریافت نشد');
      }

      console.log('✅ Payment URL received:', paymentResponse.payment_url);

      // ذخیره اطلاعات مورد نیاز برای callback
      localStorage.setItem('current_order_id', orderResponse.order_id);
      localStorage.setItem('current_website_id', websiteId);

      console.log('🔄 Redirecting to payment gateway...');

      // انتقال به درگاه پرداخت
      window.location.href = paymentResponse.payment_url;

    } catch (error) {
      console.error('❌ Checkout error details:', error);

      // مدیریت خطاهای مختلف با جزئیات بیشتر
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        alert('جلسه شما منقضی شده. لطفاً مجدداً وارد شوید');
        const websiteId = localStorage.getItem('current_store_website_id');
        localStorage.removeItem(`buyer_token_${websiteId}`);
        navigate(`/${slug}/login`);
      } else if (error.message.includes('422')) {
        alert('داده‌های ارسالی نامعتبر است. ممکن است سبد خرید شما خالی باشد');
        await loadCartItems(); // رفرش سبد خرید
      } else if (error.message.includes('400')) {
        alert('درخواست نامعتبر. لطفاً صفحه را رفرش کنید و دوباره تلاش کنید');
      } else if (error.message.includes('500')) {
        alert('خطای سرور. لطفاً چند لحظه بعد دوباره تلاش کنید');
      } else {
        alert('خطا در فرآیند پرداخت: ' + error.message);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ✅ همچنین این تابع را برای debug اضافه کنید
  const debugCheckoutInfo = () => {
    const websiteId = localStorage.getItem('current_store_website_id');
    const token = localStorage.getItem(`buyer_token_${websiteId}`);

    console.log('🔍 Debug Info:');
    console.log('- Website ID:', websiteId);
    console.log('- Token exists:', !!token);
    console.log('- Token length:', token ? token.length : 0);
    console.log('- Cart items:', cartItems.length);
    console.log('- User logged in:', isLoggedIn);

    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log('- Token payload:', tokenPayload);
        console.log('- Token expires:', new Date(tokenPayload.exp * 1000));
      } catch (e) {
        console.log('- Token parse error:', e.message);
      }
    }
  };

  // نمونه داده‌های خرید‌های قبلی
  const [previousOrders] = useState([
    {
      id: 1,
      date: "1403/04/15",
      total: 2450000,
      items: [
        { name: "لپ‌تاپ ایسوس", price: 2200000, quantity: 1 },
        { name: "ماوس گیمینگ", price: 250000, quantity: 1 }
      ]
    },
    {
      id: 2,
      date: "1403/03/28",
      total: 1850000,
      items: [
        { name: "تلویزیون ال‌جی", price: 1850000, quantity: 1 }
      ]
    },
    {
      id: 3,
      date: "1403/03/10",
      total: 950000,
      items: [
        { name: "اسپیکر بلوتوث", price: 450000, quantity: 1 },
        { name: "کابل شارژ", price: 50000, quantity: 10 }
      ]
    },
    {
      id: 4,
      date: "1403/02/20",
      total: 3200000,
      items: [
        { name: "موبایل شیائومی", price: 1800000, quantity: 1 },
        { name: "کیف لپ‌تاپ", price: 350000, quantity: 1 },
        { name: "پاوربانک", price: 520000, quantity: 2 }
      ]
    }
  ]);

  // نمونه محصولات علاقه‌مندی
  const [favoriteProducts] = useState([
    { id: 1, name: "آیفون 15 پرو", price: "45,000,000 تومان", discount: "5%", rating: 5 },
    { id: 2, name: "سامسونگ گلکسی S24", price: "32,000,000 تومان", discount: "", rating: 4 },
    { id: 3, name: "هدفون سونی", price: "2,500,000 تومان", discount: "15%", rating: 5 },
    { id: 4, name: "ساعت هوشمند", price: "8,500,000 تومان", discount: "10%", rating: 4 },
    { id: 5, name: "تبلت آیپد", price: "25,000,000 تومان", discount: "", rating: 5 },
    { id: 6, name: "کیس گیمینگ", price: "3,200,000 تومان", discount: "20%", rating: 4 }
  ]);

  const [couponCode, setCouponCode] = useState('');

  // حذف آیتم از سبد خرید
  const removeItem = async (cartItemId) => {
    try {
      await deleteItemFromCart(cartItemId);
      await loadCartItems(); // رفرش سبد خرید
    } catch (error) {
      console.error("خطا در حذف محصول:", error);
      alert('خطا در حذف محصول');
    }
  };

  // تغییر تعداد آیتم
  const updateQuantity = async (cartItemId, newQuantity, currentQuantity, itemId, websiteId) => {
    try {
      if (newQuantity > currentQuantity) {
        // اضافه کردن - باید از addItemToCart استفاده کنیم
        await addItemToCart(itemId);
      } else if (newQuantity < currentQuantity && newQuantity > 0) {
        // کم کردن
        await removeOneFromCart(cartItemId);
      } else if (newQuantity === 0) {
        // حذف کامل
        await deleteItemFromCart(cartItemId);
      }
      await loadCartItems(); // رفرش سبد خرید
    } catch (error) {
      console.error("خطا در تغییر تعداد:", error);
      alert('خطا در تغییر تعداد محصول');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCouponSubmit = () => {
    console.log('Coupon applied:', couponCode);
    // TODO: پیاده‌سازی کد تخفیف در آینده
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // اگر لاگین نکرده
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 font-sans flex items-center justify-center" dir="rtl">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">برای مشاهده سبد خرید وارد شوید</h2>
          <p className="text-gray-600 mb-6">برای مشاهده و مدیریت سبد خرید خود باید وارد حساب کاربری شوید</p>
          <button
            onClick={() => navigate(`/${slug}/login`)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ورود به حساب کاربری
          </button>
        </div>
      </div>
    );
  }

  // اگر در حال بارگذاری
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 font-sans flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری سبد خرید...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 font-sans" dir="rtl">
      {/* Navigation Menu */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-center items-center gap-8">
            <button
              onClick={() => scrollToSection('cart-section')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">سبد خرید</span>
            </button>
            <button
              onClick={() => scrollToSection('previous-section')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">خرید های پیشین</span>
            </button>
            <button
              onClick={() => scrollToSection('interests-section')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">علاقمندی ها</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        {/* Cart Section */}
        <section id="cart-section" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Summary Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 h-fit border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">جزئیات پرداخت</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">قیمت کل محصولات</span>
                  <span className="font-bold text-gray-800">{formatPrice(calculateTotal())}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">تعداد آیتم‌ها</span>
                  <span className="font-bold text-gray-800">{getTotalItems()} عدد</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">هزینه ارسال</span>
                  <span className="font-bold text-green-600">رایگان</span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-800">مبلغ قابل پرداخت</span>
                    <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">کد تخفیف دارید؟</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="کد تخفیف را وارد کنید"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={handleCouponSubmit}
                      className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium"
                    >
                      اعمال کد تخفیف
                    </button>
                  </div>
                </div>
              </div>

              {/* 🔥 دکمه پرداخت آپدیت شده */}
              <button
                onClick={handleCheckout}
                disabled={isProcessingPayment || cartItems.length === 0}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center gap-3 ${isProcessingPayment || cartItems.length === 0
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105'
                  }`}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    ادامه فرایند خرید
                  </>
                )}
              </button>

              {cartItems.length === 0 && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  سبد خرید شما خالی است
                </p>
              )}
            </div>

            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
                {cartItems.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-600 mb-3">سبد خرید خالی است</h3>
                    <p className="text-gray-500">محصولی به سبد خرید اضافه نکرده‌اید</p>
                  </div>
                ) : (
                  <>
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 font-bold text-gray-700">
                      <div className="text-center">حذف</div>
                      <div className="text-center">تعداد</div>
                      <div className="text-center">قیمت واحد</div>
                      <div className="text-center">قیمت کل</div>
                      <div className="text-center">نام محصول</div>
                      <div className="text-center">محصول</div>
                    </div>

                    {/* Cart Items */}
                    <div className="divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-6 gap-4 p-6 items-center hover:bg-gray-50/50 transition-all duration-300">
                          <div className="flex justify-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.quantity, item.itemId, item.websiteId)}
                              className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 flex items-center justify-center transition-all duration-300 font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.quantity, item.itemId, item.websiteId)}
                              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 flex items-center justify-center transition-all duration-300 font-bold"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-center">
                            <span className="font-bold text-gray-700">{formatPrice(item.price)}</span>
                          </div>
                          <div className="text-center">
                            <span className="font-bold text-xl text-blue-600">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                          <div className="text-center">
                            <span className="font-bold text-gray-800">
                              {item.name || `محصول ${item.itemId.substring(0, 8)}`}
                            </span>
                          </div>
                          <div className="flex justify-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <Package className="w-8 h-8 text-gray-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Previous Orders Section */}
        <section id="previous-section" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">سفارش‌های قبلی</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previousOrders.map((order) => (
              <div key={order.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">سفارش #{order.id}</h3>
                    <p className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">📅 {order.date}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-purple-600">{formatPrice(order.total)}</p>
                    <p className="text-sm text-gray-500">{order.items.length} محصول</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 border-b border-gray-200 pb-2">محصولات سفارش:</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl flex items-center justify-center shadow-lg">
                            <Package className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600 bg-purple-100 px-2 py-1 rounded-full inline-block">تعداد: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-purple-600 text-lg">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                    مشاهده جزئیات سفارش
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interests Section */}
        <section id="interests-section" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">علاقه‌مندی‌ها</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                discount={product.discount}
                rating={product.rating}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}