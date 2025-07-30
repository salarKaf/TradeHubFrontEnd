import React, { useState, useMemo, useEffect } from 'react';
import Pagination from './Pagination';
import OrdersHeader from './OrdersHeader';
import OrdersTable from './OrdersTable';
import OrdersToolbar from './OrdersToolbar';
import { useParams } from 'react-router-dom';
import { getOrdersByWebsite } from '../../../API/orders'; // مسیر صحیح
const OrderContent = () => {
    const [isOpenTable, setIsOpenTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [expandedOrders, setExpandedOrders] = useState(new Set());



    // در داخل OrderContent:
    const [orders, setOrders] = useState([]);
    const { websiteId } = useParams();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await getOrdersByWebsite(websiteId, token);

                const paidOrders = data.filter(order => order.status !== 'Canceled');

                const mapped = paidOrders.map((order) => ({
                    id: order.order_id,
                    orderNumber: `ORD-${order.created_at.slice(0, 10)}`,
                    date: new Date(order.created_at).toLocaleDateString('fa-IR'),
                    products: order.order_items.map(item => ({
                        name: item.item_name,
                        amount: parseInt(item.price).toLocaleString('fa-IR'),
                        item_id: item.item_id, // 👈 حتماً این رو اضافه کن

                    })),
                    customer: order.buyer_id,
                    totalAmount: parseInt(order.total_price).toLocaleString('fa-IR'),
                    dateAdded: new Date(order.created_at),
                }));

                setOrders(mapped);
            } catch (err) {
                console.error('خطا در دریافت سفارش‌ها:', err);
            }
        };

        if (websiteId) fetchOrders();
    }, [websiteId]);



    const itemsPerPage = 5;

    // فیلتر و مرتب‌سازی سفارشات
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = orders;

        // اگر سرچ شده، سفارشات رو به محصولات فردی تبدیل کن
        if (searchTerm) {
            const expandedResults = []
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