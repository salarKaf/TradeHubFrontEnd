import React from 'react';
import { Package } from 'lucide-react';

const PreviousOrdersSection = ({
  previousOrders,
  formatPrice,
  navigate,
  slug
}) => {
  return (
    <section id="previous-section" className="scroll-mt-24 font-Kahroba">
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
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">سفارش شما</h3>
                <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
                  {order.status === 'Paid' ? '✅ پرداخت شده' : '❌ لغو شده'} | تاریخ: {order.date}
                </p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-800">{formatPrice(order.total)}</p>
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
                            navigate(`/${slug}/product/${item.itemId}`);
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
  );
};

export default PreviousOrdersSection;