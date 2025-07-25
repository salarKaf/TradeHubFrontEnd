import React, { useState } from 'react';
import { ShoppingCart, Trash2, Heart, Eye, Package, ChevronDown } from 'lucide-react';

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

export default function Card() {
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

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
              
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                ادامه فرایند خرید
              </button>
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
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 flex items-center justify-center transition-all duration-300 font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                            <span className="font-bold text-gray-800">{item.name}</span>
                          </div>
                          <div className="flex justify-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
                              <Package className="w-8 h-8 text-gray-500" />
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
