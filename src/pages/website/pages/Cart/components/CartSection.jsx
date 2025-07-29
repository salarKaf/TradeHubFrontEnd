import React from 'react';
import { ShoppingCart, Package, Trash2, CreditCard, Loader, CheckCircle } from 'lucide-react';

const CartSection = ({
  cartItems,
  isProcessingPayment,
  isCreatingOrder,
  currentOrderId,
  couponCode,
  setCouponCode,
  appliedCoupon,
  couponDiscount,
  calculateOriginalTotal,
  calculateProductDiscount,
  calculateTotal,
  calculateFinalTotal,
  getTotalItems,
  formatPrice,
  handleCreateOrder,
  handleCheckout,
  handleCouponSubmit,
  removeItem,
  updateQuantity
}) => {
  return (
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
            {/* قیمت اصلی محصولات */}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">قیمت اصلی محصولات</span>
              <span className="font-bold text-gray-800">{formatPrice(calculateOriginalTotal())}</span>
            </div>

            {/* تخفیف محصولات */}
            {calculateProductDiscount() > 0 && (
              <div className="flex justify-between items-center py-2 text-green-600">
                <span>تخفیف محصولات</span>
                <span className="font-bold">-{formatPrice(calculateProductDiscount())}</span>
              </div>
            )}

            {/* قیمت نهایی محصولات */}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">قیمت محصولات</span>
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

            {/* تخفیف کوپن */}
            {appliedCoupon && (
              <div className="flex justify-between items-center py-2 text-green-600">
                <span>تخفیف کوپن ({appliedCoupon})</span>
                <span className="font-bold">-{formatPrice(couponDiscount)}</span>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-gray-800">مبلغ قابل پرداخت</span>
                <span className="text-gray-800">{formatPrice(calculateFinalTotal())}</span>
              </div>
              {/* نمایش کل صرفه‌جویی */}
              {(calculateProductDiscount() + couponDiscount) > 0 && (
                <div className="text-center mt-2 text-green-600 text-sm">
                  کل صرفه‌جویی شما: {formatPrice(calculateProductDiscount() + couponDiscount)}
                </div>
              )}
            </div>

            {/* مرحله 1: ایجاد سفارش */}
            {!currentOrderId ? (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || cartItems.length === 0}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    isCreatingOrder || cartItems.length === 0
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      در حال ایجاد سفارش...
                    </>
                  ) : (
                    <>
                      <Package className="w-6 h-6" />
                      ایجاد سفارش
                    </>
                  )}
                </button>

                {cartItems.length === 0 && (
                  <p className="text-sm text-gray-500 text-center mt-3">
                    سبد خرید شما خالی است
                  </p>
                )}
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-4">
                {/* نمایش موفقیت ایجاد سفارش */}
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 text-sm font-medium">
                    سفارش با موفقیت ایجاد شد
                  </span>
                </div>

                {/* مرحله 2: اعمال کد تخفیف (اختیاری) */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-medium">کد تخفیف دارید؟</p>
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
                      disabled={!couponCode.trim()}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                        !couponCode.trim()
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      اعمال کد تخفیف
                    </button>
                  </div>
                </div>

                {/* مرحله 3: پرداخت نهایی */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessingPayment}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    isProcessingPayment
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      در حال اتصال به درگاه...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" />
                      پرداخت نهایی
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
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
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 p-6 bg-gray-100 border-b border-gray-200 font-bold text-gray-700">
                  <div className="text-center">محصول</div>
                  <div className="text-center">نام محصول</div>
                  <div className="text-center">قیمت واحد</div>
                  <div className="text-center">تعداد</div>
                  <div className="text-center">قیمت کل</div>
                  <div className="text-center">حذف</div>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item, index) => (
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
                        {item.hasDiscount ? (
                          <div className="space-y-1">
                            <div className="line-through text-gray-400 text-sm">
                              {formatPrice(item.originalPrice)}
                            </div>
                            <div className="font-bold text-red-600">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold text-gray-700">{formatPrice(item.price)}</span>
                        )}
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
                        <span className="font-bold text-xl text-gray-800">
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </span>
                        {item.hasDiscount && (
                          <div className="text-xs text-green-600 mt-1">
                            صرفه‌جویی: {formatPrice((item.originalPrice - item.price) * item.quantity)}
                          </div>
                        )}
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
  );
};

export default CartSection;