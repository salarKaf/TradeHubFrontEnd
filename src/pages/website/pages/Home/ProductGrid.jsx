import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getWebsiteIdBySlug } from "../../../../API/website.js";
import { getNewestItems } from "../../../../API/Items"; // فرض می‌کنم این path درسته

export default function ProductGrid() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [websiteId, setWebsiteId] = useState(null);

  // Sample products data به عنوان fallback
  const defaultProducts = [
    {
      id: 1,
      name: "لپ تاپ MacBook Pro",
      price: "45,000,000 تومان",
      image: "",
      rating: 5,
      discount: "10%"
    },
    {
      id: 2,
      name: "گوشی iPhone 15",
      price: "35,000,000 تومان",
      image: "",
      rating: 5
    },
    {
      id: 3,
      name: "هدفون AirPods Pro",
      price: "8,500,000 تومان",
      image: "",
      rating: 4,
      discount: "15%"
    },
    {
      id: 4,
      name: "ساعت Apple Watch",
      price: "12,000,000 تومان",
      image: "",
      rating: 5
    },
    {
      id: 5,
      name: "تبلت iPad Air",
      price: "22,000,000 تومان",
      image: "",
      rating: 4,
      discount: "8%"
    },
    {
      id: 6,
      name: "کیبورد مکانیکی",
      price: "3,500,000 تومان",
      image: "",
      rating: 5
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!slug) {
        console.log('❌ No slug found in ProductGrid');
        setLoading(false);
        return;
      }

      try {
        console.log('🚀 ProductGrid: Getting website ID for slug:', slug);

        // مرحله 1: گرفتن websiteId از slug
        const slugResponse = await getWebsiteIdBySlug(slug);

        if (!slugResponse || !slugResponse.website_id) {
          throw new Error('Website not found for slug: ' + slug);
        }

        console.log('✅ ProductGrid: Website ID found:', slugResponse.website_id);
        setWebsiteId(slugResponse.website_id);

        // مرحله 2: گرفتن محصولات جدید
        const productsData = await getNewestItems(slugResponse.website_id, 6);
        console.log('🔍 Debug Info:', {
          slug,
          websiteId: slugResponse.website_id,
          productsCount: productsData.length,
        });

        if (!productsData || productsData.length === 0) {
          console.log('⚠️ No products found');
          setProducts([]);
        } else {
          console.log('✅ ProductGrid: Products received:', productsData);

          // تبدیل داده‌های API به فرمت مورد نیاز ProductCard
          const formattedProducts = productsData.map((item, index) => ({
            id: item.item_id || index + 1,
            name: item.name || "محصول بدون نام",
            price: item.price ? `${parseInt(item.price).toLocaleString('fa-IR')} تومان` : "قیمت نامشخص",
            image: item.image_url || "", // فرض می‌کنم image_url وجود داره یا خالیه
            rating: 5, // چون rating تو API نیست، پیش‌فرض 5 می‌ذاریم
            discount: item.discount_active && item.discount_percent > 0 ? `${item.discount_percent}%` : undefined,
            originalPrice: item.discount_active && item.discount_price ?
              `${parseInt(item.discount_price).toLocaleString('fa-IR')} تومان` : undefined,
            isAvailable: item.is_available,
            stock: item.stock,
            categoryName: item.category_name,
            subcategoryName: item.subcategory_name,
            description: item.description
          }));

          setProducts(formattedProducts);
        }

        setError(null);

      } catch (err) {
        console.error('❌ Error in ProductGrid:', err);
        setError(err.message);
        // در صورت خطا، از محصولات پیش‌فرض استفاده می‌کنیم
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen px-4 py-12">
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
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">جدیدترین محصولات</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>

        {/* نمایش پیام خطا در صورت وجود */}
        {error && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-sm">
            خطا در بارگذاری محصولات - محصولات نمونه نمایش داده می‌شود
          </div>
        )}
      </div>

      {/* Products Grid - 3 columns */}
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
                name={product.name}
                price={product.originalPrice || product.price}
                image={product.image}
                rating={product.rating}
                discount={product.discount}
                product={product}
              />
            ))
          )}
        </div>

      </div>

      {/* View All Button */}
      {products.length > 0 && (
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            مشاهده همه محصولات
          </button>
        </div>
      )}


    </div>
  );
}