import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Eye, Plus, Filter, Grid, List, ArrowUpDown, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import {Link} from 'react-router-dom'
// کامپوننت ProductC (فرضی)
const ProductC = ({ product, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            <button 
                onClick={onBack}
                className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
                بازگشت
            </button>
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">جزئیات محصول</h2>
                <p><strong>نام:</strong> {product.name}</p>
                <p><strong>قیمت:</strong> {product.price}</p>
                <p><strong>فروش:</strong> {product.sales}</p>
                <p><strong>دسته‌بندی:</strong> {product.status}</p>
                <p><strong>وضعیت:</strong> {product.category}</p>
            </div>
        </div>
    );
};

// کامپوننت Modal تایید حذف
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">تایید حذف</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">
                    آیا از حذف محصول "{productName}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        انصراف
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        بله، حذف شود
                    </button>
                </div>
            </div>
        </div>
    );
};

const ShopifyAdminInterface = () => {
    const [isOpenTable, setIsOpenTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductC, setShowProductC] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });

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

    // عملکردها
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (sortType) => {
        setSortBy(sortType);
    };

    const handleView = (product) => {
        setSelectedProduct(product);
        setShowProductC(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowProductC(true);
    };

    const handleDeleteClick = (product) => {
        setDeleteModal({
            isOpen: true,
            productId: product.id,
            productName: product.name
        });
    };

    const handleDeleteConfirm = () => {
        setProducts(products.filter(p => p.id !== deleteModal.productId));
        setDeleteModal({ isOpen: false, productId: null, productName: '' });
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

    // محاسبه شماره صفحات برای نمایش
    const getPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, startPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
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
                {/* Header */}
                <div className="px-4 py-4">
                    <div className="relative flex items-center mb-6 gap-3 font-modam">
                        <img
                            className="w-9 h-9"
                            src="/SellerPanel/Products/icons8-product-50 1.png"
                            alt="products"
                        />
                        <h2 className="text-2xl font-semibold"> محصولات </h2>

                        {/* آیکون فلش برای باز و بسته کردن جدول */}
                        <div className="flex justify-between items-center mb-4 mt-5">
                            <button onClick={() => setIsOpenTable(!isOpenTable)} className="text-xl text-[#4D4D4D] hover:text-black transition-colors">
                                {isOpenTable ? (
                                    <FaChevronDown className="w-5 h-5" />
                                ) : (
                                    <FaChevronRight className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <Link
                            to='/AddProduct'
                            className="mr-auto pr-8 bg-[#1e202d] font-modam font-medium text-lg w-64 h-4/5 text-white py-4 rounded-full shadow-md"
                        >
                            + افزودن محصــول جدید
                        </Link>

                        <div className="absolute bottom-0 left-8 right-0 h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"></div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Filters */}
                        {isOpenTable && (
                            <div dir='ltr' className="flex items-center gap-2 font-modam">
                                <button
                                    onClick={() => handleSort('bestselling')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'bestselling'
                                        ? 'text-blue-600 font-medium'
                                        : 'text-gray-700'
                                        }`}
                                >
                                    پر فروش ترین
                                </button>
                                <button
                                    onClick={() => handleSort('newest')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'newest'
                                        ? 'text-red-600 font-medium'
                                        : 'text-gray-700'
                                        }`}
                                >
                                    جدیدترین
                                </button>
                                <h1 className="px-4 py-2 text-gray-700 font-semibold rounded-lg transition-colors">
                                    :مرتب سازی
                                </h1>
                                <img src='/public/SellerPanel/Products/icons8-sort-by-50 1.png'></img>
                            </div>
                        )}

                        {/* Search */}
                        {isOpenTable && (
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="جست و جو در میان محصولات"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* content */}
                {isOpenTable && (
                    <div className="p-6">
                        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Table Header */}
                            <div className="px-6 py-3 border-b bg-[#eac09fad] font-modam text-lg shadow-inner">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-3 py-3">نام محصول</div>
                                    <div className="col-span-2 py-3">میزان فروش</div>
                                    <div className="col-span-2 py-3">قیمت</div>
                                    <div className="col-span-2 py-3">دسته بندی</div>
                                    <div className="col-span-2 py-3">وضعیت</div>
                                    <div className="col-span-1 text-center py-3 px-3">عملیات</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {filteredAndSortedProducts.length === 0 ? (
                                    <div className="px-6 py-8 text-center text-gray-500">
                                        محصولی با این نام پیدا نشد
                                    </div>
                                ) : (
                                    currentProducts.map((product) => (
                                        <div key={product.id} className="px-5 py-5 hover:bg-gray-50 transition-colors">
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                {/* Product Name */}
                                                <div className="col-span-3">
                                                    <span className="font-medium text-gray-900">{product.name}</span>
                                                </div>

                                                {/* Sales */}
                                                <div className="col-span-2 text-gray-600">
                                                    {product.sales} فروش
                                                </div>

                                                {/* Price */}
                                                <div className="col-span-2 font-medium text-gray-900">
                                                    {product.price}
                                                </div>

                                                {/* Category */}
                                                <div className="col-span-2 text-gray-600">
                                                    {product.status}
                                                </div>

                                                {/* Status */}
                                                <div className="col-span-2">
                                                    <span className={`font-medium ${product.category === 'فعال' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {product.category}
                                                    </span>
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-1 flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <Link
                                                        to='./detailProduct'
                                                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleView(product)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center mt-6">
                                <div className="flex items-center gap-2">
                                    {/* Previous Button */}
                                    <button 
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                            currentPage === 1 
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                                : 'bg-gray-800 text-white hover:bg-gray-900'
                                        }`}
                                    >
                                        <ChevronRight size={16} />
                                    </button>

                                    {/* Page Numbers */}
                                    {getPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {/* Next Button */}
                                    <button 
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                            currentPage === totalPages 
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                                : 'bg-gray-800 text-white hover:bg-gray-900'
                                        }`}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Pagination Info */}
                        {filteredAndSortedProducts.length > 0 && (
                            <div className="text-center mt-4 text-sm text-gray-600">
                                نمایش {startIndex + 1} تا {Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} از {filteredAndSortedProducts.length} محصول
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ShopifyAdminInterface;