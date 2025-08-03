import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderRow = ({ order, expandedOrders, onToggleExpansion, isSearchMode }) => {
    const { websiteId } = useParams();

    // اگر در حالت سرچ هستیم، نمایش ساده محصول
    if (isSearchMode || order.isExpandedView) {
        return (
            <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-2 text-center items-center text-xs sm:text-sm">
                    <div className="col-span-2 font-medium text-gray-900">{order.orderNumber}</div>
                    <div className="col-span-2 text-gray-600">{order.date}</div>
                    <div className="col-span-2 font-medium text-gray-900">{order.product}</div>
                    <div className="col-span-2 text-gray-600">{order.amount}</div>
                    <div className="col-span-3 text-gray-800">{order.customer}</div>
                    <div className="col-span-1"></div>
                </div>
            </div>
        );
    }

    // نمایش عادی سفارش
    const isExpanded = expandedOrders?.has(order.id);

    return (
        <div className="transition-colors">
            <div className="px-6 py-4">
                <div className="grid grid-cols-12 gap-2 text-center items-center text-xs sm:text-sm">
                    <div className="col-span-2 font-medium text-gray-900">{order.orderNumber}</div>
                    <div className="col-span-2 text-gray-600">{order.date}</div>
                    <div className="col-span-2 font-medium text-gray-900">{order.totalAmount}</div>
                    <div className="col-span-2 text-gray-600">{order.products?.length || 0} محصول</div>
                    <div className="col-span-3 text-gray-800">{order.customer}</div>
                    <div className="col-span-1">
                        <button
                            onClick={() => onToggleExpansion(order.id)}
                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-blue-50 text-gray-800 hover:bg-blue-100 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-blue-200"
                        >
                            <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="hidden sm:inline">{isExpanded ? 'بستن' : 'مشاهده'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* نمایش محصولات expanded */}
            {isExpanded && order.products && (
                <div className="mx-4 sm:mx-6 mb-4 bg-gradient-to-r rounded-xl border shadow-sm">
                    <div className="p-3 sm:p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#EABF9F] rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h4 className="text-base sm:text-lg font-medium text-gray-800 font-modam">محصولات سفارش {order.orderNumber}</h4>
                        </div>

                        <div className="grid gap-3">
                            {order.products.map((product, index) => (
                                <div key={index} className="group font-modam">
                                    <Link
                                        to={`/detailProduct/${websiteId}/${product.item_id}`}
                                        className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#EABF9F] to-[#EABF9F] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-gray-900 font-bold text-xs sm:text-sm">{index + 1}</span>
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-900 transition-colors text-sm sm:text-base">{product.name}</h5>
                                                <p className="text-xs sm:text-sm text-gray-500">محصول شماره {index + 1}</p>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <span className="text-sm sm:text-base font-bold text-gray-900">{product.amount}</span>
                                            <span className="text-xs sm:text-sm text-gray-500 mr-1">تومان</span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-400 font-modam">
                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">مجموع کل:</span>
                                <span className="text-base sm:text-lg font-medium text-gray-900">{order.totalAmount} تومان</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderRow;