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
import { getItemsByCategoryId, deleteItemById } from "../../../API/Items"; // اضافه کن بالا


import { getItemsBySubcategoryId } from "../../../API/Items";

const updateCategoryProductCounts = async (categories, isSub = false) => {
    const updatedCategories = await Promise.all(
        categories.map(async (category) => {
            let productCount = 0;

            try {
                if (isSub) {
                    const items = await getItemsBySubcategoryId(category.id);
                    productCount = Array.isArray(items) ? items.length : 0;
                } else {
                    const countResponse = await getItemCountByCategoryId(category.id);
                    productCount = typeof countResponse === 'number' ? countResponse : (countResponse.count || 0);
                }
            } catch (err) {
                console.error(`❌ خطا در گرفتن تعداد محصولات برای ${category.name}:`, err);
            }

            const updatedSubCategories = category.subCategories?.length
                ? await updateCategoryProductCounts(category.subCategories, true)
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

    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();



    const [showProductsModal, setShowProductsModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);


    const [categories, setCategories] = useState(null); 

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


    const [categoryProducts, setCategoryProducts] = useState([]);

    const viewCategoryProducts = async (category) => {

        try {
            let items = [];

            const isSubcategory = category.subCategories === undefined;

            if (category.parent_category_id) {
                items = await getItemsBySubcategoryId(category.id);
            } else {
                items = await getItemsByCategoryId(category.id);
            }


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



    const ProductsModal = () => {
        if (!showProductsModal || !selectedCategory) return null;

        const products = categoryProducts || [];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-modam p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaBox className="text-xl sm:text-2xl" />
                            <div>
                                <h2 className="text-lg sm:text-2xl font-bold">محصولات {selectedCategory.name}</h2>
                                <p className="text-blue-100 mt-1 text-sm sm:text-base">مجموع {products.length} محصول</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowProductsModal(false)}
                            className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                        >
                            <FaTimes className="text-lg sm:text-xl" />
                        </button>
                    </div>

                    <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <FaBox className="text-4xl sm:text-6xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-base sm:text-lg">هیچ محصولی در این دسته‌بندی وجود ندارد</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.map((product) => (
                                    <div key={product.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                                        <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-3 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                    <FaBox className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                                    <p className="text-sm text-gray-500">{product.category}</p>
                                                </div>
                                            </div>


                                            <div className="col-span-2 flex items-center gap-2">
                                                <FaTag className="text-orange-500" />
                                                <span className="font-medium text-gray-900">{product.price} تومان</span>
                                            </div>

                                            <div className="col-span-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.status === 'فعال'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </div>

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

                                        <div className="lg:hidden">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FaBox className="text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                                                    <p className="text-sm text-gray-500 truncate">{product.category}</p>
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
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
                                            
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">

                                                <div className="flex items-center gap-2">
                                                    <FaTag className="text-orange-500" />
                                                    <span className="font-medium text-gray-900">{product.price} تومان</span>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.status === 'فعال'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {product.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <FaBox className="text-blue-500" />
                                <span>تعداد محصولات: {products.length}</span>
                            </div>

                        </div>
                        <button
                            onClick={() => setShowProductsModal(false)}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
                        >
                            بستن
                        </button>
                    </div>
                </div>
            </div>
        );
    };



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


    const toggleExpanded = async (path) => {
        const category = findCategoryAtPath(categories, path);

        if (!category.isExpanded && (!category.subCategories || category.subCategories.length === 0)) {
            try {
                const allSubcategories = await getSubcategoriesByCategoryId(category.id);
                const subcategories = allSubcategories.filter(sub => sub.is_active === true);
                const updatedSubs = await Promise.all(
                    subcategories.map(async (sub) => {
                        let count = 0;
                        try {
                            const items = await getItemsBySubcategoryId(sub.id);
                            count = Array.isArray(items) ? items.length : 0;
                        } catch (e) {
                            console.error("❌ خطا در گرفتن محصولات زیردسته", sub.name, e);
                        }

                        return {
                            ...sub,
                            subCategories: [],
                            isExpanded: false,
                            productsCount: count,
                        };
                    })
                );


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
            setCategories((prev) =>
                updateCategoryAtPath(prev, path, (cat) => ({
                    ...cat,
                    isExpanded: !cat.isExpanded,
                }))
            );
        }
    };




    const addCategory = () => {
        setIsAdding(true);
        setAddingSubTo(null);
        setError("");
    };


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
                id: res.id, 
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



    const cancelAddCategory = () => {
        setNewCategory("");
        setIsAdding(false);
        setError("");
    };

    const startAddingSubCategory = (path) => {
        setAddingSubTo(path);
        setIsAdding(false);
        setError("");
    };

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


    const saveSubCategory = async (path) => {
        if (!newSubCategory.trim()) {
            setError("نام زیردسته‌بندی نمی‌تواند خالی باشد");
            return;
        }

        try {
            const parentCategory = findCategoryAtPath(categories, path);

            const created = await createWebsiteSubcategory(parentCategory.id, newSubCategory);

            const allUpdatedSubcategories = await getSubcategoriesByCategoryId(parentCategory.id);
            const updatedSubcategories = allUpdatedSubcategories.filter(sub => sub.is_active === true);
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



    const cancelAddSubCategory = () => {
        setNewSubCategory("");
        setAddingSubTo(null);
        setError("");
    };

    const startEditing = (path) => {
        const category = findCategoryAtPath(categories, path);
        setEditingPath(path);
        setEditingValue(category.name);
        setError("");
    };

    const saveEdit = async () => {
        if (!editingValue.trim()) {
            setError("نام دسته‌بندی نمی‌تواند خالی باشد");
            return;
        }

        const targetCategory = findCategoryAtPath(categories, editingPath);
        const isSubCategory = editingPath.length > 1;

        try {
            if (isSubCategory) {
                await editSubCategory({
                    subcategory_id: targetCategory.id,
                    name: editingValue,
                    website_id: websiteId,
                });
            } else {
                await editWebsiteCategory({
                    category_id: targetCategory.id, 
                    website_id: websiteId,
                    name: editingValue,
                });
            }

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




    const cancelEdit = () => {
        setEditingPath(null);
        setEditingValue("");
        setError("");
    };



    const deleteCategoryWithProducts = async () => {
        console.log("🔍 شروع عملیات حذف...");
        console.log("📍 deletingPath:", deletingPath);
        console.log("📍 categories:", categories);

        if (!deletingPath || !Array.isArray(deletingPath) || deletingPath.length === 0) {
            console.error("❌ مسیر حذف نامعتبر است!");
            setError("خطا در تشخیص دسته‌بندی برای حذف");
            return;
        }

        if (!categories || !Array.isArray(categories)) {
            console.error("❌ لیست دسته‌بندی‌ها نامعتبر است!");
            setError("خطا در دریافت اطلاعات دسته‌بندی‌ها");
            return;
        }

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
            const isMainCategory = deletingPath.length === 1;

            console.log(`🔥 ${isMainCategory ? 'حذف دسته‌بندی اصلی' : 'حذف زیردسته‌بندی'} با ID: ${categoryToDelete.id}`);

            if (isMainCategory) {
                await deleteWebsiteCategory(categoryToDelete.id);
                console.log("✅ دسته‌بندی اصلی از سرور حذف شد");
            } else {
                await deleteWebsiteSubcategory(categoryToDelete.id);
                console.log("✅ زیردسته‌بندی از سرور حذف شد");
            }

            if (isMainCategory) {
                setCategories(prevCategories => {
                    const newCategories = prevCategories.filter((_, index) => index !== deletingPath[0]);
                    console.log("✅ دسته‌بندی اصلی از state محلی حذف شد");
                    return newCategories;
                });
            } else {
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

            setShowDeleteModal(false);
            setDeletingPath(null);
            setError("");

            console.log("🎉 عملیات حذف با موفقیت انجام شد!");

        } catch (err) {
            console.error("❌ خطا در حذف دسته‌بندی:", err);

            let errorMessage = "خطا در حذف دسته‌بندی. ";

            if (err.response) {
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

        }
    };

    const startDelete = (path) => {
        console.log("🎯 شروع فرآیند حذف برای مسیر:", path);

        if (!path || !Array.isArray(path) || path.length === 0) {
            console.error("❌ مسیر نامعتبر برای حذف:", path);
            setError("خطا در تشخیص دسته‌بندی برای حذف");
            return;
        }

        const categoryToDelete = findCategoryAtPath(categories, path);
        if (!categoryToDelete) {
            console.error("❌ دسته‌بندی برای حذف پیدا نشد!");
            setError("دسته‌بندی مورد نظر پیدا نشد");
            return;
        }

        setDeletingPath(path);
        setShowDeleteModal(true);
        setError(""); 
    };

    const DeleteModal = () => {
        if (!showDeleteModal || !deletingPath) return null;

        const categoryToDelete = findCategoryAtPath(categories, deletingPath);

        if (!categoryToDelete) {
            console.error("❌ دسته‌بندی برای نمایش در modal پیدا نشد!");
            setShowDeleteModal(false);
            setDeletingPath(null);
            return null;
        }

        const isMainCategory = deletingPath.length === 1;

        return (
            <div className="fixed inset-0 font-rubik bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-md w-full">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">تأیید حذف</h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        آیا می‌خواهید {isMainCategory ? 'دسته‌بندی' : 'زیردسته‌بندی'} "{categoryToDelete.name}" را حذف کنید؟
                    </p>

                    <div className="pb-6 pt-2 flex gap-2">
                        <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <h2 className="text-red-600 text-sm sm:text-base">
                            توجه کنید که با حذف این {isMainCategory ? 'دسته‌بندی' : 'زیردسته‌بندی'} تمام محصولات آن حذف خواهد شد!
                        </h2>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={deleteCategoryWithProducts}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
                            disabled={!categoryToDelete.id} // غیرفعال کردن اگر ID نداشته باشد
                        >
                            این {isMainCategory ? 'دسته‌بندی' : 'زیردسته‌بندی'} را با تمام محصولاتش حذف کن
                        </button>

                        <button
                            onClick={cancelDelete}
                            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                        >
                            کنسل
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingPath(null);
    };



    const renderCategoryRows = (categories, level = 0, parentPath = []) => {
        const rows = [];

        categories.forEach((category, index) => {
            const currentPath = [...parentPath, index];
            const hasSubCategories = category.subCategories && category.subCategories.length > 0;
            const paddingLeft = level * 20;

            rows.push(
                <tr key={`category-${category.id}`} className="border-b hover:bg-gray-50 transition-colors font-modam shadow-sm ">
                    <td className="py-2 px-2 sm:px-4" style={{ paddingRight: `${paddingLeft + 16}px` }}>
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
                                    className="px-2 py-1 border border-gray-300 rounded-md flex-1 text-sm sm:text-base"
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
                                <span className="text-sm sm:text-base truncate">{category.name}</span>
                            </div>
                        )}
                        {error && editingPath && JSON.stringify(editingPath) === JSON.stringify(currentPath) && (
                            <div className="text-red-500 text-xs sm:text-sm mt-1">{error}</div>
                        )}
                    </td>
                    <td className="py-5 px-2 sm:px-10 text-right">
                        <span className="text-sm sm:text-base">{category.productsCount} محصول</span>
                    </td>
                    <td className="py-5 px-2 sm:px-4 text-right">
                        {editingPath && JSON.stringify(editingPath) === JSON.stringify(currentPath) ? (
                            <div className="flex items-center gap-1 sm:gap-2 justify-end">
                                <button
                                    onClick={saveEdit}
                                    className="bg-green-700 text-white py-1 px-2 sm:px-3 rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
                                >
                                    ذخیره
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="bg-red-700 text-white py-1 px-2 sm:px-3 rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
                                >
                                    انصراف
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                <button
                                    onClick={() => startDelete(currentPath)}
                                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                                >
                                    <FaTrashAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                    onClick={() => startEditing(currentPath)}
                                    className="text-yellow-500 hover:text-yellow-700 transition-colors p-1"
                                >
                                    <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                    onClick={() => viewCategoryProducts(category)}
                                    className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                                >
                                    <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                    onClick={() => startAddingSubCategory(currentPath)}
                                    className="text-green-500 hover:text-green-700 transition-colors text-xs sm:text-sm px-1 sm:px-2 py-1 rounded hidden sm:block"
                                >
                                    + زیردسته
                                </button>
                                <button
                                    onClick={() => startAddingSubCategory(currentPath)}
                                    className="text-green-500 hover:text-green-700 transition-colors p-1 sm:hidden"
                                >
                                    <FaPlus className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </td>
                </tr>
            );

            if (addingSubTo && JSON.stringify(addingSubTo) === JSON.stringify(currentPath)) {
                rows.push(
                    <tr key={`add-sub-${category.id}`} className="bg-blue-50 font-modam">
                        <td className="py-2 px-2 sm:px-4" style={{ paddingRight: `${paddingLeft + 36}px` }}>
                            <input
                                type="text"
                                value={newSubCategory}
                                onChange={(e) => setNewSubCategory(e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded-md w-full text-sm sm:text-base"
                                placeholder="نام زیردسته‌بندی"
                                autoFocus
                            />
                            {error && <div className="text-red-500 text-xs sm:text-sm mt-1 font-modam">{error}</div>}
                        </td>

                        <td className="py-2 px-2 sm:px-4">
                            <div className="flex gap-1 sm:gap-2 justify-end">
                                <button
                                    onClick={() => saveSubCategory(currentPath)}
                                    className="bg-green-700 font-modam text-white py-1 px-2 sm:px-3 rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
                                >
                                    ذخیره
                                </button>
                                <button
                                    onClick={cancelAddSubCategory}
                                    className="bg-red-700 font-modam text-white py-1 px-2 sm:px-3 rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
                                >
                                    انصراف
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            }

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
            <div className="p-2 sm:p-4 mt-4 max-w-7xl">
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-3 font-modam">
                    <div className="flex items-center gap-3">
                        <img
                            className="w-7 h-7 sm:w-9 sm:h-9"
                            src="/SellerPanel/Products/icons8-category-50(1).png"
                            alt="category"
                        />
                        <h2 className="text-xl sm:text-2xl font-semibold">دسته بندی ها</h2>

                        <div className="flex justify-between items-center mb-4 mt-5">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-xl text-[#4D4D4D] hover:text-black transition-colors">
                                {isOpen ? (
                                    <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={addCategory}
                        className="w-full sm:w-64 sm:mr-auto bg-[#1e202d] font-modam font-medium text-sm sm:text-lg h-12 sm:h-auto text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full shadow-md"
                    >
                        + افزودن دسته بندی جدید
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"></div>
                </div>

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
                                <thead className="bg-[#eac09fad] font-modam text-base sm:text-lg">
                                    <tr className="shadow-inner">
                                        <th className="py-3 sm:py-5 px-4 sm:px-8 text-right border-b text-gray-700">نام دسـتـه بـندی</th>
                                        <th className="py-3 sm:py-5 px-4 sm:px-8 text-right border-b text-gray-700 hidden sm:table-cell">تعـداد محـصولات</th>
                                        <th className="py-3 sm:py-5 px-4 sm:px-8 text-right border-b text-gray-700 sm:hidden">تعـداد</th>
                                        <th className="py-3 sm:py-5 px-4 sm:px-8 text-right border-b text-gray-700">عمـلیـات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length > 0 && renderCategoryRows(categories)}

                                    {isAdding && (
                                        <tr className="bg-green-50 font-modam">
                                            <td className="py-2 px-2 sm:px-4">
                                                <input
                                                    type="text"
                                                    value={newCategory}
                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded-md w-full text-sm sm:text-base"
                                                    placeholder="نام دسته بندی"
                                                    autoFocus
                                                />
                                                {error && <div className="text-red-500 text-xs sm:text-sm mt-1">{error}</div>}
                                            </td>
                                            <td className="py-3 px-2 sm:px-4">
                                                <span className="text-sm sm:text-base">0 محصول</span>
                                            </td>
                                            <td className="py-3 px-2 sm:px-4">
                                                <div className="flex gap-1 sm:gap-2 justify-end">
                                                    <button
                                                        onClick={saveCategory}
                                                        className="bg-green-700 font-modam text-white py-1 px-2 sm:px-3 rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
                                                    >
                                                        ذخیره
                                                    </button>
                                                    <button
                                                        onClick={cancelAddCategory}
                                                        className="bg-red-700 font-modam text-white py-1 px-2 sm:px-3 rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm"
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

            <DeleteModal />


            <ProductsModal />


            {productToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-modam p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-md">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">تأیید حذف محصول</h2>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">
                            آیا مطمئن هستید که می‌خواهید محصول "<strong>{productToDelete.name}</strong>" را حذف کنید؟
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-gray-600 text-sm sm:text-base"
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
                                className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-700 text-sm sm:text-base"
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