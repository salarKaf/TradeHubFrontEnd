import React, { useState } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaPlus, FaExclamationTriangle, FaChevronDown, FaChevronRight, FaTimes, FaBox, FaShoppingCart, FaTag } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getWebsiteCategories } from "../../../API/category";
import { getItemCountByCategoryId } from "../../../API/category";
import { editSubCategory, editWebsiteCategory } from "../../../API/category";
import { createWebsiteSubcategory, getSubcategoriesByCategoryId } from "../../../API/category"; // بالای فایل
import { createMainCategory } from "../../../API/category"; // بالای فایل
import { deleteWebsiteCategory, deleteWebsiteSubcategory } from "../../../API/category"; // بالای فایل
import { getItemsByCategoryId , deleteItemById  } from "../../../API/Items"; // اضافه کن بالا

// تابع بازگشتی برای گرفتن و آپدیت تعداد محصولات هر دسته
// تابع بازگشتی برای گرفتن و آپدیت تعداد محصولات هر دسته
const updateCategoryProductCounts = async (categories) => {
    const updatedCategories = await Promise.all(
        categories.map(async (category) => {
            let productCount = 0;

            try {
                const countResponse = await getItemCountByCategoryId(category.id);

                console.log("📦 Count response for:", category.name, countResponse);

                // بررسی دقیق‌تر برای ساختار ریسپانس
                productCount = typeof countResponse === 'number' ? countResponse : (countResponse.count || 0);
            } catch (err) {
                console.error(`❌ خطا در گرفتن تعداد محصولات برای ${category.name}:`, err);
            }

            // ادامه بازگشتی برای زیردسته‌ها
            const updatedSubCategories = category.subCategories?.length
                ? await updateCategoryProductCounts(category.subCategories)
                : [];

            return {
                ...category,
                productsCount: productCount,
                subCategories: updatedSubCategories,
            };
        })
    );

    return updatedCategories;
};


