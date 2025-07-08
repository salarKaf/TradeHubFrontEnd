import { useParams, useLocation } from 'react-router-dom';
import OrdersToolbar from '../../Orders/OrdersToolbar';
import OrdersTableForCustomer from './OrdersTableForCustomer';
import Pagination from '../../Orders/Pagination';
import { useState, useMemo, useEffect } from 'react';

const CustomerDetails = () => {
    const { customerId } = useParams();
    const location = useLocation();

    const customer = location.state?.customer;
    const allOrders = location.state?.orders || [];

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const itemsPerPage = 5;

    const customerOrders = useMemo(() => {
        return allOrders.filter(order =>
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allOrders, searchTerm]);

    const filteredAndSortedOrders = useMemo(() => {
        let filtered = [...customerOrders];

        if (sortBy === 'bestselling') {
            filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        } else if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'complete') {
            filtered.sort((a, b) => {
                if (a.status === b.status) {
                    return new Date(b.date) - new Date(a.date);
                }
                return a.status === 'تکمیل شده' ? -1 : 1;
            });
        }

        return filtered;
    }, [customerOrders, sortBy]);

    const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleSort = (sortType) => setSortBy(sortType);
    const goToPage = (page) => setCurrentPage(page);
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    return (
        <div className="min-h-screen w-[1000px] rtl" dir="rtl">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">سفارشات مشتری: {customer?.name}</h1>

                {customer && (
                    <div className=" p-6  flex flex-col gap-6 relative">

                        {/* بخش آمار خرید */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* کارت مبلغ خرید کل */}
                            <div className=" border-2 border-[#1e212d51]  p-8 rounded-xl shadow-sm flex items-center">
                                <div className="flex-1 ">
                                    <div className="text-[#1E212D] opacity-80 text-base font-modam mb-2">مبلغ خرید کل</div>
                                    <div className="text-xl font-medium font-modam text-[#1E212D]">
                                        {new Intl.NumberFormat('fa-IR').format(customer.totalPurchases)} ریال
                                    </div>
                                </div>
                                <div className="mr-4">
                                    <img src="/public/SellerPanel/Customers/Frame 64(1).png" alt="مبلغ خرید کل" className="w-12 h-12" />
                                </div>
                            </div>

                            {/* کارت تعداد دفعات خرید */}
                            <div className="border-2 border-[#1e212d51] p-8 rounded-xl flex items-center">
                                <div className="flex-1">
                                    <div className="text-[#1E212D] opacity-80 text-base font-modam mb-2">تعداد دفعات خرید</div>
                                    <div className="text-xl font-medium font-modam text-[#1E212D]">
                                        {customer.orderCount}
                                    </div>
                                </div>
                                <div className="mr-4">
                                    <img src="/public/SellerPanel/Customers/Group 153(1).png" alt="تعداد دفعات خرید" className="w-12 h-12" />
                                </div>
                            </div>

                            {/* کارت میانگین خرید ماهانه */}
                            {/* کارت میانگین خرید ماهانه */}
                            <div className="border-2 border-[#1e212d51] p-8 rounded-xl shadow-sm flex items-center">
                                <div className="flex-1 space-y-2">

                                    <div className="flex justify-between items-center">
                                        <div className="text-[#1E212D] opacity-80 text-base font-modam">میانگین خرید ماهانه</div>
                                        <div className="text-xl font-medium font-modam text-[#1E212D] whitespace-nowrap">
                                            {new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(customer.monthlyOrderCount)}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-[#1E212D] opacity-80 text-base font-modam">به مبلغ</div>
                                        <div className="text-xl font font-modam text-[#1E212D] whitespace-nowrap">
                                            {new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(customer.monthlyPurchase)} ریال
                                        </div>
                                    </div>

                                </div>
                                <div className="mr-4">
                                    <img src="/public/SellerPanel/Customers/Frame 64(2).png" alt="میانگین خرید ماهانه" className="w-12 h-12" />
                                </div>
                            </div>


                        </div>

                        {/* اطلاعات تماس مشتری */}
                        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow text-sm">
                            <div>
                                <div className="text-gray-600">ایمیل مشتری</div>
                                <div className="font-medium">{customer.email}</div>
                            </div>
                            <div>
                                <div className="text-gray-600">تاریخ عضویت</div>
                                <div className="font-medium">{customer.joinDate}</div>
                            </div>
                        </div>

                        {/* بخش تخفیف مشتری
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">آیا میخواهید برای این مشتری تخفیفی قائل شوید؟</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-2">
                                        درصد تخفیفی که میخواهید اعمال شود را وارد کنید
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                )}

                <OrdersToolbar
                    isOpenTable={true}
                    sortBy={sortBy}
                    handleSort={handleSort}
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    totalItems={filteredAndSortedOrders.length}
                />

                <OrdersTableForCustomer
                    orders={currentOrders}
                    hideCustomerColumn={true}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    onPreviousPage={goToPreviousPage}
                    onNextPage={goToNextPage}
                    startIndex={startIndex}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredAndSortedOrders.length}
                />
            </div>
        </div>
    );
};

export default CustomerDetails;