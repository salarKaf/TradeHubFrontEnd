
const TableHeader = () => {
    return (
        <div className="px-6 py-3 border-b bg-[#eac09fad] font-modam text-lg shadow-inner">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4 py-3"> ایمیل</div>
                <div className="col-span-3 py-3">شماره تماس </div>
                <div className="col-span-2 py-3">مجموع خرید</div>
                <div className="col-span-2 text-center py-3">تعداد سفارش</div>
                <div className="col-span-1 text-center py-3">عملیات</div>
            </div>
        </div>
    );
};

export default TableHeader;