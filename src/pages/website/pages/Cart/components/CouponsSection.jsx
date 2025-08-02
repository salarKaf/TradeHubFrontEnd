import React from 'react';
import { Ticket, Calendar, Percent } from 'lucide-react';

const CouponsSection = ({
  loadingCoupons,
  availableCoupons,
  copiedCode,
  formatPrice,
  applyCoupon
}) => {
  return (
    <section id="coupons-section" className="scroll-mt-24 font-Kahroba">
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
                  </span>
                </div>
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
                  <span>تاریخ انقضا: {new Date(coupon.expiration_date).toLocaleDateString('fa-IR')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Percent className="w-4 h-4" />
                  <span>قابل استفاده: {coupon.usage_limit - coupon.times_used} بار</span>
                </div>
              </div>

              <button
                onClick={() => applyCoupon(coupon.code)}
                className={`w-full py-3 px-4 rounded-lg transition-all duration-300 font-medium ${
                  copiedCode === coupon.code
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
  );
};

export default CouponsSection;