const Category = () => {


    const { websiteId } = useParams();

    // وضعیت برای نمایش یا مخفی کردن جدول
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();



    // وضعیت برای مدال محصولات
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // محصولات نمونه برای هر دسته‌بندی

    // وضعیت‌های مربوط به دسته‌بندی‌ها
    const [categories, setCategories] = useState(null); // قبلاً [] بود


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
    const [productToDelete, setProductToDelete] = useState(null);

    // تابع برای نمایش محصولات دسته‌بندی

    const [categoryProducts, setCategoryProducts] = useState([]);

    const viewCategoryProducts = async (category) => {
        try {
            const items = await getItemsByCategoryId(category.id);

            const formatted = items.map(item => ({
                id: item.item_id,
                name: item.name,
                price: item.price,
                sales: item.sales_count || 0,
                status: item.is_available ? "فعال" : "غیرفعال",
                category: category.name,
            }));

            setCategoryProducts(formatted);
            setSelectedCategory(category);
            setShowProductsModal(true);
        } catch (error) {
            console.error("❌ خطا در گرفتن محصولات دسته:", error);
        }
    };

    // کامپوننت مدال محصولات
    const ProductsModal = () => {
        if (!showProductsModal || !selectedCategory) return null;

        const products = categoryProducts || [];

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
                                                    onClick={() => navigate(`/detailProduct/${websiteId}/${product.id}`)}
                                                    className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() => setProductToDelete(product)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
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
        for (let i = 0; i < path.length; i++) {
            if (!current || !Array.isArray(current)) return null;

            const index = path[i];
            const category = current[index];
            if (!category) return null;

            if (i === path.length - 1) return category;

            current = category.subCategories;
        }
        return null;
    };


    // تابع برای toggle کردن وضعیت باز/بسته بودن دسته‌بندی
    const toggleExpanded = async (path) => {
        const category = findCategoryAtPath(categories, path);

        if (!category.isExpanded && (!category.subCategories || category.subCategories.length === 0)) {
            try {
                const allSubcategories = await getSubcategoriesByCategoryId(category.id);
                const subcategories = allSubcategories.filter(sub => sub.is_active === true);
                const updatedSubs = subcategories.map((sub) => ({
                    ...sub,
                    subCategories: [],
                    isExpanded: false,
                    productsCount: 0,
                }));

                console.log("✅ زیر‌دسته‌های دریافت‌شده:", updatedSubs);

                setCategories((prev) =>
                    updateCategoryAtPath(prev, path, (cat) => ({
                        ...cat,
                        isExpanded: true,
                        subCategories: updatedSubs,
                    }))
                );
            } catch (error) {
                console.error("❌ خطا در گرفتن زیر‌دسته‌ها:", error);
            }
        } else {
            // فقط باز و بسته کردن بدون نیاز به API
            setCategories((prev) =>
                updateCategoryAtPath(prev, path, (cat) => ({
                    ...cat,
                    isExpanded: !cat.isExpanded,
                }))
            );
        }
    };




    // تابع برای افزودن دسته‌بندی اصلی
    const addCategory = () => {
        setIsAdding(true);
        setAddingSubTo(null);
        setError("");
    };

    // تابع برای ذخیره کردن دسته‌بندی اصلی

    const saveCategory = async () => {
        if (!newCategory.trim()) {
            setError("نام دسته‌بندی نمی‌تواند خالی باشد");
            return;
        }

        try {
            const res = await createMainCategory({
                website_id: websiteId,
                name: newCategory,
            });

            const newCategoryObject = {
                id: res.id, // فرض بر اینکه API این فیلد رو برمی‌گردونه
                name: res.name,
                sales: 0,
                productsCount: 0,
                isExpanded: false,
                subCategories: []
            };

            setCategories([...categories, newCategoryObject]);
            setNewCategory("");
            setIsAdding(false);
            setError("");
            console.log("✅ دسته‌بندی جدید با موفقیت اضافه شد:", res);
        } catch (err) {
            console.error("❌ خطا در افزودن دسته‌بندی:", err);
            setError("خطا در افزودن دسته‌بندی. لطفاً دوباره تلاش کنید.");
        }
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

    // ...

    const saveSubCategory = async (path) => {
        if (!newSubCategory.trim()) {
            setError("نام زیردسته‌بندی نمی‌تواند خالی باشد");
            return;
        }

        try {
            const parentCategory = findCategoryAtPath(categories, path);

            // ارسال به بک‌اند با آیدی دسته والد
            const created = await createWebsiteSubcategory(parentCategory.id, newSubCategory);

            // زیر‌دسته‌های جدید رو از بک بگیر
            const allUpdatedSubcategories = await getSubcategoriesByCategoryId(parentCategory.id);
            const updatedSubcategories = allUpdatedSubcategories.filter(sub => sub.is_active === true);
            // به‌روزرسانی در UI
            setCategories(prevCategories =>
                updateCategoryAtPath(prevCategories, path, (cat) => ({
                    ...cat,
                    subCategories: updatedSubcategories.map(sub => ({
                        id: sub.id,
                        name: sub.name,
                        productsCount: 0,
                        sales: 0,
                        subCategories: [],
                        isExpanded: false,
                    })),
                }))
            );

            setNewSubCategory("");
            setAddingSubTo(null);
            setError("");
            console.log("✅ زیر‌دسته اضافه شد");

        } catch (err) {
            console.error("❌ خطا در افزودن زیر‌دسته:", err);
            setError("افزودن زیردسته با خطا مواجه شد.");
        }
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
    const saveEdit = async () => {
        if (!editingValue.trim()) {
            setError("نام دسته‌بندی نمی‌تواند خالی باشد");
            return;
        }

        const targetCategory = findCategoryAtPath(categories, editingPath);
        const isSubCategory = editingPath.length > 1;

        try {
            if (isSubCategory) {
                // زیر دسته‌بندی
                await editSubCategory({
                    subcategory_id: targetCategory.id,
                    name: editingValue,
                    website_id: websiteId,
                });
            } else {
                // دسته‌بندی اصلی
                await editWebsiteCategory({
                    category_id: targetCategory.id, // این باید رشته باشه
                    website_id: websiteId,
                    name: editingValue,
                });
            }

            // بروزرسانی در UI
            setCategories((prevCategories) =>
                updateCategoryAtPath(prevCategories, editingPath, (category) => ({
                    ...category,
                    name: editingValue,
                }))
            );

            setEditingPath(null);
            setEditingValue("");
            setError("");
            console.log("✅ ویرایش نام دسته‌بندی با موفقیت انجام شد");
        } catch (err) {
            console.error("❌ خطا در ویرایش نام دسته‌بندی:", err);
            setError("خطا در ذخیره ویرایش. لطفاً دوباره تلاش کنید.");
        }
    };




    // تابع برای کنسل کردن ویرایش
    const cancelEdit = () => {
        setEditingPath(null);
        setEditingValue("");
        setError("");
    };



    // تابع حذف دسته‌بندی - تصحیح شده
    const deleteCategoryWithProducts = async () => {
        console.log("🔍 شروع عملیات حذف...");
        console.log("📍 deletingPath:", deletingPath);
        console.log("📍 categories:", categories);

        // بررسی معتبر بودن deletingPath
        if (!deletingPath || !Array.isArray(deletingPath) || deletingPath.length === 0) {
            console.error("❌ مسیر حذف نامعتبر است!");
            setError("خطا در تشخیص دسته‌بندی برای حذف");
            return;
        }

        // بررسی معتبر بودن categories
        if (!categories || !Array.isArray(categories)) {
            console.error("❌ لیست دسته‌بندی‌ها نامعتبر است!");
            setError("خطا در دریافت اطلاعات دسته‌بندی‌ها");
            return;
        }

        // پیدا کردن دسته‌بندی مورد نظر
        const categoryToDelete = findCategoryAtPath(categories, deletingPath);

        if (!categoryToDelete) {
            console.error("❌ دسته‌بندی برای حذف پیدا نشد!");
            setError("خطا در پیدا کردن دسته‌بندی");
            return;
        }

        if (!categoryToDelete.id) {
            console.error("❌ آی‌دی دسته‌بندی برای حذف پیدا نشد!", categoryToDelete);
            setError("خطا در شناسایی دسته‌بندی");
            return;
        }

        console.log("✅ دسته‌بندی برای حذف:", categoryToDelete);

        try {
            // تشخیص نوع دسته‌بندی (اصلی یا زیردسته)
            const isMainCategory = deletingPath.length === 1;

            console.log(`🔥 ${isMainCategory ? 'حذف دسته‌بندی اصلی' : 'حذف زیردسته‌بندی'} با ID: ${categoryToDelete.id}`);

            // صدا زدن API مناسب
            if (isMainCategory) {
                await deleteWebsiteCategory(categoryToDelete.id);
                console.log("✅ دسته‌بندی اصلی از سرور حذف شد");
            } else {
                await deleteWebsiteSubcategory(categoryToDelete.id);
                console.log("✅ زیردسته‌بندی از سرور حذف شد");
            }

            // حذف از state محلی
            if (isMainCategory) {
                // حذف دسته‌بندی اصلی
                setCategories(prevCategories => {
                    const newCategories = prevCategories.filter((_, index) => index !== deletingPath[0]);
                    console.log("✅ دسته‌بندی اصلی از state محلی حذف شد");
                    return newCategories;
                });
            } else {
                // حذف زیردسته‌بندی
                const parentPath = deletingPath.slice(0, -1);
                const indexToDelete = deletingPath[deletingPath.length - 1];

                setCategories(prevCategories =>
                    updateCategoryAtPath(prevCategories, parentPath, (parentCategory) => {
                        const newSubCategories = parentCategory.subCategories.filter((_, index) => index !== indexToDelete);
                        console.log("✅ زیردسته‌بندی از state محلی حذف شد");
                        return {
                            ...parentCategory,
                            subCategories: newSubCategories
                        };
                    })
                );
            }

            // بستن modal و پاک کردن state ها
            setShowDeleteModal(false);
            setDeletingPath(null);
            setError("");

            console.log("🎉 عملیات حذف با موفقیت انجام شد!");

        } catch (err) {
            console.error("❌ خطا در حذف دسته‌بندی:", err);

            // نمایش پیام خطای مفصل
            let errorMessage = "خطا در حذف دسته‌بندی. ";

            if (err.response) {
                // خطای HTTP
                const status = err.response.status;
                switch (status) {
                    case 404:
                        errorMessage += "دسته‌بندی یافت نشد.";
                        break;
                    case 403:
                        errorMessage += "شما مجوز حذف این دسته‌بندی را ندارید.";
                        break;
                    case 409:
                        errorMessage += "این دسته‌بندی شامل محصولات فعال است.";
                        break;
                    default:
                        errorMessage += `خطای سرور (کد: ${status})`;
                }
            } else if (err.request) {
                errorMessage += "مشکل در ارتباط با سرور.";
            } else {
                errorMessage += err.message || "خطای نامشخص.";
            }

            setError(errorMessage);

            // modal را نبندید تا کاربر بتواند خطا را ببیند و دوباره تلاش کند
        }
    };

    // تابع برای شروع فرآیند حذف - تصحیح شده
    const startDelete = (path) => {
        console.log("🎯 شروع فرآیند حذف برای مسیر:", path);

        // بررسی معتبر بودن path
        if (!path || !Array.isArray(path) || path.length === 0) {
            console.error("❌ مسیر نامعتبر برای حذف:", path);
            setError("خطا در تشخیص دسته‌بندی برای حذف");
            return;
        }

        // بررسی وجود دسته‌بندی
        const categoryToDelete = findCategoryAtPath(categories, path);
        if (!categoryToDelete) {
            console.error("❌ دسته‌بندی برای حذف پیدا نشد!");
            setError("دسته‌بندی مورد نظر پیدا نشد");
            return;
        }

        setDeletingPath(path);
        setShowDeleteModal(true);
        setError(""); // پاک کردن خطاهای قبلی
    };

    // مودال حذف - تصحیح شده
    const DeleteModal = () => {
        if (!showDeleteModal || !deletingPath) return null;

        const categoryToDelete = findCategoryAtPath(categories, deletingPath);

        // اگر دسته‌بندی پیدا نشد، modal را نمایش نده
        if (!categoryToDelete) {
            console.error("❌ دسته‌بندی برای نمایش در modal پیدا نشد!");
            setShowDeleteModal(false);
            setDeletingPath(null);
            return null;
        }

        const isMainCategory = deletingPath.length === 1;

        return (
            <div className="fixed inset-0 font-rubik bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">تأیید حذف</h3>
                    <p className="text-gray-600 mb-4">
                        آیا می‌خواهید {isMainCategory ? 'دسته‌بندی' : 'زیردسته‌بندی'} "{categoryToDelete.name}" را حذف کنید؟
                    </p>

                    <div className="pb-6 pt-2 flex gap-2">
                        <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                        <h2 className="text-red-600">
                            توجه کنید که با حذف این {isMainCategory ? 'دسته‌بندی' : 'زیردسته‌بندی'} تمام محصولات آن حذف خواهد شد!
                        </h2>
                    </div>

                    {/* نمایش خطا در صورت وجود */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={deleteCategoryWithProducts}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            disabled={!categoryToDelete.id} // غیرفعال کردن اگر ID نداشته باشد
                        >
                            این {isMainCategory ? 'دسته‌بندی' : 'زیردسته‌بندی'} را با تمام محصولاتش حذف کن
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


    // تابع برای کنسل کردن حذف
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingPath(null);
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





    useEffect(() => {
        const fetchCategoriesWithSubcategories = async () => {
            try {
                const allData = await getWebsiteCategories(websiteId);
                const data = allData.filter(category => category.is_active === true);

                const categoriesWithSubs = await Promise.all(
                    data.map(async (category) => {
                        try {
                            const allSubCategories = await getSubcategoriesByCategoryId(category.id);
                            const subCategories = allSubCategories.filter(sub => sub.is_active === true);
                            return {
                                ...category,
                                subCategories: subCategories.map((sub) => ({
                                    ...sub,
                                    subCategories: [],
                                    isExpanded: false,
                                })),
                            };
                        } catch (err) {
                            console.error(`❌ خطا در دریافت زیر‌دسته‌های ${category.name}:`, err);
                            return { ...category, subCategories: [] };
                        }
                    })
                );


                const enrichedCategories = await updateCategoryProductCounts(categoriesWithSubs);
                setCategories(enrichedCategories);
            } catch (err) {
                console.error("❌ خطا در دریافت دسته‌بندی‌ها:", err);
            }
        };

        fetchCategoriesWithSubcategories();
    }, [websiteId]);




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
                        {categories === null ? (
                            <div className="p-6 text-center text-gray-600 font-modam">
                                در حال دریافت اطلاعات دسته‌بندی‌ها...
                            </div>
                        ) : categories.length === 0 && !isAdding ? (
                            <div className="p-6 text-center text-gray-600 font-modam">
                                هیچ دسته‌بندی‌ای ثبت نشده است.
                            </div>
                        ) : (
                            <table className="min-w-full rounded-lg">
                                <thead className="bg-[#eac09fad] font-modam text-lg">
                                    <tr className="shadow-inner">
                                        <th className="py-5 px-8 text-right border-b text-gray-700">نام دسـتـه بـندی</th>
                                        <th className="py-5 px-8 text-right border-b text-gray-700">تعـداد محـصولات</th>
                                        <th className="py-5 px-8 text-right border-b text-gray-700">عمـلیـات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* رندر دسته‌بندی‌ها */}
                                    {categories.length > 0 && renderCategoryRows(categories)}

                                    {/* رندر فرم افزودن حتی اگه دسته‌ای وجود نداره */}
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
                        )}
                    </div>
                )}



            </div>

            {/* مودال حذف */}
            <DeleteModal />


            {/* مدال محصولات */}
            <ProductsModal />


            {/* مدال تأیید حذف محصول از دسته‌بندی */}
            {productToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-modam">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">تأیید حذف محصول</h2>
                        <p className="text-gray-600 mb-6">
                            آیا مطمئن هستید که می‌خواهید محصول "<strong>{productToDelete.name}</strong>" را حذف کنید؟
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                انصراف
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await deleteItemById(productToDelete.id);
                                        setCategoryProducts((prev) => prev.filter(p => p.id !== productToDelete.id));
                                        setProductToDelete(null);
                                        console.log("✅ محصول حذف شد");
                                    } catch (err) {
                                        console.error("❌ خطا در حذف محصول:", err);
                                        alert("خطا در حذف محصول. لطفاً دوباره تلاش کنید.");
                                    }
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
};

export default Category;