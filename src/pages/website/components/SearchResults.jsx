// 3. SearchResults.js - صفحه نمایش نتایج جستجو
import React, { useState } from 'react';
import { useSearch , SearchProvider } from './SearchContext';
import ProductCard from '../pages/Home/ProductCard';

const SearchResults = () => {
  const { searchTerm, searchResults, isSearching } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("جدیدترین");
  const productsPerPage = 12;

  const extractPrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^\d]/g, ""));
  };

  const getSortedProducts = () => {
    let sorted = [...searchResults];

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
      case "جدیدترین":
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  if (isSearching) {
    return (
      <div className="bg-white min-h-screen px-4 py-8 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <h1 className="text-2xl font-bold mb-4">در حال جستجو...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen px-4 py-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* هدر نتایج جستجو */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            نتایج جستجو برای: "{searchTerm}"
          </h1>
          <p className="text-gray-600">
            {searchResults.length} محصول یافت شد
          </p>
        </div>

        {searchResults.length > 0 ? (
          <>
            {/* مرتب‌سازی */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                  مرتب‌سازی بر اساس:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none"
                >
                  <option value="جدیدترین">جدیدترین</option>
                  <option value="ارزان‌ترین">ارزان‌ترین</option>
                  <option value="گران‌ترین">گران‌ترین</option>
                  <option value="پرفروش‌ترین">پرفروش‌ترین</option>
                  <option value="تخفیف‌دار">تخفیف‌دار</option>
                </select>
              </div>
            </div>

            {/* گرید محصولات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {paginatedProducts().map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  rating={product.rating}
                  discount={product.discount}
                  soldOut={product.soldOut}
                />
              ))}
            </div>

            {/* صفحه‌بندی */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 hover:rounded-md disabled:opacity-50"
                >
                  <span className="w-10 h-10 flex items-center justify-center">قبلی</span>
                </button>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 px-3 py-1 border rounded mt-2 ${
                      currentPage === index + 1 
                        ? "bg-black text-white" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-gray-100 hover:rounded-md disabled:opacity-50"
                >
                  <span className="w-10 h-10 flex items-center justify-center">بعدی</span>
                </button>
              </div>
            )}
          </>
        ) : searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold mb-2">هیچ محصولی یافت نشد</h2>
            <p className="text-gray-600 mb-4">
              متاسفانه برای جستجوی شما نتیجه‌ای یافت نشد
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              بازگشت
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
