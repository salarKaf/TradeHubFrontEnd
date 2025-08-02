import React from 'react';
import { ShoppingCart, Ticket, Package, Heart } from 'lucide-react';

const NavigationMenu = ({ activePlan, scrollToSection }) => {
  return (
    <div className="bg-white shadow-lg md:sticky md:top-0 z-50 border-b border-gray-200 font-Kahroba font-semibold ">
      <div className="max-w-6xl mx-auto px-3 py-4 md:px-4 md:py-5">
        {/* Mobile Layout - Vertical Stack */}
        <div className="md:hidden flex flex-col gap-3">
          <button
            onClick={() => scrollToSection('cart-section')}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl text-base font-medium hover:from-gray-700 hover:to-gray-800 active:scale-98 transition-all duration-200 shadow-md"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>سبد خرید</span>
          </button>

          {activePlan?.is_active && activePlan?.plan?.name === 'Pro' && (
            <button
              onClick={() => scrollToSection('coupons-section')}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl text-base font-medium hover:from-slate-600 hover:to-slate-700 active:scale-98 transition-all duration-200 shadow-md"
            >
              <Ticket className="w-5 h-5" />
              <span>کوپن‌های تخفیف</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => scrollToSection('previous-section')}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl text-sm font-medium hover:from-slate-500 hover:to-slate-600 active:scale-98 transition-all duration-200 shadow-md"
            >
              <Package className="w-4 h-4" />
              <span className="truncate">خریدهای پیشین</span>
            </button>

            <button
              onClick={() => scrollToSection('interests-section')}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl text-sm font-medium hover:from-gray-500 hover:to-gray-600 active:scale-98 transition-all duration-200 shadow-md"
            >
              <Heart className="w-4 h-4" />
              <span className="truncate">علاقمندی‌ها</span>
            </button>
          </div>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden md:flex justify-center items-center gap-6 lg:gap-8">
          <button
            onClick={() => scrollToSection('cart-section')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl text-lg font-semibold hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>سبد خرید</span>
          </button>

          {activePlan?.is_active && activePlan?.plan?.name === 'Pro' && (
            <button
              onClick={() => scrollToSection('coupons-section')}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl text-lg font-semibold hover:from-slate-600 hover:to-slate-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
            >
              <Ticket className="w-6 h-6" />
              <span>کوپن‌های تخفیف</span>
            </button>
          )}

          <button
            onClick={() => scrollToSection('previous-section')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl text-lg font-semibold hover:from-slate-500 hover:to-slate-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
            <Package className="w-6 h-6" />
            <span>خریدهای پیشین</span>
          </button>

          <button
            onClick={() => scrollToSection('interests-section')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl text-lg font-semibold hover:from-gray-500 hover:to-gray-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
            <Heart className="w-6 h-6" />
            <span>علاقمندی‌ها</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;