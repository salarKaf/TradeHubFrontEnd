import React, { useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "نام", price: "قیمت", quantity: 1 },
    { id: 2, name: "نام", price: "قیمت", quantity: 1 },
    { id: 3, name: "نام", price: "قیمت", quantity: 1 }
  ]);
  
  const [couponCode, setCouponCode] = useState('');
  const [activeTab, setActiveTab] = useState('cart');

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCouponSubmit = () => {
    // Handle coupon logic here
    console.log('Coupon applied:', couponCode);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Top Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center space-x-reverse space-x-8">
            <button 
              onClick={() => setActiveTab('cart')}
              className={`px-8 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'cart' 
                  ? 'border-black text-black bg-black text-white rounded-full' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              سبد خرید
            </button>
            <button 
              onClick={() => setActiveTab('previous')}
              className={`px-8 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'previous' 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              خرید های پیشین
            </button>
            <button 
              onClick={() => setActiveTab('interests')}
              className={`px-8 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'interests' 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              علاقمندی ها
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Summary Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="text-lg font-medium">حساب خرید شما</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">قیمت</span>
                <span className="font-medium">قیمت کل</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">تعداد</span>
                <span className="font-medium">تعداد آیتم ها</span>
              </div>
              
              <div className="pt-4 border-t text-sm text-gray-500">
                افزودن کد تخفیف
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="کد خود را وارد کنید"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button 
                  onClick={handleCouponSubmit}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors text-sm"
                >
                  تایید
                </button>
              </div>
            </div>
            
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium">
              پرداخت و خرید نهایی
            </button>
          </div>

          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700">
                <div className="text-center">حذف</div>
                <div className="text-center">قیمت محصول</div>
                <div className="text-center">نام محصول</div>
                <div className="text-center">محصول</div>
                <div></div>
              </div>
              
              {/* Cart Items */}
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-gray-50">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center">
                      <span className="font-medium">قیمت</span>
                    </div>
                    <div className="text-center">
                      <span className="font-medium">نام</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    </div>
                    <div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}