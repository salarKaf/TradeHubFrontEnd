// کامپوننت ProductC که حالا ProductDetailPage استفاده می‌کند
const ProductC = ({ product, onBack }) => {
    return <ProductDetailPage product={product} onBack={onBack} />;
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
            dateAdded: new Date('2024-01-15'),
            brand: 'ایسوس',
            weight: '2500',
            description: 'لپ‌تاپ قدرتمند ایسوس با پردازنده Intel Core i7 و حافظه RAM 16 گیگابایت، مناسب برای کارهای حرفه‌ای و بازی.'
        },
        {
            id: 2,
            name: 'گوشی سامسونگ',
            category: 'غیرفعال',
            sales: 342,
            price: '2,500,000',
            status: 'موبایل',
            dateAdded: new Date('2024-02-10'),
            brand: 'سامسونگ',
            weight: '180',
            description: 'گوشی هوشمند سامسونگ با صفحه نمایش Super AMOLED و دوربین 108 مگاپیکسل.'
        },
        {
            id: 3,
            name: 'هدفون بلوتوث',
            category: 'فعال',
            sales: 789,
            price: '450,000',
            status: 'صوتی و تصویری',
            dateAdded: new Date('2024-03-05'),
            brand: 'سونی',
            weight: '250',
            description: 'هدفون بی‌سیم با کیفیت صدای عالی و قابلیت حذف نویز فعال.'
        },
        {
            id: 4,
            name: 'ماوس بی‌سیم',
            category: 'فعال',
            sales: 234,
            price: '120,000',
            status: 'کامپیوتر',
            dateAdded: new Date('2024-03-20'),
            brand: 'لاجیتک',
            weight: '85',
            description: 'ماوس بی‌سیم ارگونومیک با باتری طولانی مدت و دقت بالا.'
        },
        {
            id: 5,
            name: 'کیبورد گیمینگ',
            category: 'فعال',
            sales: 456,
            price: '890,000',
            status: 'کامپیوتر',
            dateAdded: new Date('2024-04-01'),
            brand: 'ریزر',
            weight: '1200',
            description: 'کیبورد مکانیکی گیمینگ با نورپردازی RGB و کلیدهای چری MX.'
        },
        {
            id: 6,
            name: 'تبلت اپل',
            category: 'فعال',
            sales: 321,
            price: '4,500,000',
            status: 'الکترونیک',
            dateAdded: new Date('2024-04-15'),
            brand: 'اپل',
            weight: '470',
            description: 'تبلت iPad Pro با تراشه M2 و صفحه نمایش Liquid Retina.'
        },
        {
            id: 7,
            name: 'ساعت هوشمند',
            category: 'فعال',
            sales: 678,
            price: '1,200,000',
            status: 'پوشیدنی',
            dateAdded: new Date('2024-05-01'),
            brand: 'اپل',
            weight: '45',
            description: 'ساعت هوشمند با قابلیت‌های سلامتی پیشرفته و مقاومت در برابر آب.'
        },
        {
            id: 8,
            name: 'دوربین دیجیتال',
            category: 'غیرفعال',
            sales: 145,
            price: '2,800,000',
            status: 'عکاسی',
            dateAdded: new Date('2024-05-10'),
            brand: 'کانن',
            weight: '650',
            description: 'دوربین DSLR حرفه‌ای با سنسور 24 مگاپیکسل و لنز کیت 18-55.'
        },
        {
            id: 9,
            name: 'اسپیکر بلوتوث',
            category: 'فعال',
            sales: 523,
            price: '650,000',
            status: 'صوتی و تصویری',
            dateAdded: new Date('2024-05-20'),
            brand: 'JBL',
            weight: '540',
            description: 'اسپیکر قابل حمل با صدای پاور و مقاوم در برابر آب.'
        },
        {
            id: 10,
            name: 'پاور بانک',
            category: 'فعال',
            sales: 412,
            price: '300,000',
            status: 'لوازم جانبی',
            dateAdded: new Date('2024-06-01'),
            brand: 'انکر',
            weight: '350',
            description: 'پاور بانک 20000 میلی‌آمپر ساعت با شارژ سریع و نمایشگر LED.'
        },
        {
            id: 11,
            name: 'چراغ مطالعه LED',
            category: 'فعال',
            sales: 267,
            price: '180,000',
            status: 'لوازم خانگی',
            dateAdded: new Date('2024-06-05'),
            brand: 'فیلیپس',
            weight: '420',
            description: 'چراغ مطالعه LED با تنظیم شدت نور و دمای رنگ.'
        },
        {
            id: 12,
            name: 'کارت حافظه',
            category: 'فعال',
            sales: 398,
            price: '85,000',
            status: 'لوازم جانبی',
            dateAdded: new Date('2024-06-10'),
            brand: 'سندیسک',
            weight: '2',
            description: 'کارت حافظه میکرو SD با ظرفیت 64 گیگابایت و سرعت بالا.'
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
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
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



import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Eye, Plus, Filter, Grid, List, ArrowUpDown, X, Check, ChevronLeft, ChevronRight, ArrowRight, Star, MessageCircle, DollarSign, TrendingUp, Award, Save, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import {Link} from 'react-router-dom'

const ShowProduct = ({ product, onBack }) => {
    const [isEditing, setIsEditing] = useState({});
    const [editedProduct, setEditedProduct] = useState(product);
    const [activeTab, setActiveTab] = useState('comments');

    // نظرات نمونه
    const [comments] = useState([
        {
            id: 1,
            user: 'احمد رضایی',
            rating: 5,
            date: '1403/03/15',
            text: 'محصول فوق‌العاده‌ای بود. کیفیت بسیار بالا و ارزش خرید داره.',
            helpful: 12,
            notHelpful: 2
        },
        {
            id: 2,
            user: 'مریم احمدی',
            rating: 4,
            date: '1403/03/10',
            text: 'خوب بود اما قیمتش کمی بالاست. در کل راضی هستم.',
            helpful: 8,
            notHelpful: 1
        },
        {
            id: 3,
            user: 'علی محمدی',
            rating: 3,
            date: '1403/03/05',
            text: 'متوسط بود، انتظار بیشتری داشتم.',
            helpful: 3,
            notHelpful: 5
        }
    ]);

    // سوالات نمونه
    const [questions] = useState([
        {
            id: 1,
            user: 'سارا کریمی',
            date: '1403/03/12',
            question: 'آیا این محصول گارانتی دارد؟',
            answer: 'بله، این محصول دارای 18 ماه گارانتی شرکتی است.',
            answerDate: '1403/03/13'
        },
        {
            id: 2,
            user: 'حسین نوری',
            date: '1403/03/08',
            question: 'زمان ارسال چقدر است؟',
            answer: 'معمولاً 2 تا 3 روز کاری طول می‌کشد.',
            answerDate: '1403/03/09'
        }
    ]);

    const handleEdit = (field) => {
        setIsEditing({ ...isEditing, [field]: true });
    };

    const handleSave = (field) => {
        setIsEditing({ ...isEditing, [field]: false });
        // اینجا می‌تونی داده‌ها رو به سرور ارسال کنی
    };

    const handleCancel = (field) => {
        setIsEditing({ ...isEditing, [field]: false });
        setEditedProduct({ ...editedProduct, [field]: product[field] });
    };

    const handleInputChange = (field, value) => {
        setEditedProduct({ ...editedProduct, [field]: value });
    };

    const renderEditableField = (field, label, type = 'text') => {
        const isFieldEditing = isEditing[field];
        
        return (
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
                <div className="flex items-center gap-2">
                    {isFieldEditing ? (
                        <>
                            {type === 'textarea' ? (
                                <textarea
                                    value={editedProduct[field] || ''}
                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            ) : (
                                <input
                                    type={type}
                                    value={editedProduct[field] || ''}
                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            )}
                            <button
                                onClick={() => handleSave(field)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                                <Save size={18} />
                            </button>
                            <button
                                onClick={() => handleCancel(field)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg border">
                                {editedProduct[field] || 'مقدار وارد نشده'}
                            </div>
                            <button
                                onClick={() => handleEdit(field)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${
                            star <= rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowRight size={20} />
                            بازگشت
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            جزئیات محصول: {editedProduct.name}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* آمار محصول */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <TrendingUp className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">تعداد فروش</p>
                                <p className="text-2xl font-bold text-gray-900">{editedProduct.sales}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="text-green-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">مبلغ فروش رفته</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(parseInt(editedProduct.price.replace(/,/g, '')) * editedProduct.sales).toLocaleString()} تومان
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Star className="text-yellow-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">امتیاز محصول</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-gray-900">4.2</span>
                                    {renderStars(4)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Award className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">از بهترین‌های فروشگاه</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Heart className="text-red-500 fill-current" size={20} />
                                    <span className="text-sm font-medium text-gray-700">محصول محبوب</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* اطلاعات محصول */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">اطلاعات محصول</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            {renderEditableField('name', 'نام محصول')}
                            {renderEditableField('price', 'قیمت (تومان)')}
                            {renderEditableField('status', 'دسته‌بندی')}
                        </div>
                        <div>
                            {renderEditableField('category', 'وضعیت')}
                            {renderEditableField('brand', 'برند', 'text')}
                            {renderEditableField('weight', 'وزن (گرم)', 'number')}
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        {renderEditableField('description', 'توضیحات محصول', 'textarea')}
                    </div>
                </div>

                {/* بخش نظرات و سوالات */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="border-b">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                                    activeTab === 'comments'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <MessageCircle size={20} />
                                    دیدگاه‌ها ({comments.length})
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('questions')}
                                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                                    activeTab === 'questions'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <MessageCircle size={20} />
                                    پرسش‌ها ({questions.length})
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'comments' && (
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {comment.user.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{comment.user}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {renderStars(comment.rating)}
                                                        <span className="text-sm text-gray-500">{comment.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">{comment.text}</p>
                                        <div className="flex items-center gap-4">
                                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600">
                                                <ThumbsUp size={16} />
                                                مفید ({comment.helpful})
                                            </button>
                                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600">
                                                <ThumbsDown size={16} />
                                                غیر مفید ({comment.notHelpful})
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'questions' && (
                            <div className="space-y-6">
                                {questions.map((question) => (
                                    <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-medium text-gray-900">{question.user}</span>
                                                <span className="text-sm text-gray-500">{question.date}</span>
                                            </div>
                                            <p className="text-gray-700 font-medium">سوال: {question.question}</p>
                                        </div>
                                        
                                        {question.answer && (
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-medium text-blue-800">پاسخ فروشگاه</span>
                                                    <span className="text-sm text-blue-600">{question.answerDate}</span>
                                                </div>
                                                <p className="text-blue-800">{question.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowProduct;