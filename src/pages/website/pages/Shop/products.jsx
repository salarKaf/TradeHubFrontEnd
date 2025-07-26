

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../Home/ProductCard";
import { getWebsiteIdBySlug } from "../../../../API/website";
import { getNewestItems } from "../../../../API/Items";

const Products = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [websiteId, setWebsiteId] = useState(null);
  const [sortOption, setSortOption] = useState("جدیدترین");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!slug) return;

      try {
        const slugRes = await getWebsiteIdBySlug(slug);
        if (!slugRes.website_id) throw new Error("Website not found");

        setWebsiteId(slugRes.website_id);

        const response = await getNewestItems(slugRes.website_id, 100);

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
        setError(null);
      } catch (err) {
        console.error("خطا در بارگذاری محصولات:", err);
        setError("خطا در دریافت محصولات");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  const extractPrice = (priceStr) => parseInt(priceStr.replace(/[\D]/g, ""));

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

  if (loading) return <div className="text-center p-8">در حال بارگذاری...</div>;

  return (
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">محصولات فروشگاه</h2>
        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-1 rounded"
        >
          <option value="جدیدترین">جدیدترین</option>
          <option value="ارزان‌ترین">ارزان‌ترین</option>
          <option value="گران‌ترین">گران‌ترین</option>
          <option value="پرفروش‌ترین">پرفروش‌ترین</option>
          <option value="تخفیف‌دار">تخفیف‌دار</option>
        </select>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-12">فروشگاه هنوز محصولی ندارد.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedProducts().map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/${slug}/product/${product.id}`)}
                className="cursor-pointer hover:scale-105 transition"
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded border ${currentPage === i + 1 ? "bg-black text-white" : "bg-white"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
