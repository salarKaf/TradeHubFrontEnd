import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Heart, Eye, Package, ChevronDown, CreditCard, Loader, Ticket, Calendar, Percent } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { addItemToCart, getMyCart, removeOneFromCart, deleteItemFromCart } from '../../../../API/cart.jsx';
import { createOrder } from '../../../../API/orders.jsx';
import { requestOrderPayment } from '../../../../API/payments.jsx';
import { getCouponsByWebsiteInStore } from '../../../../API/coupons.jsx';
import { getActivePlan } from '../../../../API/website.js';
import { getFavorites } from '../../../../API/favorites.jsx';
import { getProductById } from '../../../../API/Items.jsx'; // بر
import ProductCard from '../Home/ProductCard.jsx';
import { getMyOrders } from '../../../../API/orders.jsx';
import { applyCouponToOrder } from '../../../../API/coupons.jsx';
export default function Card() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  // بعد از useState های موجود:
  const [copiedCode, setCopiedCode] = useState(null);
  // در state های کامپوننت اضافه کن:
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  // بعد از useState ها اضافه کن:
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  useEffect(() => {
    if (copiedCode) {
      const timer = setTimeout(() => setCopiedCode(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedCode]);

  // useEffect برای بارگذاری علاقه‌مندی‌ها
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn) return;

      try {
        setLoadingFavorites(true);
        const websiteId = localStorage.getItem('current_store_website_id');

        // دریافت لیست علاقه‌مندی‌ها
        const favorites = await getFavorites(websiteId);

        // دریافت جزئیات هر محصول
        const favoriteDetails = await Promise.all(
          favorites.map(async (fav) => {
            try {
              const productDetail = await getProductById(fav.item_id);
              return {
                id: fav.item_id,
                favoriteId: fav.id,
                name: productDetail.name || "محصول بدون نام",
                price: productDetail.price ? parseInt(productDetail.price) : 0,
                image: productDetail.image_url || "",
                rating: 5,
                discount: productDetail.discount_active && productDetail.discount_percent > 0
                  ? `${productDetail.discount_percent}%`
                  : null,
                discountedPrice: productDetail.discount_active && productDetail.discount_price
                  ? parseInt(productDetail.discount_price)
                  : null,
              };
            } catch (error) {
              console.error(`خطا در دریافت جزئیات محصول ${fav.item_id}:`, error);
              return {
                id: fav.item_id,
                favoriteId: fav.id,
                name: `محصول ${fav.item_id.substring(0, 8)}`,
                price: 0,
                image: "",
                rating: 5,
                discount: null,
                discountedPrice: null,
              };
            }
          })
        );

        setFavoriteProducts(favoriteDetails);
      } catch (error) {
        console.error('خطا در دریافت علاقه‌مندی‌ها:', error);
        setFavoriteProducts([]);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [isLoggedIn]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();

        const formatted = data.map(order => ({
          id: order.order_id,
          date: new Date(order.created_at).toLocaleDateString('fa-IR'),
          total: order.total_price ? parseFloat(order.total_price) : 0, // 👈 اینجا
          items: order.order_items.map(item => ({
            name: `آیتم ${item.item_id.substring(0, 6)}`,
            price: item.price ? parseFloat(item.price) : 0, // 👈 اینجا
            quantity: item.quantity || 1, // 👈 اینجا
            itemId: item.item_id,
          })),
          status: order.status
        }));

        setPreviousOrders(formatted);
      } catch (err) {
        console.error('خطا در دریافت سفارش‌ها:', err);
      }
    };

    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  // چک کردن لاگین و بارگذاری سبد خرید
  useEffect(() => {
    const checkLoginAndLoadCart = async () => {
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

      const formattedItems = cartItems.map(item => ({
        id: item.id,
        name: item.name || `محصول ${item.item_id.substring(0, 8)}`,
        price: item.price ? parseFloat(item.price) : 0, // 👈 اینجا چک کن
        quantity: item.quantity || 1, // 👈 اینجا هم
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
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('سبد خرید شما خالی است!');
      return;
    }

    try {
      setIsProcessingPayment(true);

      const websiteId = localStorage.getItem('current_store_website_id');
      const token = localStorage.getItem(`buyer_token_${websiteId}`);

      if (!token || !websiteId) {
        alert('لطفاً دوباره وارد شوید');
        navigate(`/${slug}/login`);
        return;
      }

      console.log('🚀 Starting checkout process...');
      const orderResponse = await createOrder(websiteId, token);

      if (!orderResponse || !orderResponse.order_id) {
        throw new Error('خطا در ایجاد سفارش - order_id دریافت نشد');
      }

      console.log('✅ Order created with ID:', orderResponse.order_id);

      const paymentResponse = await requestOrderPayment(token);

      if (!paymentResponse || !paymentResponse.payment_url) {
        throw new Error('خطا در دریافت لینک پرداخت - payment_url دریافت نشد');
      }

      localStorage.setItem('current_order_id', orderResponse.order_id);
      localStorage.setItem('current_website_id', websiteId);

      window.location.href = paymentResponse.payment_url;

    } catch (error) {
      console.error('❌ Checkout error details:', error);

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        alert('جلسه شما منقضی شده. لطفاً مجدداً وارد شوید');
        const websiteId = localStorage.getItem('current_store_website_id');
        localStorage.removeItem(`buyer_token_${websiteId}`);
        navigate(`/${slug}/login`);
      } else if (error.message.includes('422')) {
        alert('داده‌های ارسالی نامعتبر است. ممکن است سبد خرید شما خالی باشد');
        await loadCartItems();
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





  // دریافت پلن فعال و کوپن‌ها
  useEffect(() => {
    const fetchPlanAndCoupons = async () => {
      try {
        const websiteId = localStorage.getItem('current_store_website_id');
        if (!websiteId) return;

        // دریافت پلن فعال
        const planData = await getActivePlan(websiteId);
        setActivePlan(planData);

        // 🔧 تغییر اینجا - مثل ProductShow عمل کن
        const hasPro = planData?.is_active && planData?.plan?.name === 'Pro';

        // اگر پلن Pro باشه، کوپن‌ها رو بگیر
        if (hasPro) {
          setLoadingCoupons(true);
          try {
            const couponsData = await getCouponsByWebsiteInStore(websiteId);
            setAvailableCoupons(couponsData || []);
          } catch (error) {
            console.error('خطا در دریافت کوپن‌ها:', error);
            setAvailableCoupons([]);
          } finally {
            setLoadingCoupons(false);
          }
        }
      } catch (error) {
        console.error('خطا در دریافت پلن:', error);
      }
    };

    if (isLoggedIn) {
      fetchPlanAndCoupons();
    }
  }, [isLoggedIn]);

  const [couponCode, setCouponCode] = useState('');

  // حذف آیتم از سبد خرید
  const removeItem = async (cartItemId) => {
    try {
      await deleteItemFromCart(cartItemId);
      await loadCartItems();
    } catch (error) {
      console.error("خطا در حذف محصول:", error);
      alert('خطا در حذف محصول');
    }
  };

  // تغییر تعداد آیتم
  const updateQuantity = async (cartItemId, newQuantity, currentQuantity, itemId, websiteId) => {
    try {
      if (newQuantity > currentQuantity) {
        await addItemToCart(itemId);
      } else if (newQuantity < currentQuantity && newQuantity > 0) {
        await removeOneFromCart(cartItemId);
      } else if (newQuantity === 0) {
        await deleteItemFromCart(cartItemId);
      }
      await loadCartItems();
    } catch (error) {
      console.error("خطا در تغییر تعداد:", error);
      alert('خطا در تغییر تعداد محصول');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      const quantity = item.quantity || 0;
      return total + quantity;
    }, 0);
  };

  const handleCouponSubmit = async () => {
    if (!couponCode.trim()) {
      alert('لطفاً کد تخفیف را وارد کنید');
      return;
    }

    // ابتدا سفارش ایجاد کن
    try {
      const websiteId = localStorage.getItem('current_store_website_id');
      const token = localStorage.getItem(`buyer_token_${websiteId}`);

      const orderResponse = await createOrder(websiteId, token);
      if (!orderResponse?.order_id) {
        throw new Error('خطا در ایجاد سفارش');
      }

      setCurrentOrderId(orderResponse.order_id);

      // حالا کوپن رو اعمال کن
      const couponResponse = await applyCouponToOrder(orderResponse.order_id, couponCode);

      setAppliedCoupon(couponCode);
      setCouponDiscount(couponResponse.discount_amount || 0);
      alert('کد تخفیف با موفقیت اعمال شد!');

    } catch (error) {
      console.error('خطا در اعمال کوپن:', error);
      alert('خطا در اعمال کد تخفیف: ' + error.message);
    }
  };

  const applyCoupon = (couponCode) => {
    setCouponCode(couponCode);
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);

    // پیام کپی شدن رو بعد از 2 ثانیه پاک کن
    setTimeout(() => setCopiedCode(null), 2000);

    handleCouponSubmit();
  };


  const calculateFinalTotal = () => {
    const baseTotal = calculateTotal();
    return baseTotal - couponDiscount;
  };

  const formatPrice = (price) => {
    // اگه price وجود نداشته باشه یا null باشه
    if (!price && price !== 0) {
      return '0 ریال';
    }

    // تبدیل به عدد
    const numericPrice = typeof price === 'number' ? price : parseFloat(price) || 0;

    return numericPrice.toLocaleString('fa-IR') + ' ریال';
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


  // این تابع‌ها رو در کامپوننت Card قبل از return اضافه کن:

  // callback برای وقتی محصول به سبد خرید اضافه میشه
  const handleAddToCart = async (productId, result) => {
    console.log(`محصول ${productId} به سبد خرید اضافه شد:`, result);
    // بارگذاری مجدد سبد خرید برای نمایش تعداد جدید
    await loadCartItems();
  };

  // callback برای کلیک روی محصول
  const handleProductClick = (productId) => {
    navigate(`/${slug}/product/${productId}`);
  };

  // تابع برای رفرش کردن علاقه‌مندی‌ها بعد از تغییر
  const refreshFavorites = async () => {
    if (!isLoggedIn) return;

    try {
      setLoadingFavorites(true);
      const websiteId = localStorage.getItem('current_store_website_id');

      // دریافت لیست علاقه‌مندی‌ها
      const favorites = await getFavorites(websiteId);

      // دریافت جزئیات هر محصول
      const favoriteDetails = await Promise.all(
        favorites.map(async (fav) => {
          try {
            const productDetail = await getProductById(fav.item_id);
            return {
              id: fav.item_id,
              favoriteId: fav.id,
              name: productDetail.name || "محصول بدون نام",
              price: productDetail.price ? parseInt(productDetail.price) : 0,
              image: productDetail.image_url || "",
              rating: 5,
              discount: productDetail.discount_active && productDetail.discount_percent > 0
                ? `${productDetail.discount_percent}%`
                : null,
              discountedPrice: productDetail.discount_active && productDetail.discount_price
                ? parseInt(productDetail.discount_price)
                : null,
            };
          } catch (error) {
            console.error(`خطا در دریافت جزئیات محصول ${fav.item_id}:`, error);
            return {
              id: fav.item_id,
              favoriteId: fav.id,
              name: `محصول ${fav.item_id.substring(0, 8)}`,
              price: 0,
              image: "",
              rating: 5,
              discount: null,
              discountedPrice: null,
            };
          }
        })
      );

      setFavoriteProducts(favoriteDetails);
    } catch (error) {
      console.error('خطا در دریافت علاقه‌مندی‌ها:', error);
      setFavoriteProducts([]);
    } finally {
      setLoadingFavorites(false);
    }
  };

  // callback برای وقتی محصول از علاقه‌مندی‌ها حذف/اضافه میشه
  const handleFavoriteChange = () => {
    // رفرش کردن لیست علاقه‌مندی‌ها
    refreshFavorites();
  };

  // اگر لاگین نکرده
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">برای مشاهده سبد خرید وارد شوید</h2>
          <p className="text-gray-600 mb-6">برای مشاهده و مدیریت سبد خرید خود باید وارد حساب کاربری شوید</p>
          <button
            onClick={() => navigate(`/${slug}/login`)}
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-all duration-300 shadow-lg"
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
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری سبد خرید...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Navigation Menu */}
      <div className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-center items-center gap-8">
            <button
              onClick={() => scrollToSection('cart-section')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">سبد خرید</span>
            </button>
            {/* فقط اگر پلن Pro باشه دکمه کوپن رو نشون بده */}
            {/* فقط اگر پلن Pro باشه دکمه کوپن رو نشون بده */}
            {activePlan?.is_active && activePlan?.plan?.name === 'Pro' && (
              <button
                onClick={() => scrollToSection('coupons-section')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg"
              >
                <Ticket className="w-5 h-5" />
                <span className="font-medium">کوپن های تخفیف</span>
              </button>
            )}
            <button
              onClick={() => scrollToSection('previous-section')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-lg"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">خرید های پیشین</span>
            </button>
            <button
              onClick={() => scrollToSection('interests-section')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-lg"
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
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-800 rounded-lg">
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
                {appliedCoupon && (
                  <div className="flex justify-between items-center py-2 text-green-600">
                    <span>تخفیف ({appliedCoupon})</span>
                    <span className="font-bold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-800">مبلغ قابل پرداخت</span>
                    <span className="text-gray-800">{formatPrice(calculateFinalTotal())}</span>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={handleCouponSubmit}
                      className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium"
                    >
                      اعمال کد تخفیف
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessingPayment || cartItems.length === 0}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${isProcessingPayment || cartItems.length === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {cartItems.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-600 mb-3">سبد خرید خالی است</h3>
                    <p className="text-gray-500">محصولی به سبد خرید اضافه نکرده‌اید</p>
                  </div>
                ) : (
                  <>
                    {/* Table Header - درست شده از راست به چپ */}
                    <div className="grid grid-cols-6 gap-4 p-6 bg-gray-100 border-b border-gray-200 font-bold text-gray-700">
                      <div className="text-center">محصول</div>
                      <div className="text-center">نام محصول</div>
                      <div className="text-center">قیمت واحد</div>
                      <div className="text-center">تعداد</div>
                      <div className="text-center">قیمت کل</div>
                      <div className="text-center">حذف</div>
                    </div>

                    {/* Cart Items - درست شده از راست به چپ */}
                    <div className="divide-y divide-gray-100">
                      {cartItems.map((item  , index) => (
                        <div key={item.id || index} className="grid grid-cols-6 gap-4 p-6 items-center hover:bg-gray-50 transition-all duration-300">
                          {/* محصول */}
                          <div className="flex justify-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Package className="w-8 h-8 text-gray-500" />
                              )}
                            </div>
                          </div>
                          {/* نام محصول */}
                          <div className="text-center">
                            <span className="font-bold text-gray-800">
                              {item.name || `محصول ${item.itemId.substring(0, 8)}`}
                            </span>
                          </div>
                          {/* قیمت واحد */}
                          <div className="text-center">
                            <span className="font-bold text-gray-700">{formatPrice(item.price)}</span>
                          </div>
                          {/* تعداد */}
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.quantity, item.itemId, item.websiteId)}
                              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.quantity, item.itemId, item.websiteId)}
                              className="w-10 h-10 rounded-lg bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center transition-all duration-300 font-bold"
                            >
                              +
                            </button>
                          </div>
                          {/* قیمت کل */}
                          <div className="text-center">
                            <span className="font-bold text-xl text-gray-800">{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                          </div>
                          {/* حذف */}
                          <div className="flex justify-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
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

        {/* Coupons Section - کامل شده */}
        {/* Coupons Section - فقط برای پلن Pro */}
        {activePlan?.is_active && activePlan?.plan?.name === 'Pro' && (
          <section id="coupons-section" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gray-800 rounded-xl">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">کوپن‌های تخفیف</h2>
            </div>

            {loadingCoupons ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری کوپن‌ها...</p>
              </div>
            ) : availableCoupons.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Ticket className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-3">کوپن تخفیفی موجود نیست</h3>
                <p className="text-gray-500">در حال حاضر کوپن تخفیف فعالی برای این فروشگاه وجود ندارد</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCoupons.map((coupon) => (
                  <div key={coupon.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-gray-100 px-3 py-1 rounded-lg">
                        <span
                          className="font-bold text-gray-800 text-lg cursor-pointer hover:bg-gray-200 px-2 py-1 rounded transition-all"
                          onClick={() => navigator.clipboard.writeText(coupon.code)}
                          title="کلیک کنید تا کپی شود"
                        >
                          {coupon.code}
                        </span>                      </div>
                      <div className="text-left">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-bold">
                          {formatPrice(coupon.discount_amount)} تخفیف
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-800 mb-2">کوپن تخفیف {formatPrice(coupon.discount_amount)}</h3>
                    <p className="text-gray-600 text-sm mb-4">کد: {coupon.code}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>تاریخ انقضا: {new Date(coupon.expiration_date).toLocaleDateString('fa-IR')}</span>                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Percent className="w-4 h-4" />
                        <span>قابل استفاده: {coupon.usage_limit - coupon.times_used} بار</span>
                      </div>
                    </div>

                    <button
                      onClick={() => applyCoupon(coupon.code)}
                      className={`w-full py-3 px-4 rounded-lg transition-all duration-300 font-medium ${copiedCode === coupon.code
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                        }`}
                    >
                      {copiedCode === coupon.code ? '✓ کد کپی شد!' : 'کپی کد تخفیف'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Previous Orders Section - دکمه‌ها در یک ردیف */}
        <section id="previous-section" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gray-800 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">سفارش‌های قبلی</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previousOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">سفارش شما</h3>
                      <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
                        {order.status === 'Paid' ? '✅ پرداخت شده' : '❌ لغو شده'} | تاریخ: {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-800">{formatPrice(order.total)}</p>
                    <p className="text-sm text-gray-500">{order.items.length} محصول</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 border-b border-gray-200 pb-2">محصولات سفارش:</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                            <Package className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">تعداد: {item.quantity}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="font-bold text-gray-800 text-lg">{formatPrice(item.price)}</p>
                          <button
                            onClick={() => {
                              if (order.status === 'Canceled') {
                                navigate(`/${slug}/product/${item.itemId}`); // 👈 فقط وقتی itemId باشه کار می‌کنه
                              } else {
                                navigate(`/${slug}/order/product/${order.id}`);
                              }
                            }}
                            className="bg-gray-800 text-white text-sm py-2 px-4 rounded-lg hover:bg-gray-900 transition-all duration-300"
                          >
                            مشاهده محصول
                          </button>

                        </div>
                      </div>
                    ))}

                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Interests Section */}
        <section id="interests-section" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gray-800 rounded-xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">علاقه‌مندی‌ها</h2>
            <span className="text-sm text-gray-500">({favoriteProducts.length} محصول)</span>
          </div>

          {loadingFavorites ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
              <p className="text-gray-600">در حال بارگذاری علاقه‌مندی‌ها...</p>
            </div>
          ) : favoriteProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-3">هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید</h3>
              <p className="text-gray-500">محصولات مورد علاقه‌تان را با کلیک روی قلب اضافه کنید</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  websiteId={localStorage.getItem('current_store_website_id')}
                  name={product.name}
                  price={product.price}
                  discountedPrice={product.discountedPrice}
                  image={product.image}
                  rating={product.rating}
                  discount={product.discount}
                  product={product}
                  onClick={handleProductClick}
                  onAddToCart={handleAddToCart}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          )}
        </section>

      </div>

    </div>

  );
}