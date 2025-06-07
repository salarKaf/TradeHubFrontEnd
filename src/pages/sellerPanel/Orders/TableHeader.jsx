
const TableHeader = () => {
    return (
        <div className="px-6 py-3 border-b bg-[#eac09fad] font-modam text-lg shadow-inner">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2 py-3">شماره سفارش</div>
                <div className="col-span-2 py-3">تاریخ ثبت</div>
                <div className="col-span-2 py-3">محصول</div>
                <div className="col-span-2 py-3">مبلغ</div>
                <div className="col-span-2 py-3">مشتری</div>
                <div className="col-span-1 py-3 pl-10">وضعیت</div>
                <div className="col-span-1 text-center py-3 px-6">عملیات</div>
            </div>
        </div>
    );
};

export default TableHeader;