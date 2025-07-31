import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { getWebsiteIdBySlug } from "../../../../API/website";
import { getBestSellingItems } from "../../../../API/Items";

const ProductSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        const websiteData = await getWebsiteIdBySlug(slug);
        const bestSelling = await getBestSellingItems(websiteData.website_id);

        // تبدیل داده API به فرمت مورد نیاز اسلایدر
        const formatted = bestSelling.map((item) => ({
          id: item.item_id,
          name: item.product_name,
          price: `${item.total_amount.toLocaleString('fa-IR')} ریال`,
          image: "/api/placeholder/400/400" // اگر تصویر نداری فعلاً همین رو بذار
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("خطا در بارگذاری اسلایدر:", err);
      }
    };

    fetchData();
  }, [slug]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const getNextSlideIndex = () => {
    return (currentSlide + 1) % products.length;
  };

  const getPrevSlideIndex = () => {
    return (currentSlide - 1 + products.length) % products.length;
  };

  if (products.length === 0) return null;

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden font-rubik">
      {/* Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/website/a3655ad2f99985ab6b83020118c028d9 1.png')`
        }}
      ></div>

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-80px)] p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mt-6">پرفروش‌ترین محصولات</h2>
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/95 hover:bg-white shadow-2xl rounded-full p-3 transition-all duration-300 hover:scale-110 group"
          >
            <ChevronLeft size={24} className="text-gray-800 group-hover:text-black" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/95 hover:bg-white shadow-2xl rounded-full p-3 transition-all duration-300 hover:scale-110 group"
          >
            <ChevronRight size={24} className="text-gray-800 group-hover:text-black" />
          </button>

          <div className="relative overflow-hidden p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="absolute inset-0 w-64 h-64 mx-auto">
                    <div className="w-full h-full bg-white/20 rounded-full shadow-xl flex items-center justify-center overflow-hidden border-4 border-white/30 backdrop-blur-sm transform scale-75 opacity-40 -rotate-12">
                      <img
                        src={products[getPrevSlideIndex()].image}
                        alt={products[getPrevSlideIndex()].name}
                        className="w-40 h-40 object-cover rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="absolute inset-0 w-64 h-64 mx-auto">
                    <div className="w-full h-full bg-white/20 rounded-full shadow-xl flex items-center justify-center overflow-hidden border-4 border-white/30 backdrop-blur-sm transform scale-75 opacity-40 rotate-12 translate-x-8">
                      <img
                        src={products[getNextSlideIndex()].image}
                        alt={products[getNextSlideIndex()].name}
                        className="w-40 h-40 object-cover rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="relative w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-6 border-white/70 backdrop-blur-sm mx-auto z-10">
                    <img
                      src={products[currentSlide].image}
                      alt={products[currentSlide].name}
                      className="w-48 h-48 object-cover rounded-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm border border-white/30 min-w-[180px]">
                    <div className="text-sm opacity-80 mb-1">قیمت</div>
                    <div className="text-xl font-bold text-orange-300 font-modam">{products[currentSlide].price}</div>
                  </button>
                  <button className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20 min-w-[200px]">
                    <div className="text-sm opacity-80 mb-1">نام محصول</div>
                    <div className="text-lg font-bold">{products[currentSlide].name}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-3">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'w-8 bg-orange-400 shadow-lg'
                  : 'w-3 bg-white/50 hover:bg-white/70'
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 mb-5">
          <button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-full font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-xl">
            مشاهده همه محصولات
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
