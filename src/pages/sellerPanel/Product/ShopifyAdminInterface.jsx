import React, { useState, useMemo, useEffect } from 'react';
import Pagination from './Pagination';
import DeleteConfirmModal from './DeleteConfirmModal';
import ProductC from './ProductC';
import ProductsHeader from './ProductsHeader';
import ProductsTable from './ProductsTable';
import ProductsToolbar from './ProductsToolbar';
import { useParams } from 'react-router-dom';
import { getActivePlan } from '../../../API/website'; // مسیر درست جایگزین شود
import { getNewestItems } from '../../../API/Items'
import { deleteItemById } from '../../../API/Items';

const ShopifyAdminInterface = () => {
    const [isOpenTable, setIsOpenTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductC, setShowProductC] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });
    const [loadingStatus, setLoadingStatus] = useState("loading");

    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'لپ تاپ ایسوس',
            category: 'فعال',
            sales: 586,
            price: '3,000,000',
            status: 'الکترونیک',
            dateAdded: new Date('2024-01-15')
        },
        {
            id: 2,
            name: 'گوشی سامسونگ',
            category: 'غیرفعال',
            sales: 342,
            price: '2,500,000',
            status: 'موبایل',
            dateAdded: new Date('2024-02-10')
        },
        {
            id: 3,
            name: 'هدفون بلوتوث',
            category: 'فعال',
            sales: 789,
            price: '450,000',
            status: 'صوتی و تصویری',
            dateAdded: new Date('2024-03-05')
        },
        {
            id: 4,
            name: 'ماوس بی‌سیم',
            category: 'فعال',
            sales: 234,
            price: '120,000',
            status: 'کامپیوتر',
            dateAdded: new Date('2024-03-20')
        },
        {
            id: 5,
            name: 'کیبورد گیمینگ',
            category: 'فعال',
            sales: 456,
            price: '890,000',
            status: 'کامپیوتر',
            dateAdded: new Date('2024-04-01')
        },
        {
            id: 6,
            name: 'تبلت اپل',
            category: 'فعال',
            sales: 321,
            price: '4,500,000',
            status: 'الکترونیک',
            dateAdded: new Date('2024-04-15')
        },
        {
            id: 7,
            name: 'ساعت هوشمند',
            category: 'فعال',
            sales: 678,
            price: '1,200,000',
            status: 'پوشیدنی',
            dateAdded: new Date('2024-05-01')
        },
        {
            id: 8,
            name: 'دوربین دیجیتال',
            category: 'غیرفعال',
            sales: 145,
            price: '2,800,000',
            status: 'عکاسی',
            dateAdded: new Date('2024-05-10')
        },
        {
            id: 9,
            name: 'اسپیکر بلوتوث',
            category: 'فعال',
            sales: 523,
            price: '650,000',
            status: 'صوتی و تصویری',
            dateAdded: new Date('2024-05-20')
        },
        {
            id: 10,
            name: 'پاور بانک',
            category: 'فعال',
            sales: 412,
            price: '300,000',
            status: 'لوازم جانبی',
            dateAdded: new Date('2024-06-01')
        },
        {
            id: 11,
            name: 'چراغ مطالعه LED',
            category: 'فعال',
            sales: 267,
            price: '180,000',
            status: 'لوازم خانگی',
            dateAdded: new Date('2024-06-05')
        },
        {
            id: 12,
            name: 'کارت حافظه',
            category: 'فعال',
            sales: 398,
            price: '85,000',
            status: 'لوازم جانبی',
            dateAdded: new Date('2024-06-10')
        }
    ]);

    const itemsPerPage = 5;

    // فیلتر و مرتب‌سازی محصولات
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // مرتب‌سازی
        if (sortBy === 'bestselling') {
            filtered = filtered.sort((a, b) => b.sales - a.sales);
        } else if (sortBy === 'newest') {
            filtered = filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        }

        return filtered;
    }, [products, searchTerm, sortBy]);

    // محاسبه صفحه‌بندی
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

    // تنظیم صفحه فعلی هنگام تغییر فیلتر
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);
    const fetchLimitBasedOnPlan = async (websiteId) => {
        try {
            const planData = await getActivePlan(websiteId);
            const planName = planData?.name?.toLowerCase();
            return planName === 'pro' ? 500 : 100;
        } catch (error) {
            console.error("❌ Error fetching plan:", error);
            return 100; // پیش‌فرض
        }
    };


    const { websiteId } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingStatus("loading");

            try {
                const plan = await getActivePlan(websiteId);
                const limit = plan.type === 'pro' ? 500 : 100;

                const items = await getNewestItems(websiteId, limit);

                const formatted = items
                    .map(item => ({
                        id: item.item_id,
                        name: item.name,
                        price: item.price,
                        sales: item.sales_count || 0,
                        status: item.category_name || "—",
                        category: item.is_available ? "فعال" : "غیرفعال",
                        dateAdded: new Date(item.created_at)
                    }));


                setProducts(formatted);
                setLoadingStatus("success");
                console.log("✅ محصولات با موفقیت دریافت شدند");
            } catch (err) {
                console.error("❌ خطا در دریافت محصولات:", err);
                setLoadingStatus("error");
            }
        };

        fetchProducts();
    }, [websiteId]);


    // عملکردها
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (sortType) => {
        setSortBy(sortType);
    };

    const handleDeleteClick = (product) => {
        setDeleteModal({
            isOpen: true,
            productId: product.id,
            productName: product.name
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteItemById(deleteModal.productId); // حذف از سرور
            setProducts((prev) => prev.filter(p => p.id !== deleteModal.productId)); // حذف از UI
            setDeleteModal({ isOpen: false, productId: null, productName: '' });
            console.log("✅ محصول با موفقیت حذف شد");
        } catch (error) {
            console.error("❌ خطا در حذف محصول:", error);
            alert("خطا در حذف محصول. لطفاً دوباره تلاش کنید.");
        }
    };


    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, productId: null, productName: '' });
    };

    const handleBackFromProductC = () => {
        setShowProductC(false);
        setSelectedProduct(null);
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

    // اگر صفحه ProductC باز است
    if (showProductC) {
        return <ProductC product={selectedProduct} onBack={handleBackFromProductC} />;
    }

    return (
        <>
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                productName={deleteModal.productName}
            />

            <div className="min-h-screen rtl" dir="rtl">
                <ProductsHeader
                    isOpenTable={isOpenTable}
                    setIsOpenTable={setIsOpenTable}
                />

                <ProductsToolbar
                    isOpenTable={isOpenTable}
                    sortBy={sortBy}
                    handleSort={handleSort}
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                />

                {isOpenTable && (
                    <div className="p-6">
                        <ProductsTable
                            products={currentProducts}
                            onDelete={handleDeleteClick}
                            loadingStatus={loadingStatus}
                            totalCount={filteredAndSortedProducts.length}
                        />


                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={goToPage}
                            onPreviousPage={goToPreviousPage}
                            onNextPage={goToNextPage}
                            startIndex={startIndex}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredAndSortedProducts.length}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default ShopifyAdminInterface;