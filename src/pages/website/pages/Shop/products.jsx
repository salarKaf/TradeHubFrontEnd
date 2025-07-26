import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../Home/ProductCard";
import { getWebsiteIdBySlug } from "../../../../API/website";
import { getNewestItems, getItemsByCategoryId, getItemsBySubcategoryId } from "../../../../API/Items";
import { getWebsiteCategories, getSubcategoriesByCategoryId, getItemCountByCategoryId } from "../../../../API/category";
import { FaChevronDown, FaChevronUp, FaFilter, FaExclamationTriangle } from "react-icons/fa";

const Products = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [websiteId, setWebsiteId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [categoryItemCounts, setCategoryItemCounts] = useState({});
    const [openCategory, setOpenCategory] = useState(null);
    const [priceFilter, setPriceFilter] = useState(100);
    const [sortOption, setSortOption] = useState("جدیدترین");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState(null); // 'category' or 'subcategory' and id
    const productsPerPage = 9;

    // Fetch website ID and categories
    useEffect(() => {
        // در تابع fetchWebsiteIdAndCategories:
        const fetchWebsiteIdAndCategories = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                const slugRes = await getWebsiteIdBySlug(slug);
                if (!slugRes.website_id) throw new Error("Website not found");

                setWebsiteId(slugRes.website_id);

                const categoriesRes = await getWebsiteCategories(slugRes.website_id);
                setCategories(categoriesRes);

                // دریافت زیردسته‌ها برای همه دسته‌ها به صورت همزمان
                const subcats = {};
                const counts = {};

                // در تابع fetchWebsiteIdAndCategories
                await Promise.all(categoriesRes.map(async (cat) => {
                    try {
                        const countRes = await getItemCountByCategoryId(cat.id);
                        // اصلاح این خط
                        counts[cat.id] = typeof countRes === 'object' ? countRes.count : countRes;

                        const subcategoriesRes = await getSubcategoriesByCategoryId(cat.id);
                        if (subcategoriesRes && subcategoriesRes.length > 0) {
                            subcats[cat.id] = subcategoriesRes;

                            await Promise.all(subcategoriesRes.map(async (subcat) => {
                                const subCountRes = await getItemCountByCategoryId(subcat.id);
                                // اصلاح این خط
                                subcat.item_count = typeof subCountRes === 'object' ? subCountRes.count : subCountRes;
                            }));
                        }
                    } catch (err) {
                        console.error(`Error loading data for category ${cat.id}:`, err);
                        counts[cat.id] = 0;
                    }
                }));

                setSubcategories(subcats);
                setCategoryItemCounts(counts);
                await loadProducts(slugRes.website_id);
            } catch (err) {
                console.error("خطا در بارگذاری محصولات:", err);
                setError(
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded">
                        <div className="flex items-center">
                            <FaExclamationTriangle className="text-red-500 mr-2" />
                            <h3 className="text-red-800 font-medium">خطا در دریافت اطلاعات</h3>
                        </div>
                        <p className="text-red-700 text-sm mt-1">
                            {err.message || "مشکلی در ارتباط با سرور پیش آمده است. لطفاً دوباره تلاش کنید."}
                        </p>
                    </div>
                );
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWebsiteIdAndCategories();
    }, [slug]);

    const loadProducts = async (websiteId, categoryId = null, subcategoryId = null) => {
        try {
            let response;
            if (subcategoryId) {
                response = await getItemsBySubcategoryId(subcategoryId);
                setActiveFilter({ type: 'subcategory', id: subcategoryId });
            } else if (categoryId) {
                response = await getItemsByCategoryId(categoryId);
                setActiveFilter({ type: 'category', id: categoryId });
            } else {
                response = await getNewestItems(websiteId, 100);
                setActiveFilter(null);
            }

            // مطمئن شوید response یک آرایه است
            if (!Array.isArray(response)) {
                response = [];
            }

            const formatted = response.map((item, index) => ({
                id: item.item_id || index,
                name: item.name,
                price: item.price ? `${parseInt(item.price).toLocaleString('fa-IR')} تومان` : "",
                image: item.image_url || "",
                rating: 5,
                discount: item.discount_active && item.discount_percent ? `${item.discount_percent}%` : undefined,
                originalPrice: item.discount_active && item.discount_price ? `${parseInt(item.discount_price).toLocaleString('fa-IR')} تومان` : undefined,
                soldOut: !item.is_available
            }));

            setProducts(formatted);
            setCurrentPage(1);
        } catch (err) {
            console.error("Error loading products:", err);
            setProducts([]);
        }
    };

    // Fetch subcategories when category is toggled
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (openCategory) {
                try {
                    const subcategoriesRes = await getSubcategoriesByCategoryId(openCategory);
                    setSubcategories(prev => ({
                        ...prev,
                        [openCategory]: subcategoriesRes,
                    }));
                } catch (err) {
                    console.error("Error fetching subcategories:", err);
                }
            }
        };

        fetchSubcategories();
    }, [openCategory]);

    const handleProductClick = (productId) => {
        if (slug) {
            navigate(`/${slug}/product/${productId}`);
        } else {
            navigate(`/product/${productId}`);
        }
    };

    const extractPrice = (priceStr) => parseInt(priceStr.replace(/[^\d]/g, ""));

    const getSortedProducts = () => {
        let sorted = [...products];
        switch (sortOption) {
            case "ارزان‌ترین":
                sorted.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
                break;
            case "گران‌ترین":
                sorted.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
                break;
            case "تخفیف‌دار":
                sorted = sorted.filter((item) => item.discount);
                break;
            case "پرفروش‌ترین":
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }
        return sorted;
    };

    const paginatedProducts = () => {
        const sorted = getSortedProducts();
        const start = (currentPage - 1) * productsPerPage;
        return sorted.slice(start, start + productsPerPage);
    };

    const totalPages = Math.ceil(getSortedProducts().length / productsPerPage);

    const toggleCategory = (categoryId) => {
        setOpenCategory(prev => (prev === categoryId ? null : categoryId));
    };

    const handleCategoryClick = async (categoryId) => {
        await loadProducts(websiteId, categoryId);
    };

    const handleSubcategoryClick = async (subcategoryId) => {
        await loadProducts(websiteId, null, subcategoryId);
    };

    const handleResetFilters = () => {
        loadProducts(websiteId);
    };

    if (loading) return (
        <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">در حال بارگذاری...</p>
        </div>
    );

    return (
        <div className="bg-white min-h-screen px-4 py-8 mb-64">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {/* Sidebar */}
                <aside className="lg:col-span-1 pr-1">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <FaFilter className="ml-2" />
                            فیلترها
                        </h2>

                        {activeFilter && (
                            <div className="mb-4">
                                <button
                                    onClick={handleResetFilters}
                                    className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full flex items-center"
                                >
                                    حذف فیلترها
                                </button>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4">دسته‌بندی‌ها</h3>

                            {categories.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">هیچ دسته‌بندی‌ای وجود ندارد</p>
                            ) : (
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="border-b border-gray-100 pb-2">
                                            <button
                                                className={`w-full text-right font-medium flex justify-between items-center p-2 rounded hover:bg-gray-100 ${activeFilter?.type === 'category' && activeFilter.id === cat.id ? 'bg-blue-50 text-blue-600' : ''
                                                    }`}
                                                onClick={() => handleCategoryClick(cat.id)}
                                            >
                                                <div className="flex items-center">
                                                    <span>{cat.name}</span>
                                                    <span className="text-xs bg-gray-200 rounded-full px-2 py-1 mr-2">
                                                        {categoryItemCounts[cat.id] !== undefined ? categoryItemCounts[cat.id] : '...'}
                                                    </span>

                                                </div>
                                                {/* تغییر در این بخش */}
                                                {(subcategories[cat.id] && subcategories[cat.id].length > 0) && (
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCategory(cat.id);
                                                        }}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        {openCategory === cat.id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                                    </span>
                                                )}
                                            </button>

                                            {/* تغییر در این بخش */}
                                            {openCategory === cat.id && subcategories[cat.id] && subcategories[cat.id].length > 0 && (
                                                <ul className="pr-4 mt-1 space-y-1 text-sm text-gray-600">
                                                    {subcategories[cat.id].map((subItem) => (
                                                        <li
                                                            key={subItem.id}
                                                            className={`cursor-pointer p-2 rounded hover:bg-gray-100 flex justify-between items-center ${activeFilter?.type === 'subcategory' && activeFilter.id === subItem.id ? 'bg-blue-50 text-blue-600' : ''
                                                                }`}
                                                            onClick={() => handleSubcategoryClick(subItem.id)}
                                                        >
                                                            <span>{subItem.name}</span>

                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* فیلتر قیمت */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">محدوده قیمت</h3>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                                <span>۰ تومان</span>
                                <span>{priceFilter} میلیون تومان</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="lg:col-span-3">
                    {error && <div className="mb-6">{error}</div>}

                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {activeFilter ?
                                `محصولات ${activeFilter.type === 'category' ?
                                    categories.find(c => c.id === activeFilter.id)?.name :
                                    subcategories[openCategory]?.find(s => s.id === activeFilter.id)?.name}` :
                                'همه محصولات'}
                        </h1>

                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                                مرتب‌سازی:
                            </label>
                            <select
                                id="sort"
                                value={sortOption}
                                onChange={(e) => {
                                    setSortOption(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="جدیدترین">جدیدترین</option>
                                <option value="ارزان‌ترین">ارزان‌ترین</option>
                                <option value="گران‌ترین">گران‌ترین</option>
                                <option value="پرفروش‌ترین">پرفروش‌ترین</option>
                                <option value="تخفیف‌دار">تخفیف‌دار</option>
                            </select>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-block bg-gray-100 p-6 rounded-full mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-700">محصولی یافت نشد</h3>
                            <p className="text-gray-500 mt-1">هیچ محصولی در این دسته‌بندی وجود ندارد.</p>
                            {activeFilter && (
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    مشاهده همه محصولات
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {paginatedProducts().map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                                    >
                                        <ProductCard {...product} />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8 gap-1">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 rounded border bg-white disabled:opacity-50"
                                    >
                                        قبلی
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-4 py-2 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 rounded border bg-white disabled:opacity-50"
                                    >
                                        بعدی
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;