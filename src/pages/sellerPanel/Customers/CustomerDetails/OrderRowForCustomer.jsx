const OrderRowForCustomer = ({ order}) => {
    return (
        <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-10 gap-2 text-center items-center text-sm">
                <div className="col-span-2 font-medium text-gray-900">{order.orderNumber}</div>
                <div className="col-span-2 text-gray-600">{order.date}</div>
                <div className="col-span-2 font-medium text-gray-900">{order.product}</div>
                <div className="col-span-2 text-gray-600">{order.amount}</div>
                <div className='col-span-2'>
                    <span className={`font-medium ${order.status === 'تکمیل شده' ? 'text-green-600' : 'text-red-600'}`}>
                        {order.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderRowForCustomer;