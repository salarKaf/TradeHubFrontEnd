import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerRow = ({ customer }) => {
    // فرمت کردن مبلغ با جداکننده هزارگان
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    return (
        <div className="px-3 sm:px-5 py-3 sm:py-5 hover:bg-gray-50 transition-colors font-modam">
            <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center text-center min-w-[400px] sm:min-w-0">
                {/* Customer Name */}
                <div className="col-span-4">
                    <span className="font-medium text-gray-900 text-xs sm:text-sm md:text-base truncate block">
                        {customer.email}
                    </span>
                </div>
           
                {/* Total Purchases */}
                <div className="col-span-4 text-gray-900 font-medium text-xs sm:text-sm md:text-base">
                    {formatPrice(customer.totalPurchases)} ریال
                </div>
               
                {/* Order Count */}
                <div className="col-span-4 text-gray-800 text-center text-xs sm:text-sm md:text-base">
                    {customer.orderCount} سفارش
                </div>
            </div>
        </div>
    );
};

export default CustomerRow;