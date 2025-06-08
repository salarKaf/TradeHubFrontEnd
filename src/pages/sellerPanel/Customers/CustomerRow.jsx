import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerRow = ({ customer, getOrdersForCustomer }) => {
    const navigate = useNavigate();
    
    const handleViewDetails = (customer) => {
        // انتقال به صفحه جزئیات مشتری
        navigate(`/customer-details/${customer.id}`, { 
            state: { 
                customer,
                orders: getOrdersForCustomer(customer.id)
            } 
        });
    };

    // فرمت کردن مبلغ با جداکننده هزارگان
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    return (
        <div className="px-5 py-5 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* Customer Name */}
                <div className="col-span-4">
                    <span className="font-medium text-gray-900">{customer.email}</span>
                </div>
            
                
                {/* Email */}
                <div className="col-span-3 font-medium text-gray-700 text-sm">
                    {customer.phone}
                </div>
                
                {/* Total Purchases */}
                <div className="col-span-2 text-gray-900 font-medium">
                    {formatPrice(customer.totalPurchases)} ریال
                </div>
                
                {/* Order Count */}
                <div className="col-span-2 text-gray-800 text-center">
                    {customer.orderCount} سفارش
                </div>
            
                
                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center gap-2">
                    <button
                        onClick={() => handleViewDetails(customer)}
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="مشاهده جزئیات مشتری"
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerRow;