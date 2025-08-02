import React from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

const PreviousOrdersSection = ({
  previousOrders,
  formatPrice,
  navigate,
  slug
}) => {
  const getStatusIcon = (status) => {
    return status === 'Paid' ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusText = (status) => {
    return status === 'Paid' ? 'پرداخت شده' : 'لغو شده';
  };

  const getStatusColor = (status) => {
    return status === 'Paid' 
      ? 'bg-green-50 text-green-700 border-green-200' 
      : 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <section id="previous-section" className="scroll-mt-24 font-Kahroba px-4 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 sm:p-3 bg-gray-800 rounded-lg">
          <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">سفارش‌های قبلی</h2>
      </div>

      {/* Orders Grid */}
      {previousOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">سفارشی یافت نشد</h3>
          <p className="text-gray-500">هنوز سفارشی ثبت نکرده‌اید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {previousOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 sm:p-6">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">سفارش #{order.id.slice(-6)}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{order.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left sm:text-right">
                  <div className="text-xs text-gray-500 mb-1">مبلغ کل</div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-2">
                  محصولات ({order.items.length} آیتم)
                </h4>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      
                      {/* Product Image */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-800 text-sm truncate">
                          {item.name}
                        </h5>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                            تعداد: {item.quantity}
                          </span>
                          <span className="font-bold text-gray-700 text-sm">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          if (order.status === 'Canceled') {
                            navigate(`/${slug}/product/${item.itemId}`);
                          } else {
                            navigate(`/${slug}/order/product/${order.id}`);
                          }
                        }}
                        className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs px-3 py-2 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Eye className="w-3 h-3" />
                        <span className="hidden sm:inline">مشاهده</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary - Mobile */}
              <div className="mt-4 pt-4 border-t border-gray-100 sm:hidden">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">تعداد کل آیتم‌ها:</span>
                  <span className="font-semibold text-gray-800">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} عدد
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PreviousOrdersSection;