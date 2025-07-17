import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerRow = ({ customer }) => {
    


    // فرمت کردن مبلغ با جداکننده هزارگان
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    return (
        <div className="px-5 py-5 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center text-center">
                {/* Customer Name */}
                <div className="col-span-4">
                    <span className="font-medium text-gray-900">{customer.email}</span>
                </div>
            
                
                
                {/* Total Purchases */}
                <div className="col-span-4 text-gray-900 font-medium">
                    {formatPrice(customer.totalPurchases)} ریال
                </div>
                
                {/* Order Count */}
                <div className="col-span-4 text-gray-800 text-center">
                    {customer.orderCount} سفارش
                </div>
            
                
            </div>
        </div>
    );
};

export default CustomerRow;