import CustomerRow from './CustomerRow';
import TableHeader from './TableHeader';

const CustomersTable = ({ Customers, getOrdersForCustomer }) => {
    if (Customers.length === 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TableHeader />
                <div className="px-6 py-8 text-center text-gray-500">
                    مشتری ای با این نام پیدا نشد
                </div>
            </div>
        );
    }
    
    return (
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
    );
};

export default CustomersTable;