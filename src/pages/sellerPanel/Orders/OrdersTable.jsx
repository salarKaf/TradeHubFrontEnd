import OrderRow from './OrderRow';
import TableHeader from './TableHeader';




const OrdersTable = ({ orders, onDelete }) => {
    if (orders.length === 0) {
        return (
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TableHeader />
                <div className="px-6 py-8 text-center text-gray-500">
                    محصولی با این نام پیدا نشد
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <TableHeader />
            <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <OrderRow 
                        key={order.id} 
                        order={order} 
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};7

export default OrdersTable;