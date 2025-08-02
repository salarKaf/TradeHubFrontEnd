import React from 'react';
import { Heart } from 'lucide-react';

const InterestsSection = ({
  loadingFavorites,
  favoriteProducts,
  ProductCard,
  handleProductClick,
  handleAddToCart,
  handleFavoriteChange
}) => {
  return (
    <section id="interests-section " className="scroll-mt-24 font-Kahroba">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gray-800 rounded-xl">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">علاقه‌مندی‌ها</h2>
        <span className="text-sm text-gray-500">({favoriteProducts.length} محصول)</span>
      </div>

      {loadingFavorites ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری علاقه‌مندی‌ها...</p>
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-600 mb-3">هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید</h3>
          <p className="text-gray-500">محصولات مورد علاقه‌تان را با کلیک روی قلب اضافه کنید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              websiteId={localStorage.getItem('current_store_website_id')}
              name={product.name}
              price={product.price}
              discountedPrice={product.discountedPrice}
              image={product.image}
              rating={product.rating}
              discount={product.discount}
              product={product}
              onClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default InterestsSection;