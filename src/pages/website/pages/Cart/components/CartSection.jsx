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
    <section id="cart-section" className="scroll-mt-24 font-Kahroba px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Cart Summary Card */}
        <div className="order-2 lg:order-1 bg-white rounded-xl shadow-lg p-4 md:p-6 h-fit border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-800 rounded-lg">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-lg md:text-xl text-gray-800 font-Kahroba font-semibold">جزئیات پرداخت</h2>
          </div>

          <div className="space-y-3 md:space-y-4 mb-6">
            {/* قیمت اصلی محصولات */}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm md:text-base text-gray-600">قیمت اصلی محصولات</span>
              <span className="font-bold text-sm md:text-base text-gray-800">{formatPrice(calculateOriginalTotal())}</span>
            </div>

            {/* قیمت محصولات (با یا بدون تخفیف) */}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm md:text-base text-gray-600">قیمت محصولات</span>
              <div className="text-left">
                {calculateProductDiscount() > 0 ? (
                  <div>
                    <div className="line-through text-gray-400 text-xs md:text-sm">
                      {formatPrice(calculateOriginalTotal())}
                    </div>
                    <div className="font-bold text-sm md:text-base text-gray-800">
                      {formatPrice(calculateTotal())}
                    </div>
                  </div>
                ) : (
                  <span className="font-bold text-sm md:text-base text-gray-800">{formatPrice(calculateTotal())}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm md:text-base text-gray-600">تعداد آیتم‌ها</span>
              <span className="font-bold text-sm md:text-base text-gray-800">{getTotalItems()} عدد</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm md:text-base text-gray-600">هزینه ارسال</span>
              <span className="font-bold text-sm md:text-base text-green-600">رایگان</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-lg md:text-xl font-bold">
                <span className="text-gray-800">مبلغ قابل پرداخت</span>
                <span className="text-gray-800">{formatPrice(calculateFinalTotal())}</span>
              </div>
            </div>

            {/* مرحله 1: ایجاد سفارش */}
            {!currentOrderId ? (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || cartItems.length === 0}
                  className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-lg font-bold text-base md:text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 ${
                    isCreatingOrder || cartItems.length === 0
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                      <span className="text-sm md:text-base">در حال ایجاد سفارش...</span>
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5 md:w-6 md:h-6" />
                      <span>ایجاد سفارش</span>
                    </>
                  )}
                </button>

                {cartItems.length === 0 && (
                  <p className="text-xs md:text-sm text-gray-500 text-center mt-3">
                    سبد خرید شما خالی است
                  </p>
                )}
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-4">
                {/* نمایش اعمال کد تخفیف */}
                {appliedCoupon && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    <span className="text-green-700 text-xs md:text-sm font-medium">
                      کد تخفیف اعمال شد
                    </span>
                  </div>
                )}

                {/* مرحله 2: اعمال کد تخفیف (اختیاری) */}
                <div className="space-y-3">
                  <p className="text-xs md:text-sm text-gray-600 font-medium">کد تخفیف دارید؟</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="کد تخفیف را وارد کنید"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-sm md:text-base"
                    />
                    <button
                      onClick={handleCouponSubmit}
                      disabled={!couponCode.trim()}
                      className={`w-full py-2 md:py-3 px-3 md:px-4 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
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
                  className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-lg font-bold text-base md:text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 ${
                    isProcessingPayment
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                      <span className="text-sm md:text-base">در حال اتصال به درگاه...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                      <span>پرداخت نهایی</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="order-1 lg:order-2 lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {cartItems.length === 0 ? (
              <div className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <ShoppingCart className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-600 mb-2 md:mb-3">سبد خرید خالی است</h3>
                <p className="text-sm md:text-base text-gray-500">محصولی به سبد خرید اضافه نکرده‌اید</p>
              </div>
            ) : (
              <>
                {/* Mobile Card Layout */}
                <div className="block md:hidden divide-y divide-gray-100">
                  {cartItems.map((item, index) => (
                    <div key={item.id || index} className="p-4 space-y-4">
                      <div className="flex items-start gap-4">
                        {/* تصویر محصول */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-500" />
                          )}
                        </div>

                        {/* اطلاعات محصول */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 text-sm truncate">
                            {item.name || `محصول ${item.itemId.substring(0, 8)}`}
                          </h4>
                          
                          {/* قیمت */}
                          <div className="mt-1">
                            {item.hasDiscount ? (
                              <div>
                                <div className="line-through text-gray-400 text-xs">
                                  {formatPrice(item.originalPrice)}
                                </div>
                                <div className="font-bold text-red-600 text-sm">
                                  {formatPrice(item.price)}
                                </div>
                              </div>
                            ) : (
                              <span className="font-bold text-gray-700 text-sm">{formatPrice(item.price)}</span>
                            )}
                          </div>
                        </div>

                        {/* دکمه حذف */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* کنترل تعداد و قیمت کل */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.quantity, item.itemId, item.websiteId)}
                            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.quantity, item.itemId, item.websiteId)}
                            className="w-8 h-8 rounded-lg bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center transition-all duration-300 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-left">
                          <div className="text-xs text-gray-500">قیمت کل</div>
                          <div className="font-bold text-lg text-gray-800">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block">
                  {/* Table Header */}
                  <div className="grid grid-cols-6 gap-4 p-6 bg-gray-100 border-b border-gray-200 font-bold text-gray-700 text-sm">
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
                          <span className="font-bold text-gray-800 text-sm">
                            {item.name || `محصول ${item.itemId.substring(0, 8)}`}
                          </span>
                        </div>

                        {/* قیمت واحد */}
                        <div className="text-center">
                          {item.hasDiscount ? (
                            <div className="space-y-1">
                              <div className="line-through text-gray-400 text-xs">
                                {formatPrice(item.originalPrice)}
                              </div>
                              <div className="font-bold text-red-600 text-sm">
                                {formatPrice(item.price)}
                              </div>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-700 text-sm">{formatPrice(item.price)}</span>
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
                          <span className="font-bold text-xl text-gray-800 whitespace-nowrap">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </span>
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