import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Heart, Eye, Package, ChevronDown, CreditCard, Loader, Ticket, Calendar, Percent } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { addItemToCart, getMyCart, removeOneFromCart, deleteItemFromCart } from '../../../../API/cart.jsx';
import { createOrder } from '../../../../API/orders.jsx';
import { requestOrderPayment } from '../../../../API/payments.jsx';
import { getCouponsByWebsiteInStore } from '../../../../API/coupons.jsx';
import { getActivePlan } from '../../../../API/website.js';
import { getFavorites } from '../../../../API/favorites.jsx';
import { getProductById } from '../../../../API/Items.jsx';
import ProductCard from '../Home/ProductCard.jsx';
import { getMyOrders } from '../../../../API/orders.jsx';
import { applyCouponToOrder } from '../../../../API/coupons.jsx';

// Import کامپوننت‌های جدید
import CartSection from './components/CartSection.jsx';
import CouponsSection from './components/CouponsSection.jsx';
import PreviousOrdersSection from './components/PreviousOrdersSection.jsx';
import InterestsSection from './components/InterestsSection.jsx';
import NavigationMenu from './components/NavigationMenu.jsx';

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
  const [copiedCode, setCopiedCode] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  // 1. اضافه کردن state جدید برای isCreatingOrder
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // 2. تابع جدید برای ایجاد سفارش
  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      alert('سبد خرید شما خالی است!');
      return;
    }

    try {
      setIsCreatingOrder(true);

      const websiteId = localStorage.getItem('current_store_website_id');
      const token = localStorage.getItem(`buyer_token_${websiteId}`);

      if (!token || !websiteId) {
        alert('لطفاً دوباره وارد شوید');
        navigate(`/${slug}/login`);
        return;
      }

      console.log('🚀 Creating order...');

      const orderResponse = await createOrder(websiteId, token);

      if (!orderResponse || !orderResponse.order_id) {
        throw new Error('خطا در ایجاد سفارش - order_id دریافت نشد');
      }

      console.log('✅ Order created successfully:', orderResponse);
      setCurrentOrderId(orderResponse.order_id);

    } catch (error) {
      console.error('خطا در ایجاد سفارش:', error);
      alert('خطا در ایجاد سفارش: ' + error.message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

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
          total: order.total_price ? parseFloat(order.total_price) : 0,
          items: order.order_items.map(item => ({
            name: `آیتم ${item.item_id.substring(0, 6)}`,
            price: item.price ? parseFloat(item.price) : 0,
            quantity: item.quantity || 1,
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
        name: item.item_name || `محصول ${item.item_id.substring(0, 8)}`,
        originalPrice: item.price ? parseFloat(item.price) : 0,
        price: item.discount_price ? parseFloat(item.discount_price) : parseFloat(item.price) || 0,
        hasDiscount: item.discount_price && parseFloat(item.discount_price) < parseFloat(item.price),
        quantity: item.quantity || 1,
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


  // 4. تغییر handleCheckout
  const handleCheckout = async () => {
    if (!currentOrderId) {
      alert('ابتدا سفارش را ایجاد کنید');
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

      console.log('💳 Processing payment for order:', currentOrderId);

      const paymentResponse = await requestOrderPayment(token);

      if (!paymentResponse || !paymentResponse.payment_url) {
        throw new Error('خطا در دریافت لینک پرداخت - payment_url دریافت نشد');
      }

      localStorage.setItem('current_order_id', currentOrderId);
      localStorage.setItem('current_website_id', websiteId);

      window.location.href = paymentResponse.payment_url;

    } catch (error) {
      console.error('خطا در فرآیند پرداخت:', error);
      alert('خطا در فرآیند پرداخت: ' + error.message);
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

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      const quantity = item.quantity || 0;
      return total + quantity;
    }, 0);
  };

  // 3. تغییر handleCouponSubmit
  const handleCouponSubmit = async () => {
    if (!couponCode.trim()) {
      alert('لطفاً کد تخفیف را وارد کنید');
      return;
    }

    if (!currentOrderId) {
      alert('ابتدا سفارش را ایجاد کنید');
      return;
    }

    try {
      console.log('🎫 Applying coupon to order:', currentOrderId);

      const couponResponse = await applyCouponToOrder(currentOrderId, couponCode);

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
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) {
      return '0 ریال';
    }

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

  // callback برای وقتی محصول به سبد خرید اضافه میشه
  const handleAddToCart = async (productId, result) => {
    console.log(`محصول ${productId} به سبد خرید اضافه شد:`, result);
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

      const favorites = await getFavorites(websiteId);

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
    refreshFavorites();
  };

  // توابع محاسبه
  const calculateOriginalTotal = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price || 0;
      const quantity = item.quantity || 0;
      return total + (originalPrice * quantity);
    }, 0);
  };

  const calculateProductDiscount = () => {
    return cartItems.reduce((discount, item) => {
      if (item.hasDiscount) {
        const discountPerItem = (item.originalPrice || 0) - (item.price || 0);
        const quantity = item.quantity || 0;
        return discount + (discountPerItem * quantity);
      }
      return discount;
    }, 0);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const calculateFinalTotal = () => {
    const baseTotal = calculateTotal();
    return Math.max(0, baseTotal - couponDiscount);
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
      <NavigationMenu
        activePlan={activePlan}
        scrollToSection={scrollToSection}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        <CartSection
          cartItems={cartItems}
          isProcessingPayment={isProcessingPayment}
          isCreatingOrder={isCreatingOrder}  // جدید
          currentOrderId={currentOrderId}    // جدید
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          appliedCoupon={appliedCoupon}
          couponDiscount={couponDiscount}
          calculateOriginalTotal={calculateOriginalTotal}
          calculateProductDiscount={calculateProductDiscount}
          calculateTotal={calculateTotal}
          calculateFinalTotal={calculateFinalTotal}
          getTotalItems={getTotalItems}
          formatPrice={formatPrice}
          handleCreateOrder={handleCreateOrder}  // جدید
          handleCheckout={handleCheckout}
          handleCouponSubmit={handleCouponSubmit}
          removeItem={removeItem}
          updateQuantity={updateQuantity}
        />

        {activePlan?.is_active && activePlan?.plan?.name === 'Pro' && (
          <CouponsSection
            loadingCoupons={loadingCoupons}
            availableCoupons={availableCoupons}
            copiedCode={copiedCode}
            formatPrice={formatPrice}
            applyCoupon={applyCoupon}
          />
        )}

        <PreviousOrdersSection
          previousOrders={previousOrders}
          formatPrice={formatPrice}
          navigate={navigate}
          slug={slug}
        />

        <InterestsSection
          loadingFavorites={loadingFavorites}
          favoriteProducts={favoriteProducts}
          ProductCard={ProductCard}
          handleProductClick={handleProductClick}
          handleAddToCart={handleAddToCart}
          handleFavoriteChange={handleFavoriteChange}
        />
      </div>
    </div>
  );
}