import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // نمونه داده محصولات
  const products = [
    {
      id: 1,
      name: "لپ تاپ MacBook Pro M3",
      price: "45,000,000 تومان",
      image: "/api/placeholder/400/400",
      description: "لپ تاپ حرفه‌ای با پردازنده M3 و نمایشگر Retina"
    },
    {
      id: 2,
      name: "گوشی iPhone 15 Pro",
      price: "35,000,000 تومان", 
      image: "/api/placeholder/400/400",
      description: "جدیدترین گوشی اپل با دوربین پیشرفته"
    },
    {
      id: 3,
      name: "تبلت iPad Air",
      price: "22,000,000 تومان",
      image: "/api/placeholder/400/400",
      description: "تبلت قدرتمند برای کار و سرگرمی"
    },
    {
      id: 4,
      name: "ساعت Apple Watch Ultra",
      price: "18,000,000 تومان",
      image: "/api/placeholder/400/400",
      description: "ساعت هوشمند برای فعالیت‌های ورزشی"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center p-8">
      {/* Background Wood Texture Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-amber-900/10 to-orange-900/10"></div>
      </div>

      {/* Header Text */}
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">برترین محصولات</h2>
        <p className="text-gray-600 text-lg">کیفیت برتر، قیمت مناسب</p>
      </div>

      {/* Main Slider Container */}
      <div className="relative w-full max-w-6xl mx-auto">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 group"
        >
          <ChevronLeft size={24} className="text-gray-700 group-hover:text-gray-900" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 group"
        >
          <ChevronRight size={24} className="text-gray-700 group-hover:text-gray-900" />
        </button>

        {/* Slider Content */}
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm shadow-2xl p-8">
          <div className="flex items-center justify-center min-h-[500px]">
            {/* Product Display */}
            <div className="text-center">
              {/* Product Image Circle */}
              <div className="relative mx-auto mb-8">
                <div className="w-80 h-80 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white/50 backdrop-blur-sm">
                  <img
                    src={products[currentSlide].image}
                    alt={products[currentSlide].name}
                    className="w-64 h-64 object-cover rounded-2xl transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full animate-pulse delay-1000"></div>
              </div>

              {/* Product Info Buttons */}
              <div className="flex justify-center gap-4 mb-8">
                <button className="bg-gray-700/80 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
                  قیمت
                </button>
                <button className="bg-gray-600/80 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
                  نام محصول
                </button>
              </div>

              {/* Product Details */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {products[currentSlide].name}
                </h3>
                <p className="text-3xl font-bold text-orange-600 mb-3">
                  {products[currentSlide].price}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {products[currentSlide].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 gap-3">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-orange-500 shadow-lg'
                  : 'w-3 bg-gray-400 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="relative z-10 mt-12">
        <button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
          مشاهده همه محصولات
        </button>
      </div>

      {/* Floating Devices (Decorative) */}
      <div className="absolute bottom-20 left-20 opacity-30">
        <div className="w-32 h-20 bg-gray-800 rounded-lg shadow-lg transform rotate-12"></div>
      </div>
      <div className="absolute top-32 right-20 opacity-20">
        <div className="w-20 h-32 bg-gray-700 rounded-xl shadow-lg transform -rotate-12"></div>
      </div>
    </div>
  );
};

export default ProductSlider;