import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';
import CustomersHeader from './CustomersHeader';
import CustomersTable from './CustomersTable';
import CustomersToolbar from './CustomersToolbar';
import { useEffect } from 'react';
import { fetchCustomerSummary } from '../../../API/customers'; // مسیر درست
import { useParams } from 'react-router-dom';

const CustomersContent = () => {
    const [isOpenTable, setIsOpenTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const [Customers, setCustomers] = useState([]);
    const { slug } = useParams(); // یا از props هم می‌تونه بیاد

    useEffect(() => {
        const fetchData = async () => {
            try {
                const websiteId = localStorage.getItem('website_id') || slug;
                const token = localStorage.getItem('token');

                if (!websiteId || !token) {
                    console.warn('Website ID یا توکن یافت نشد.');
                    return;
                }

                const buyers = await fetchCustomerSummary(websiteId, token);

                const mapped = buyers.map((item, index) => ({
                    id: index + 1,
                    email: item.buyer_email,
                    totalPurchases: item.total_amount,
                    orderCount: item.total_orders,
                }));

                setCustomers(mapped);
            } catch (err) {
                console.error('خطا در دریافت لیست مشتریان:', err);
            }
        };

        fetchData();
    }, []);

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
            (customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                    logo="/SellerPanel/Customers/icons8-detail-64 1.png"
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
                    <div className="p-3 sm:p-6">
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