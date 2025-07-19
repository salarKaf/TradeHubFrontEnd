import { Edit, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';


const ProductRow = ({ product, onDelete, websiteId }) => {


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

                {/* Status */}
                <div className="col-span-2">
                    <span className={`font-medium ${product.category === 'فعال' ? 'text-green-600' : 'text-red-600'}`}>
                        {product.category}
                    </span>
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