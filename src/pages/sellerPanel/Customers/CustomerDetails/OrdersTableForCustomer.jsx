import OrderRowForCustomer from './OrderRowForCustomer';
import TableHeaderForCustomer from './TableHeaderForCustomer';

const OrdersTableForCustomer = ({ orders, onDelete, hideCustomerColumn = false }) => {
    if (orders.length === 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TableHeaderForCustomer hideCustomerColumn={hideCustomerColumn} />
                <div className="px-6 py-8 text-center text-gray-500">
                    سفارشی یافت نشد
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <TableHeaderForCustomer hideCustomerColumn={hideCustomerColumn} />
            <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <OrderRowForCustomer
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

export default OrdersTableForCustomer;