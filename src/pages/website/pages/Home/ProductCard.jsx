import React, { useState } from "react";
import { Heart, Eye, ShoppingCart } from "lucide-react";


const ProductCard = ({ product, discount, image, price = "150,000 تومان", name = "نام محصول", rating = 5 }) => {
  const [isLiked, setIsLiked] = useState(false);

  // محاسبه قیمت تخفیف‌دار
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent) return null;
    const numericPrice = parseInt(originalPrice.replace(/[^\d]/g, ''));
    const discountAmount = (numericPrice * parseInt(discountPercent)) / 100;
    const discountedPrice = numericPrice - discountAmount;
    return discountedPrice.toLocaleString('fa-IR') + ' تومان';
  };

  const discountedPrice = discount ? calculateDiscountedPrice(price, discount) : null;

  return (
    <div className="group relative font-rubik bg-white shadow-lg rounded-2xl p-4 w-full max-w-[260px] transition-all duration-300 hover:shadow-2xl hover:scale-105">      {/* Hover Overlay for entire card */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-2xl z-10">
        {/* Add to Cart Button - Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 bg-black text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2 hover:bg-gray-800">
            <ShoppingCart size={18} />
            افزودن به سبد
          </button>
        </div>

        {/* Action Buttons - Bottom Full Width */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 flex transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center justify-center gap-1 px-3 py-2 w-1/2 mr-1 rounded-lg transition-all duration-200 ${isLiked
              ? 'bg-black text-red-400 hover:bg-gray-800'
              : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-medium">پسندیدن</span>
          </button>

          <button className="flex items-center justify-center gap-1 px-3 py-2 w-1/2 ml-1 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-200">
            <Eye size={16} />
            <span className="text-sm font-medium">مشاهده</span>
          </button>
        </div>
      </div>

      {/* Product Image Container */}
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <div className="h-52 flex items-center justify-center bg-gray-50">
          <img
            src={image || "/public/website/Image(1).png"}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-20">
            {discount}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="text-right space-y-2">
        <h3 className="text-gray-800 font-bold text-lg leading-tight">{name}</h3>

        {/* Price Section */}
        <div className="space-y-1">
          {discount ? (
            <>
              <p className="text-gray-400 text-sm line-through font-modam">{price}</p>
              <p className="text-red-500 font-bold text-xl font-modam">{discountedPrice}</p>
            </>
          ) : (
            <p className="text-blue-600 font-bold text-xl font-modam">{price}</p>
          )}
        </div>

        {/* Rating */}
        <div className="flex justify-end items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ProductCard;