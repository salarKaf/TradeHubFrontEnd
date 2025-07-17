import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';
import OrdersHeader from './OrdersHeader';
import OrdersTable from './OrdersTable';
import OrdersToolbar from './OrdersToolbar';

const OrderContent = () => {
    const [isOpenTable, setIsOpenTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    // نمونه داده‌های سفارشات - حالا هر سفارش می‌تونه چندین محصول داشته باشه
    const [orders, setOrders] = useState([
        {
            id: 1,
            orderNumber: 'ORD-2024-001',
            date: '1403/03/15',
            products: [
                { name: 'لپ تاپ ایسوس', amount: '3,000,000' },
                { name: 'ماوس بی‌سیم', amount: '120,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '3,120,000',
            dateAdded: new Date('2024-06-05')
        },
        {
            id: 2,
            orderNumber: 'ORD-2024-002',
            date: '1403/03/14',
            products: [
                { name: 'گوشی سامسونگ', amount: '2,500,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '2,500,000',
            dateAdded: new Date('2024-06-04')
        },
        {
            id: 3,
            orderNumber: 'ORD-2024-003',
            date: '1403/03/13',
            products: [
                { name: 'هدفون بلوتوث', amount: '450,000' },
                { name: 'کیس محافظ', amount: '80,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '530,000',
            dateAdded: new Date('2024-06-03')
        },
        {
            id: 4,
            orderNumber: 'ORD-2024-004',
            date: '1403/03/12',
            products: [
                { name: 'ماوس بی‌سیم', amount: '120,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '120,000',
            dateAdded: new Date('2024-06-02')
        },
        {
            id: 5,
            orderNumber: 'ORD-2024-005',
            date: '1403/03/11',
            products: [
                { name: 'کیبورد گیمینگ', amount: '890,000' },
                { name: 'پد ماوس', amount: '45,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '935,000',
            dateAdded: new Date('2024-06-01')
        },
        {
            id: 6,
            orderNumber: 'ORD-2024-006',
            date: '1403/03/10',
            products: [
                { name: 'تبلت اپل', amount: '4,500,000' },
                { name: 'قلم لمسی', amount: '250,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '4,750,000',
            dateAdded: new Date('2024-05-31')
        },
        {
            id: 7,
            orderNumber: 'ORD-2024-007',
            date: '1403/03/09',
            products: [
                { name: 'ساعت هوشمند', amount: '1,200,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '1,200,000',
            dateAdded: new Date('2024-05-30')
        },
        {
            id: 8,
            orderNumber: 'ORD-2024-008',
            date: '1403/03/08',
            products: [
                { name: 'دوربین دیجیتال', amount: '2,800,000' },
                { name: 'کارت حافظه', amount: '150,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '2,950,000',
            dateAdded: new Date('2024-05-29')
        },
        {
            id: 9,
            orderNumber: 'ORD-2024-009',
            date: '1403/03/07',
            products: [
                { name: 'اسپیکر بلوتوث', amount: '650,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '650,000',
            dateAdded: new Date('2024-05-28')
        },
        {
            id: 10,
            orderNumber: 'ORD-2024-010',
            date: '1403/03/06',
            products: [
                { name: 'پاور بانک', amount: '300,000' },
                { name: 'کابل شارژ', amount: '35,000' }
            ],
            customer: 'customer@gmail.com',
            totalAmount: '335,000',
            dateAdded: new Date('2024-05-27')
        }
    ]);

    const itemsPerPage = 5;

    // فیلتر و مرتب‌سازی سفارشات
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = orders;

        // اگر سرچ شده، سفارشات رو به محصولات فردی تبدیل کن
        if (searchTerm) {
            const expandedResults = [];
            orders.forEach(order => {
                order.products.forEach(product => {
                    if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        expandedResults.push({
                            id: `${order.id}-${product.name}`,
                            orderNumber: order.orderNumber,
                            date: order.date,
                            product: product.name,
                            amount: product.amount,
                            customer: order.customer,
                            dateAdded: order.dateAdded,
                            isExpandedView: true
                        });
                    }
                });
            });
            filtered = expandedResults;
        }

        // مرتب‌سازی
        if (sortBy === 'bestselling') {
            filtered = filtered.sort((a, b) => {
                const amountA = parseInt((a.totalAmount || a.amount).replace(/,/g, ''));
                const amountB = parseInt((b.totalAmount || b.amount).replace(/,/g, ''));
                return amountB - amountA;
            });
        } else if (sortBy === 'newest') {
            filtered = filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        }

        return filtered;
    }, [orders, searchTerm, sortBy]);

    // محاسبه صفحه‌بندی
    const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);

    // تنظیم صفحه فعلی هنگام تغییر فیلتر
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    // عملکردها
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (sortType) => {
        setSortBy(sortType);
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    // فانکشن‌های صفحه‌بندی
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <>
            <div className="min-h-screen rtl" dir="rtl">
                <OrdersHeader
                    isOpenTable={isOpenTable}
                    setIsOpenTable={setIsOpenTable}
                    title="فاکتور سفارشات "
                    logo="/public/SellerPanel/Orders/icons8-purchase-order-52 2.png"
                />

                <OrdersToolbar
                    isOpenTable={isOpenTable}
                    sortBy={sortBy}
                    handleSort={handleSort}
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    totalItems={filteredAndSortedOrders.length}
                />

                {isOpenTable && (
                    <div className="p-6">
                        <OrdersTable
                            orders={currentOrders}
                            expandedOrders={expandedOrders}
                            onToggleExpansion={toggleOrderExpansion}
                            isSearchMode={!!searchTerm}
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
                )}
            </div>
        </>
    );
};

export default OrderContent;