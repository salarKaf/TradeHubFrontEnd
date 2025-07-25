import React, { useState } from 'react';
import { ShoppingCart, Trash2, Heart, Eye, Package, CheckCircle } from 'lucide-react';

// کامپوننت کارت محصول
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

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "گوشی موبایل سامسونگ", price: 15000000, quantity: 2, image: null },
    { id: 2, name: "هدفون بی‌سیم", price: 850000, quantity: 1, image: null },
    { id: 3, name: "کیبورد گیمینگ", price: 1200000, quantity: 1, image: null }
  ]);

  // نمونه داده‌های خرید‌های قبلی
  const [previousOrders] = useState([
    {
      id: 1,
      date: "1403/04/15",
      status: "تحویل شده",
      total: 2450000,
      items: [
        { name: "لپ‌تاپ ایسوس", price: 2200000, quantity: 1 },
        { name: "ماوس گیمینگ", price: 250000, quantity: 1 }
      ]
    },
    {
      id: 2,
      date: "1403/03/28",
      status: "تحویل شده",
      total: 1850000,
      items: [
        { name: "تلویزیون ال‌جی", price: 1850000, quantity: 1 }
      ]
    },
    {
      id: 3,
      date: "1403/03/10",
      status: "تحویل شده",
      total: 950000,
      items: [
        { name: "اسپیکر بلوتوث", price: 450000, quantity: 1 },
        { name: "کابل شارژ", price: 50000, quantity: 10 }
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
  const [activeTab, setActiveTab] = useState('cart');

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity > 0) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
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
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Top Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center space-x-reverse space-x-8">
            <button 
              onClick={() => setActiveTab('cart')}
              className={`px-8 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'cart' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              سبد خرید
            </button>
            <button 
              onClick={() => setActiveTab('previous')}
              className={`px-8 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'previous' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              خرید های پیشین
            </button>
            <button 
              onClick={() => setActiveTab('interests')}
              className={`px-8 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'interests' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              علاقمندی ها
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Summary Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="w-5 h-5" />
                <h2 className="text-lg font-medium">جزئیات پرداخت</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">قیمت کل محصولات</span>
                  <span className="font-medium">{formatPrice(calculateTotal())}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">تعداد آیتم‌ها</span>
                  <span className="font-medium">{getTotalItems()} عدد</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">هزینه ارسال</span>
                  <span className="font-medium text-green-600">رایگان</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>مبلغ قابل پرداخت</span>
                    <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t text-sm text-gray-500">
                  کد تخفیف دارید؟
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="کد تخفیف را وارد کنید"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button 
                    onClick={handleCouponSubmit}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    اعمال کد تخفیف
                  </button>
                </div>
              </div>
              
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium">
                ادامه فرایند خرید
              </button>
            </div>

            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {cartItems.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">سبد خرید خالی است</h3>
                    <p className="text-gray-400">محصولی به سبد خرید اضافه نکرده‌اید</p>
                  </div>
                ) : (
                  <>
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700">
                      <div className="text-center">حذف</div>
                      <div className="text-center">تعداد</div>
                      <div className="text-center">قیمت واحد</div>
                      <div className="text-center">قیمت کل</div>
                      <div className="text-center">نام محصول</div>
                      <div className="text-center">محصول</div>
                    </div>
                    
                    {/* Cart Items */}
                    <div className="divide-y">
                      {cartItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50">
                          <div className="flex justify-center">
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-center items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-center">
                            <span className="font-medium">{formatPrice(item.price)}</span>
                          </div>
                          <div className="text-center">
                            <span className="font-bold text-blue-600">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                          <div className="text-center">
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <div className="flex justify-center">
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
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
        )}

        {activeTab === 'previous' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-6 h-6" />
              <h2 className="text-2xl font-bold">سفارش‌های قبلی</h2>
            </div>
            
            {previousOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-bold">سفارش #{order.id}</h3>
                    <p className="text-gray-600">تاریخ: {order.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-medium">{order.status}</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{formatPrice(order.total)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">محصولات سفارش:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">تعداد: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-blue-600">{formatPrice(item.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'interests' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-6 h-6" />
              <h2 className="text-2xl font-bold">علاقه‌مندی‌ها</h2>
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
          </div>
        )}
      </div>
    </div>
  );
}