import React, { useState } from "react";
import ProductCard from "../Home/ProductCard"; // مطمئن شو مسیر درست باشه

const Products = () => {
    const [openCategory, setOpenCategory] = useState(null);
    const [priceFilter, setPriceFilter] = useState(100);
    const [sortOption, setSortOption] = useState("جدیدترین");

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;


    const allProducts = Array.from({ length: 27 }).map((_, i) => ({
        id: i + 1,
        name: `محصول شماره ${i + 1}`,
        price: `${(i + 1) * 100_000} تومان`,
        rating: Math.floor(Math.random() * 5) + 1,
        discount: i % 5 === 0 ? "10%" : null,
        soldOut: i % 7 === 0,
        createdAt: new Date(Date.now() - i * 10000000),
    }));
    const extractPrice = (priceStr) => {
        return parseInt(priceStr.replace(/[^\d]/g, ""));
    };

    const paginatedProducts = () => {
        const sorted = getSortedProducts();
        const start = (currentPage - 1) * productsPerPage;
        return sorted.slice(start, start + productsPerPage);
    };


    const getSortedProducts = () => {
        let sorted = [...allProducts];

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
    const totalPages = Math.ceil(getSortedProducts().length / productsPerPage);

    const categories = [
        {
            title: "دسته‌بندی اول",
            sub: ["زیر دسته ۱", "زیر دسته ۲"]
        },
        {
            title: "دسته‌بندی دوم",
            sub: ["زیر دسته A", "زیر دسته B"]
        },
        {
            title: "دسته‌بندی سوم",
            sub: []
        }
    ];

    return (
        <div className="bg-white min-h-screen px-4 py-8 mb-64">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

                {/* Sidebar */}
                <aside className="lg:col-span-1 pr-1">
                    <h2 className="text-xl font-bold mb-6">دسته بندی‌ها</h2>

                    {categories.map((cat, index) => (
                        <div key={index} className="border-b pb-2 mb-2">
                            <button
                                className="w-full text-right font-semibold flex justify-between items-center"
                                onClick={() => setOpenCategory(openCategory === index ? null : index)}
                            >
                                {cat.title}
                                <span>{openCategory === index ? "▲" : "▼"}</span>
                            </button>
                            {openCategory === index && cat.sub.length > 0 && (
                                <ul className="pr-4 mt-2 space-y-1 text-sm text-gray-600">
                                    {cat.sub.map((subItem, i) => (
                                        <li key={i} className="cursor-pointer hover:text-black">{subItem}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    {/* فیلتر قیمت */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-2">فیلتر قیمت</h3>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="w-full"
                        />
                        <p className="text-sm text-right mt-1">۰ - {priceFilter} میلیون</p>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="lg:col-span-3">


                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 mr-4 mb-5 mt-20">
                            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                                مرتب‌سازی بر اساس:
                            </label>
                            <select
                                id="sort"
                                value={sortOption}
                                onChange={(e) => {
                                    setSortOption(e.target.value);
                                    setCurrentPage(1); // ریست صفحه بعد از تغییر مرتب‌سازی
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none"
                            >
                                <option value="جدیدترین"> جدیدترین</option>
                                <option value="ارزان‌ترین"> ارزان‌ترین</option>
                                <option value="گران‌ترین"> گران‌ترین</option>
                                <option value="پرفروش‌ترین"> پرفروش‌ترین</option>
                                <option value="تخفیف‌دار">تخفیف‌دار</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
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



                    <div className="flex justify-center mt-12 gap-1">

                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="p-2  hover:bg-gray-100 hover:rounded-md"
                        >
                            <img src="/public/website/icons8-next-50 2.png" alt="قبلی" className="w-10 h-10 rotate-180" />
                        </button>


                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-10 h-10 px-3 py-1 border rounded mt-2 ${currentPage === index + 1 ? "bg-black text-white" : "hover:bg-gray-100 "}`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        {/* بعدی */}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className="p-2  hover:bg-gray-100 hover:rounded-md"
                        >
                            <img src="/public/website/icons8-next-50 2.png" alt="بعدی" className="w-10 h-10 " />
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Products;
