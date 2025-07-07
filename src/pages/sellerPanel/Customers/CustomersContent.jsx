import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';
import CustomersHeader from './CustomersHeader';
import CustomersTable from './CustomersTable';
import CustomersToolbar from './CustomersToolbar';

const CustomersContent = () => {
    const [isOpenTable, setIsOpenTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // داده‌های مشتریان
    const [Customers, setCustomers] = useState([
        {
            id: 1,
            name: 'علی احمدی',
            email: 'ali.ahmadi@example.com',
            phone: '09123456789',
            totalPurchases: 12450000,
            orderCount: 23,
            itemsCount: 67,
            monthlyPurchase: 2100000,
            isLoyalCustomer: true,
            joinDate: '1402/03/15',
            dateAdded: '2024-06-15' // تاریخ عضویت برای مرتب‌سازی
        },
        {
            id: 2,
            name: 'فاطمه رضایی',
            email: 'fateme.rezaei@example.com',
            phone: '09987654321',
            totalPurchases: 8750000,
            orderCount: 15,
            itemsCount: 42,
            monthlyPurchase: 1500000,
            isLoyalCustomer: true,
            joinDate: '1402/05/22',
            dateAdded: '2024-08-22'
        },
        {
            id: 3,
            name: 'محمد حسینی',
            email: 'mohammad.hosseini@example.com',
            phone: '09112233445',
            totalPurchases: 3200000,
            orderCount: 8,
            itemsCount: 18,
            monthlyPurchase: 650000,
            isLoyalCustomer: false,
            joinDate: '1403/02/10',
            dateAdded: '2024-05-10'
        },
        {
            id: 4,
            name: 'زهرا کریمی',
            email: 'zahra.karimi@example.com',
            phone: '09334455667',
            totalPurchases: 15800000,
            orderCount: 31,
            itemsCount: 89,
            monthlyPurchase: 2800000,
            isLoyalCustomer: true,
            joinDate: '1401/12/05',
            dateAdded: '2024-03-05'
        },
        {
            id: 5,
            name: 'امیر نوری',
            email: 'amir.nouri@example.com',
            phone: '09556677889',
            totalPurchases: 5400000,
            orderCount: 12,
            itemsCount: 28,
            monthlyPurchase: 900000,
            isLoyalCustomer: false,
            joinDate: '1403/01/18',
            dateAdded: '2024-04-18'
        },
        {
            id: 6,
            name: 'مریم اکبری',
            email: 'maryam.akbari@example.com',
            phone: '09111222333',
            totalPurchases: 22300000,
            orderCount: 45,
            itemsCount: 120,
            monthlyPurchase: 3500000,
            isLoyalCustomer: true,
            joinDate: '1401/08/12',
            dateAdded: '2024-11-12'
        },
        {
            id: 7,
            name: 'حسن محمدی',
            email: 'hasan.mohammadi@example.com',
            phone: '09333444555',
            totalPurchases: 1800000,
            orderCount: 6,
            itemsCount: 12,
            monthlyPurchase: 400000,
            isLoyalCustomer: false,
            joinDate: '1403/03/25',
            dateAdded: '2024-12-25'
        }
    ]);

    // سفارشات برای هر مشتری
    const getOrdersForCustomer = (customerId) => {
        const allOrders = {
            1: [
                {
                    orderNumber: 'ORD-2025-001',
                    date: '1403/12/18',
                    products: [
                        { name: 'گوشی سامسونگ A54', price: 8500000, quantity: 1 },
                        { name: 'کاور محافظ', price: 150000, quantity: 2 }
                    ],
                    totalAmount: 8800000,
                    status: 'تحویل شده'
                },
                {
                    orderNumber: 'ORD-2025-002',
                    date: '1403/12/10',
                    products: [
                        { name: 'هدفون بلوتوثی', price: 450000, quantity: 1 },
                        { name: 'پاوربانک', price: 320000, quantity: 1 }
                    ],
                    totalAmount: 770000,
                    status: 'در حال ارسال'
                }
            ],
            2: [
                {
                    orderNumber: 'ORD-2025-101',
                    date: '1403/12/15',
                    products: [
                        { name: 'لپ تاپ ایسوس', price: 15000000, quantity: 1 },
                        { name: 'ماوس بی‌سیم', price: 250000, quantity: 1 }
                    ],
                    totalAmount: 15250000,
                    status: 'تحویل شده'
                }
            ],
            // سایر سفارشات...
        };
        return allOrders[customerId] || [];
    };

    const itemsPerPage = 5;

    // فیلتر و مرتب‌سازی مشتریان
    const filteredAndSortedCustomers = useMemo(() => {
        let filtered = Customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm)
        );

        // مرتب‌سازی
        if (sortBy === 'highest_purchase') {
            // مرتب‌سازی بر اساس بیشترین مبلغ خرید (بالاترین اول)
            filtered = filtered.sort((a, b) => b.totalPurchases - a.totalPurchases);
        } else if (sortBy === 'newest') {
            // مرتب‌سازی بر اساس جدیدترین عضویت
            filtered = filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        } else if (sortBy === 'most_orders') {
            // مرتب‌سازی بر اساس بیشترین سفارش
            filtered = filtered.sort((a, b) => b.orderCount - a.orderCount);
        } else if (sortBy === 'alphabetical') {
            // مرتب‌سازی الفبایی بر اساس نام
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        }

        return filtered;
    }, [Customers, searchTerm, sortBy]);

    // محاسبه صفحه‌بندی
    const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCustomers = filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage);

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
                <CustomersHeader
                    isOpenTable={isOpenTable}
                    setIsOpenTable={setIsOpenTable}
                    title="جزئیات "
                    logo="/public/SellerPanel/Customers/icons8-detail-64 1.png"
                />

                <CustomersToolbar
                    isOpenTable={isOpenTable}
                    sortBy={sortBy}
                    handleSort={handleSort}
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    totalItems={filteredAndSortedCustomers.length}
                />

                {isOpenTable && (
                    <div className="p-6">
                        <CustomersTable
                            Customers={currentCustomers}
                            getOrdersForCustomer={getOrdersForCustomer}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={goToPage}
                            onPreviousPage={goToPreviousPage}
                            onNextPage={goToNextPage}
                            startIndex={startIndex}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredAndSortedCustomers.length}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default CustomersContent;