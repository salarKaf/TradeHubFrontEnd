import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getWebsiteIdBySlug } from "../../../../API/website.js";
import { getNewestItems } from "../../../../API/Items";

export default function ProductGrid() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [websiteId, setWebsiteId] = useState(null);

  const defaultProducts = [];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!slug) {
        console.log('❌ No slug found in ProductGrid');
        setLoading(false);
        return;
      }

      try {
        console.log('🚀 ProductGrid: Getting website ID for slug:', slug);
        const slugResponse = await getWebsiteIdBySlug(slug);

        if (!slugResponse || !slugResponse.website_id) {
          throw new Error('Website not found for slug: ' + slug);
        }

        console.log('✅ ProductGrid: Website ID found:', slugResponse.website_id);
        setWebsiteId(slugResponse.website_id);

        const productsData = await getNewestItems(slugResponse.website_id, 6);
        console.log('✅ ProductGrid: Products received:', productsData);
        const availableItems = productsData.filter(item => item.is_available === true);

        const formattedProducts = availableItems.map((item, index) => ({
          id: item.item_id || index + 1,
          name: item.name || "محصول بدون نام",
          price: item.price ? parseInt(item.price) : 0,
          image: item.image_url || "",
          rating: 5,
          discount: item.discount_active && item.discount_percent > 0 ? item.discount_percent : null,
          discountedPrice: item.discount_active && item.discount_price ? parseInt(item.discount_price) : null,
        }));



        setProducts(formattedProducts);
        setError(null);

      } catch (err) {
        console.error('❌ Error in ProductGrid:', err);
        setError(err.message);
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  const handleProductClick = (productId) => {
    if (slug) {
      navigate(`/${slug}/product/${productId}`);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  // callback برای وقتی محصول به سبد خرید اضافه میشه
  const handleAddToCart = (productId, result) => {
    console.log(`محصول ${productId} به سبد خرید اضافه شد:`, result);
    // اینجا می‌تونی state سبد خرید رو آپدیت کنی یا notification نشون بدی
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 font-Kahroba to-white min-h-screen px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">جدیدترین محصولات</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 font-Kahroba to-white min-h-screen px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">جدیدترین محصولات</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>

        {error && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-sm">
            خطا در بارگذاری محصولات - محصولات نمونه نمایش داده می‌شود
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-6 justify-items-center">
          {products.length === 0 ? (
            <div className="text-center col-span-full text-gray-600 font-medium mt-8">
              هنوز هیچ محصولی در فروشگاه درج نشده است.
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                websiteId={websiteId}
                name={product.name}
                price={product.price}
                discountedPrice={product.discountedPrice}
                image={product.image}
                rating={product.rating}
                discount={product.discount}
                product={product}
                onClick={handleProductClick}
                onAddToCart={handleAddToCart}
              />

            ))
          )}
        </div>
      </div>

      {products.length > 0 && (
        <div className="text-center mt-16">
          <button
            onClick={() => slug && navigate(`/${slug}/shop`)}
            className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0f172a] text-white px-8 py-3 rounded-full font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            مشاهده همه محصولات
          </button>

        </div>
      )}
    </div>
  );
}