import OrderRow from './OrderRow';
import TableHeader from './TableHeader';

const OrdersTable = ({ orders, onDelete, hideCustomerColumn = false }) => {
    if (orders.length === 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TableHeader hideCustomerColumn={hideCustomerColumn} />
                <div className="px-6 py-8 text-center text-gray-500">
                    سفارشی یافت نشد
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <TableHeader hideCustomerColumn={hideCustomerColumn} />
            <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <OrderRow 
                        key={order.id} 
                        order={order} 
                        onDelete={onDelete}
                        hideCustomerColumn={hideCustomerColumn}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrdersTable;