const ProductC = ({ product, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            <button 
                onClick={onBack}
                className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
                بازگشت
            </button>
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">جزئیات محصول</h2>
                <p><strong>نام:</strong> {product.name}</p>
                <p><strong>قیمت:</strong> {product.price}</p>
                <p><strong>فروش:</strong> {product.sales}</p>
                <p><strong>دسته‌بندی:</strong> {product.status}</p>
                <p><strong>وضعیت:</strong> {product.category}</p>
            </div>
        </div>
    );
};


export default ProductC;