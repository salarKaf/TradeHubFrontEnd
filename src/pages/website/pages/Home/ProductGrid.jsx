
import ProductCard from "./ProductCard";


export default function ProductGrid() {
  // Sample products data (جدیدترین 6 محصول)
  const latestProducts = [
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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">جدیدترین محصولات</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </div>

      {/* Products Grid - 3 columns */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-6 justify-items-center">          {latestProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            rating={product.rating}
            discount={product.discount}
          />
        ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          مشاهده همه محصولات
        </button>
      </div>
    </div>
  );
}