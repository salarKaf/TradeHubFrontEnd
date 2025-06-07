import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderRow = ({ order }) => {
    const navigate = useNavigate();

    const handleViewDetails = (order) => {
        // انتقال به صفحه جزئیات سفارش
        navigate(`/order-details/${order.id}`, { state: { order } });
    };

    return (
        <div className="px-5 py-5 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* order Name */}
                <div className="col-span-2">
                    <span className="font-medium text-gray-900">{order.orderNumber}</span>
                </div>
                {/* Sales */}
                <div className="col-span-2 text-gray-600">
                    {order.date}
                </div>
                {/* Price */}
                <div className="col-span-2 font-medium text-gray-900">
                    {order.product}
                </div>
                {/* Category */}
                <div className="col-span-2 text-gray-600">
                    {order.amount}
                </div>
                {/* Category */}
                <div className="col-span-2 text-gray-800">
                    {order.customer}
                </div>
                {/* Status */}
                <div className="col-span-1">
                    <span className={`font-medium text-sm ${order.status === 'تکمیل شده' ? 'text-green-600' : 'text-red-600'}`}>
                        {order.status}
                    </span>
                </div>
                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center gap-2">
                    <button
                        onClick={() => handleViewDetails(order)}
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="مشاهده جزئیات"
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderRow;