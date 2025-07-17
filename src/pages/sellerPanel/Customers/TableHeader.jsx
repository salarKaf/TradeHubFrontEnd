
const TableHeader = () => {
    return (
        <div className="px-6 py-3 border-b bg-[#eac09fad] font-modam text-lg shadow-inner">
            <div className="grid grid-cols-12 gap-2 text-center">
                <div className="col-span-4 py-3"> ایمیل</div>
                <div className="col-span-4 py-3">مجموع خرید</div>
                <div className="col-span-4 text-center py-3">تعداد سفارش</div>
            </div>
        </div>
    );
};

export default TableHeader;