import CustomerRow from './CustomerRow';
import TableHeader from './TableHeader';

const CustomersTable = ({ Customers, getOrdersForCustomer }) => {
    if (Customers.length === 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Container with horizontal scroll for mobile */}
                <div className="overflow-x-auto">
                    <div className="min-w-[400px] sm:min-w-0">
                        <TableHeader />
                        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">
                            مشتری ای پیدا نشد
                        </div>
                    </div>
                </div>
            </div>
        );
    }
   
    return (
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Container with horizontal scroll for mobile */}
            <div className="overflow-x-auto">
                <div className="min-w-[400px] sm:min-w-0">
                    <TableHeader />
                    <div className="divide-y divide-gray-200">
                        {Customers.map((customer) => (
                            <CustomerRow
                                key={customer.id}
                                customer={customer}
                                getOrdersForCustomer={getOrdersForCustomer}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomersTable;