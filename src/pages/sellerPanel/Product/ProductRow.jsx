import { Edit, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { editItem } from '../../../API/Items'; // اطمینان حاصل کن این مسیر درسته
import { useState } from 'react';

const ProductRow = ({ product, onDelete, websiteId }) => {
    const [isToggling, setIsToggling] = useState(false);
    const [isAvailable, setIsAvailable] = useState(product.category === "فعال");

    const toggleAvailability = async () => {
        try {
            setIsToggling(true);

            const newStatus = !isAvailable;
            const newStock = newStatus ? 10000 : 0;

            await editItem(product.id, {
                is_available: newStatus,
                stock: newStock
            });

            setIsAvailable(newStatus);
        } catch (err) {
            console.error("❌ خطا در تغییر وضعیت محصول:", err);
            alert("خطا در تغییر وضعیت محصول");
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className="px-5 py-5 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* Product Name */}
                <div className="col-span-3">
                    <span className="font-medium text-gray-900">{product.name}</span>
                </div>

                {/* Sales */}
                <div className="col-span-2 text-gray-600">
                    {product.sales} فروش
                </div>

                {/* Price */}
                <div className="col-span-2 font-medium text-gray-900">
                    {product.price}
                </div>

                {/* Category */}
                <div className="col-span-2 text-gray-600">
                    {product.status}
                </div>

                {/* Status toggle */}
                <div className="col-span-2">
                    <button
                        onClick={toggleAvailability}
                        disabled={isToggling}
                        className={`text-sm px-3 py-1 rounded-full transition-colors ${
                            isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}
                    >
                        {isToggling ? "..." : isAvailable ? "فعال" : "غیرفعال"}
                    </button>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center gap-2">
                    <button
                        onClick={() => onDelete(product)}
                        className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                    <Link to={`/detailProduct/${websiteId}/${product.id}`}
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                        <Edit size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductRow;
