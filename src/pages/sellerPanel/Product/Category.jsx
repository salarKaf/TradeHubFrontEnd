import React, { useState } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaPlus, FaExclamationTriangle, FaChevronDown, FaChevronRight, FaTimes, FaBox, FaShoppingCart, FaTag } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Category = () => {
    // وضعیت برای نمایش یا مخفی کردن جدول
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();


    // وضعیت برای مدال محصولات
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // محصولات نمونه برای هر دسته‌بندی
    const mockProducts = {
        1: [
            { id: 1, name: 'لپ تاپ ایسوس', sales: 586, price: '3,000,000', status: 'فعال', category: 'الکترونیک' },
            { id: 2, name: 'گوشی سامسونگ', sales: 342, price: '2,500,000', status: 'فعال', category: 'موبایل' },
            { id: 3, name: 'هدفون بلوتوث', sales: 789, price: '450,000', status: 'فعال', category: 'صوتی و تصویری' },
        ],
        2: [
            { id: 4, name: 'ماوس بی‌سیم', sales: 234, price: '120,000', status: 'فعال', category: 'کامپیوتر' },
            { id: 5, name: 'کیبورد گیمینگ', sales: 456, price: '890,000', status: 'فعال', category: 'کامپیوتر' },
        ],
        3: [
            { id: 6, name: 'تبلت اپل', sales: 321, price: '4,500,000', status: 'فعال', category: 'الکترونیک' },
            { id: 7, name: 'ساعت هوشمند', sales: 678, price: '1,200,000', status: 'فعال', category: 'پوشیدنی' },
        ],
        4: [
            { id: 8, name: 'دوربین دیجیتال', sales: 145, price: '2,800,000', status: 'غیرفعال', category: 'عکاسی' },
        ],
        5: [
            { id: 9, name: 'اسپیکر بلوتوث', sales: 523, price: '650,000', status: 'فعال', category: 'صوتی و تصویری' },
            { id: 10, name: 'پاور بانک', sales: 412, price: '300,000', status: 'فعال', category: 'لوازم جانبی' },
        ],
    };

    // وضعیت‌های مربوط به دسته‌بندی‌ها
    const [categories, setCategories] = useState([
        {
            id: 1,
            name: "دسته بندی یک",
            sales: 586,
            productsCount: 57,
            isExpanded: false,
            subCategories: [
                {
                    id: 11,
                    name: "زیردسته یک-یک",
                    sales: 200,
                    productsCount: 25,
                    isExpanded: false,
                    subCategories: [
                        {
                            id: 111,
                            name: "زیردسته یک-یک-یک",
                            sales: 100,
                            productsCount: 10,
                            isExpanded: false,
                            subCategories: []
                        }
                    ]
                },
                {
                    id: 12,
                    name: "زیردسته یک-دو",
                    sales: 150,
                    productsCount: 15,
                    isExpanded: false,
                    subCategories: []
                }
            ]
        },
        {
            id: 2,
            name: "دسته بندی دو",
            sales: 586,
            productsCount: 57,
            isExpanded: false,
            subCategories: [
                {
                    id: 21,
                    name: "زیردسته دو-یک",
                    sales: 300,
                    productsCount: 30,
                    isExpanded: false,
                    subCategories: []
                }
            ]
        },
        {
            id: 3,
            name: "دسته بندی سه",
            sales: 586,
            productsCount: 10,
            isExpanded: false,
            subCategories: []
        },
        {
            id: 4,
            name: "دسته بندی چهار",
            sales: 586,
            productsCount: 47,
            isExpanded: false,
            subCategories: []
        },
        {
            id: 5,
            name: "دسته بندی پنج",
            sales: 586,
            productsCount: 57,
            isExpanded: false,
            subCategories: []
        },
    ]);

    // سایر state های موجود
    const [newCategory, setNewCategory] = useState("");
    const [newSubCategory, setNewSubCategory] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [addingSubTo, setAddingSubTo] = useState(null);
    const [error, setError] = useState("");
    const [editingPath, setEditingPath] = useState(null);
    const [editingValue, setEditingValue] = useState("");
    const [deletingPath, setDeletingPath] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // تابع برای نمایش محصولات دسته‌بندی
    const viewCategoryProducts = (category) => {
        setSelectedCategory(category);
        setShowProductsModal(true);
    };

    // کامپوننت مدال محصولات
    const ProductsModal = () => {
        if (!showProductsModal || !selectedCategory) return null;

        const products = mockProducts[selectedCategory.id] || [];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-modam">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                    {/* هدر مدال */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaBox className="text-2xl" />
                            <div>
                                <h2 className="text-2xl font-bold">محصولات {selectedCategory.name}</h2>
                                <p className="text-blue-100 mt-1">مجموع {products.length} محصول</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowProductsModal(false)}
                            className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {/* محتوای مدال */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">هیچ محصولی در این دسته‌بندی وجود ندارد</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.map((product) => (
                                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            {/* نام محصول */}
                                            <div className="col-span-3 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                    <FaBox className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                                    <p className="text-sm text-gray-500">{product.category}</p>
                                                </div>
                                            </div>

                                            {/* فروش */}
                                            <div className="col-span-2 flex items-center gap-2">
                                                <FaShoppingCart className="text-green-500" />
                                                <span className="text-gray-600">{product.sales} فروش</span>
                                            </div>

                                            {/* قیمت */}
                                            <div className="col-span-2 flex items-center gap-2">
                                                <FaTag className="text-orange-500" />
                                                <span className="font-medium text-gray-900">{product.price} تومان</span>
                                            </div>

                                            {/* وضعیت */}
                                            <div className="col-span-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.status === 'فعال'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </div>

                                            {/* عملیات */}
                                            <div className="col-span-3 flex items-center justify-end gap-2">

                                                <button
                                                    onClick={() => navigate('/detailProduct')}
                                                    className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* فوتر مدال */}
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <FaBox className="text-blue-500" />
                                <span>تعداد محصولات: {products.length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaShoppingCart className="text-green-500" />
                                <span>مجموع فروش: {products.reduce((sum, p) => sum + p.sales, 0)}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowProductsModal(false)}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            بستن
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // تابع کمکی برای پیدا کردن و به‌روزرسانی یک دسته‌بندی بر اساس path
    const updateCategoryAtPath = (categories, path, updateFn) => {
        if (path.length === 0) return categories;

        const [currentIndex, ...restPath] = path;
        return categories.map((category, index) => {
            if (index === currentIndex) {
                if (restPath.length === 0) {
                    return updateFn(category);
                } else {
                    return {
                        ...category,
                        subCategories: updateCategoryAtPath(category.subCategories, restPath, updateFn)
                    };
                }
            }
            return category;
        });
    };

    // تابع کمکی برای پیدا کردن یک دسته‌بندی بر اساس path
    const findCategoryAtPath = (categories, path) => {
        let current = categories;
        for (const index of path) {
            current = current[index];
            if (path.indexOf(index) < path.length - 1) {
                current = current.subCategories;
            }
        }
        return current;
    };

    // تابع برای toggle کردن وضعیت باز/بسته بودن دسته‌بندی
    const toggleExpanded = (path) => {
        setCategories(prevCategories =>
            updateCategoryAtPath(prevCategories, path, (category) => ({
                ...category,
                isExpanded: !category.isExpanded
            }))
        );
    };

    // تابع برای افزودن دسته‌بندی اصلی
    const addCategory = () => {
        setIsAdding(true);
        setAddingSubTo(null);
        setError("");
    };

    // تابع برای ذخیره کردن دسته‌بندی اصلی
    const saveCategory = () => {
        if (!newCategory.trim()) {
            setError("نام دسته‌بندی نمی‌تواند خالی باشد");
            return;
        }

        const newId = Math.max(...categories.map(c => c.id)) + 1;
        setCategories([
            ...categories,
            {
                id: newId,
                name: newCategory,
                sales: 0,
                productsCount: 0,
                isExpanded: false,
                subCategories: []
            },
        ]);
        setNewCategory("");
        setIsAdding(false);
        setError("");
    };

    // تابع برای کنسل کردن افزودن دسته‌بندی اصلی
    const cancelAddCategory = () => {
        setNewCategory("");
        setIsAdding(false);
        setError("");
    };

    // تابع برای شروع افزودن زیردسته‌بندی
    const startAddingSubCategory = (path) => {
        setAddingSubTo(path);
        setIsAdding(false);
        setError("");
    };

    // تابع برای جمع‌آوری تمام IDهای موجود در ساختار درختی دسته‌بندی‌ها
    const getAllIds = (categories) => {
        const ids = [];

        const collectIds = (categoryList) => {
            categoryList.forEach(category => {
                ids.push(category.id);
                if (category.subCategories && category.subCategories.length > 0) {
                    collectIds(category.subCategories);
                }
            });
        };

        collectIds(categories);
        return ids;
    };

    // تابع برای ذخیره کردن زیردسته‌بندی
    const saveSubCategory = (path) => {
        if (!newSubCategory.trim()) {
            setError("نام زیردسته‌بندی نمی‌تواند خالی باشد");
            return;
        }

        setCategories(prevCategories => {
            const allIds = getAllIds(prevCategories);
            const maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
            const newId = maxId + 1;

            return updateCategoryAtPath(prevCategories, path, (parentCategory) => ({
                ...parentCategory,
                subCategories: [
                    ...parentCategory.subCategories,
                    {
                        id: newId,
                        name: newSubCategory,
                        sales: 0,
                        productsCount: 0,
                        isExpanded: false,
                        subCategories: []
                    }
                ]
            }));
        });

        setNewSubCategory("");
        setAddingSubTo(null);
        setError("");
    };

    // تابع برای کنسل کردن افزودن زیردسته‌بندی
    const cancelAddSubCategory = () => {
        setNewSubCategory("");
        setAddingSubTo(null);
        setError("");
    };

    // تابع برای شروع ویرایش
    const startEditing = (path) => {
        const category = findCategoryAtPath(categories, path);
        setEditingPath(path);
        setEditingValue(category.name);
        setError("");
    };

    // تابع برای ذخیره ویرایش
    const saveEdit = () => {
        if (!editingValue.trim()) {
            setError("نام دسته‌بندی نمی‌تواند خالی باشد");
            return;
        }

        setCategories(prevCategories =>
            updateCategoryAtPath(prevCategories, editingPath, (category) => ({
                ...category,
                name: editingValue
            }))
        );

        setEditingPath(null);
        setEditingValue("");
        setError("");
    };

    // تابع برای کنسل کردن ویرایش
    const cancelEdit = () => {
        setEditingPath(null);
        setEditingValue("");
        setError("");
    };

    // تابع برای شروع فرآیند حذف
    const startDelete = (path) => {
        setDeletingPath(path);
        setShowDeleteModal(true);
    };

    // تابع برای حذف دسته‌بندی (فقط دسته‌بندی)
    const deleteCategory = () => {
        if (deletingPath.length === 1) {
            // حذف دسته‌بندی اصلی
            setCategories(prevCategories =>
                prevCategories.filter((_, index) => index !== deletingPath[0])
            );
        } else {
            // حذف زیردسته‌بندی
            const parentPath = deletingPath.slice(0, -1);
            const indexToDelete = deletingPath[deletingPath.length - 1];

            setCategories(prevCategories =>
                updateCategoryAtPath(prevCategories, parentPath, (parentCategory) => ({
                    ...parentCategory,
                    subCategories: parentCategory.subCategories.filter((_, index) => index !== indexToDelete)
                }))
            );
        }

        setShowDeleteModal(false);
        setDeletingPath(null);
    };

    // تابع برای حذف دسته‌بندی با محصولات
    const deleteCategoryWithProducts = () => {
        deleteCategory();
    };

    // تابع برای کنسل کردن حذف
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingPath(null);
    };

    // کامپوننت مودال حذف
    const DeleteModal = () => {
        if (!showDeleteModal || !deletingPath) return null;

        const categoryToDelete = findCategoryAtPath(categories, deletingPath);

        return (
            <div className="fixed inset-0 font-rubik bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">تأیید حذف</h3>
                    <p className="text-gray-600 mb-6">
                        آیا می‌خواهید دسته‌بندی "{categoryToDelete.name}" را حذف کنید؟
                    </p>

                    <div className="pb-6 pt-2 flex gap-2">
                        <FaExclamationTriangle className="w-5 h-5 " />
                        <h2 className="" >توجه کنید که با حذف این دسته بندی تمام محصولات آن حذف خواهد شد!</h2>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={deleteCategoryWithProducts}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            این دسته‌بندی را با تمام محصولاتش حذف کن
                        </button>

                        <button
                            onClick={cancelDelete}
                            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            کنسل
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // تابع برای رندر کردن ردیف‌های جدول
    const renderCategoryRows = (categories, level = 0, parentPath = []) => {
        const rows = [];

        categories.forEach((category, index) => {
            const currentPath = [...parentPath, index];
            const hasSubCategories = category.subCategories && category.subCategories.length > 0;
            const paddingLeft = level * 20;

            // ردیف اصلی دسته‌بندی
            rows.push(
                <tr key={`category-${category.id}`} className="border-b hover:bg-gray-50 transition-colors font-modam shadow-sm ">
                    <td className="py-2 px-4" style={{ paddingRight: `${paddingLeft + 16}px` }}>
                        {editingPath && JSON.stringify(editingPath) === JSON.stringify(currentPath) ? (
                            <div className="flex items-center gap-2">
                                {hasSubCategories ? (
                                    <div className="w-3 h-3"></div>
                                ) : (
                                    <div className="w-3 h-3"></div>
                                )}
                                <input
                                    type="text"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded-md flex-1"
                                    placeholder="نام دسته‌بندی"
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {hasSubCategories ? (
                                    <button
                                        onClick={() => toggleExpanded(currentPath)}
                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        {category.isExpanded ? (
                                            <FaChevronDown className="w-3 h-3" />
                                        ) : (
                                            <FaChevronRight className="w-3 h-3" />
                                        )}
                                    </button>
                                ) : (
                                    <div className="w-3 h-3"></div>
                                )}
                                <span>{category.name}</span>
                            </div>
                        )}
                        {error && editingPath && JSON.stringify(editingPath) === JSON.stringify(currentPath) && (
                            <div className="text-red-500 text-sm mt-1">{error}</div>
                        )}
                    </td>
                    <td className="py-5 px-10 text-right">{category.sales} فروش</td>
                    <td className="py-5 px-10 text-right">{category.productsCount} محصول</td>
                    <td className="py-5 px- text-right">
                        {editingPath && JSON.stringify(editingPath) === JSON.stringify(currentPath) ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={saveEdit}
                                    className="bg-green-700 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    ذخیره
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="bg-red-700 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    انصراف
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => startDelete(currentPath)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <FaTrashAlt />
                                </button>
                                <button
                                    onClick={() => startEditing(currentPath)}
                                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => viewCategoryProducts(category)}
                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    onClick={() => startAddingSubCategory(currentPath)}
                                    className="text-green-500 hover:text-green-700 transition-colors text-sm px-2 py-1 rounded"
                                >
                                    + زیردسته
                                </button>
                            </div>
                        )}
                    </td>
                </tr>
            );

            // ردیف افزودن زیردسته‌بندی
            if (addingSubTo && JSON.stringify(addingSubTo) === JSON.stringify(currentPath)) {
                rows.push(
                    <tr key={`add-sub-${category.id}`} className="bg-blue-50 font-modam">
                        <td className="py-2 px-4" style={{ paddingRight: `${paddingLeft + 36}px` }}>
                            <input
                                type="text"
                                value={newSubCategory}
                                onChange={(e) => setNewSubCategory(e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded-md w-full"
                                placeholder="نام زیردسته‌بندی"
                                autoFocus
                            />
                            {error && <div className="text-red-500 text-sm mt-1 font-modam">{error}</div>}
                        </td>
                        <td className="py-2 px-4">0 فروش</td>
                        <td className="py-2 px-4">0 محصول</td>
                        <td className="py-2 px-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => saveSubCategory(currentPath)}
                                    className="bg-green-700 font-modam text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    ذخیره
                                </button>
                                <button
                                    onClick={cancelAddSubCategory}
                                    className="bg-red-700 font-modam text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    انصراف
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            }

            // نمایش زیردسته‌ها اگر باز باشند
            if (category.isExpanded && hasSubCategories) {
                rows.push(...renderCategoryRows(category.subCategories, level + 1, currentPath));
            }
        });

        return rows;
    };

    return (
        <div>
            <div className="p-4 mt-4 max-w-7xl">
                <div className="relative flex items-center mb-6 gap-3 font-modam">
                    <img
                        className="w-9 h-9"
                        src="/public/SellerPanel/Products/icons8-category-50(1).png"
                        alt="category"
                    />
                    <h2 className="text-2xl font-semibold">دسته بندی ها</h2>

                    {/* آیکون فلش برای باز و بسته کردن جدول */}
                    <div className="flex justify-between items-center mb-4 mt-5">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-xl text-[#4D4D4D] hover:text-black transition-colors">
                            {isOpen ? (
                                <FaChevronDown className="w-5 h-5" />
                            ) : (
                                <FaChevronRight className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <button
                        onClick={addCategory}
                        className="mr-auto  bg-[#1e202d] font-modam font-medium text-lg w-64 h-4/5  text-white py-4 px-6 rounded-full shadow-md"
                    >
                        + افزودن دسته بندی جدید
                    </button>

                    <div className="absolute bottom-0 left-8 right-0 h-[0.8px]  bg-black bg-opacity-20  shadow-[0_2px_6px_rgba(0,0,0,0.3)]  "></div>
                </div>

                {/* نمایش یا مخفی کردن جدول */}
                {isOpen && (
                    <div className="overflow-x-auto ml-1 rounded-lg shadow-inner border border-gray-800 border-opacity-30">
                        <table className="min-w-full rounded-lg ">
                            <thead className="bg-[#eac09fad]  font-modam text-lg">
                                <tr className="shadow-inner">
                                    <th className="py-5 px-8 text-right border-b text-gray-700">نام دسـتـه بـندی</th>
                                    <th className="py-5 px-8 text-right border-b text-gray-700">مـیزان فـروش</th>
                                    <th className="py-5 px-8 text-right border-b text-gray-700">تعـداد محـصولات</th>
                                    <th className="py-5 px-8 text-right border-b text-gray-700">عمـلیـات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderCategoryRows(categories)}

                                {/* سطر جدید برای وارد کردن دسته بندی اصلی */}
                                {isAdding && (
                                    <tr className="bg-green-50 font-modam">
                                        <td className="py-2 px-4">
                                            <input
                                                type="text"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded-md w-full"
                                                placeholder="نام دسته بندی"
                                                autoFocus
                                            />
                                            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                                        </td>
                                        <td className="py-3 px-4">0 فروش</td>
                                        <td className="py-3 px-4">0 محصول</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={saveCategory}
                                                    className="bg-green-700 font-modam text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    ذخیره
                                                </button>
                                                <button
                                                    onClick={cancelAddCategory}
                                                    className="bg-red-700 font-modam text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* مودال حذف */}
            <DeleteModal />

            {/* مدال محصولات */}
            <ProductsModal />
        </div>
    );
};

export default Category;