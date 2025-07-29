import React from 'react';
import { ShoppingCart, Ticket, Package, Heart } from 'lucide-react';

const NavigationMenu = ({ activePlan, scrollToSection }) => {
  return (
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
  );
};

export default NavigationMenu;