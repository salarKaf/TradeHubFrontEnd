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


    // نمونه داده‌های سفارشات
    const [orders, setOrders] = useState([
        {
            id: 1,
            orderNumber: 'ORD-2024-001',
            date: '1403/03/15', // تاریخ سفارش (شمسی)
            product: 'لپ تاپ ایسوس',
            amount: '3,000,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-06-05') // تاریخ اضافه شدن به سیستم (میلادی)
        },
        {
            id: 2,
            orderNumber: 'ORD-2024-002',
            date: '1403/03/14',
            product: 'گوشی سامسونگ',
            amount: '2,500,000',
            customer: 'customer@gmail.com',
            status: 'لغو شده',
            dateAdded: new Date('2024-06-04')
        },
        {
            id: 3,
            orderNumber: 'ORD-2024-003',
            date: '1403/03/13',
            product: 'هدفون بلوتوث',
            amount: '450,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-06-03')
        },
        {
            id: 4,
            orderNumber: 'ORD-2024-004',
            date: '1403/03/12',
            product: 'ماوس بی‌سیم',
            amount: '120,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-06-02')
        },
        {
            id: 5,
            orderNumber: 'ORD-2024-005',
            date: '1403/03/11',
            product: 'کیبورد گیمینگ',
            amount: '890,000',
            customer: 'customer@gmail.com',
            status: 'لغو شده',
            dateAdded: new Date('2024-06-01')
        },
        {
            id: 6,
            orderNumber: 'ORD-2024-006',
            date: '1403/03/10',
            product: 'تبلت اپل',
            amount: '4,500,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-05-31')
        },
        {
            id: 7,
            orderNumber: 'ORD-2024-007',
            date: '1403/03/09',
            product: 'ساعت هوشمند',
            amount: '1,200,000',
            customer: 'customer@gmail.com',
            status: 'لغو شده',
            dateAdded: new Date('2024-05-30')
        },
        {
            id: 8,
            orderNumber: 'ORD-2024-008',
            date: '1403/03/08',
            product: 'دوربین دیجیتال',
            amount: '2,800,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-05-29')
        },
        {
            id: 9,
            orderNumber: 'ORD-2024-009',
            date: '1403/03/07',
            product: 'اسپیکر بلوتوث',
            amount: '650,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-05-28')
        },
        {
            id: 10,
            orderNumber: 'ORD-2024-010',
            date: '1403/03/06',
            product: 'پاور بانک',
            amount: '300,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-05-27')
        },
        {
            id: 11,
            orderNumber: 'ORD-2024-011',
            date: '1403/03/05',
            product: 'چراغ مطالعه LED',
            amount: '180,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-05-26')
        },
        {
            id: 12,
            orderNumber: 'ORD-2024-012',
            date: '1403/03/04',
            product: 'کارت حافظه',
            amount: '85,000',
            customer: 'customer@gmail.com',
            status: 'لغو شده',
            dateAdded: new Date('2024-05-25')
        },
        {
            id: 13,
            orderNumber: 'ORD-2024-013',
            date: '1403/03/03',
            product: 'لپ تاپ ایسوس',
            amount: '3,000,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-05-24')
        },
        {
            id: 14,
            orderNumber: 'ORD-2024-014',
            date: '1403/03/02',
            product: 'هدفون بلوتوث',
            amount: '450,000',
            customer: 'customer@gmail.com',
            status: 'لغو شده',
            dateAdded: new Date('2024-05-23')
        },
        {
            id: 15,
            orderNumber: 'ORD-2024-015',
            date: '1403/03/01',
            product: 'گوشی سامسونگ',
            amount: '2,500,000',
            customer: 'customer@gmail.com',
            status: 'تکمیل شده',
            dateAdded: new Date('2024-05-22')
        }
    ]);


    const itemsPerPage = 5;

    // فیلتر و مرتب‌سازی محصولات
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = orders.filter(order =>
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // مرتب‌سازی
        if (sortBy === 'bestselling') {
            // مرتب‌سازی بر اساس مبلغ (بالاترین اول)
            filtered = filtered.sort((a, b) => {
                const amountA = parseInt(a.amount.replace(/,/g, ''));
                const amountB = parseInt(b.amount.replace(/,/g, ''));
                return amountB - amountA;
            });
        } else if (sortBy === 'newest') {
            // مرتب‌سازی بر اساس جدیدترین (بر اساس dateAdded)
            filtered = filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        } else if (sortBy === 'complete') {
            // مرتب‌سازی بر اساس وضعیت: ابتدا تکمیل شده‌ها، سپس لغو شده‌ها
            filtered = filtered.sort((a, b) => {
                // اگر هر دو تکمیل شده یا هر دو لغو شده باشند، بر اساس تاریخ مرتب می‌کنیم
                if (a.status === b.status) {
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                }
                // تکمیل شده‌ها اول، لغو شده‌ها بعد
                if (a.status === 'تکمیل شده' && b.status === 'لغو شده') {
                    return -1;
                }
                if (a.status === 'لغو شده' && b.status === 'تکمیل شده') {
                    return 1;
                }
                return 0;
            });
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