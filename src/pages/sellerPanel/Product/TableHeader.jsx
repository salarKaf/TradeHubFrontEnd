
 const TableHeader = () => {
    return (
        <div className="px-6 py-3 border-b bg-[#eac09fad] font-modam text-lg shadow-inner">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 py-3">نام محصول</div>
                <div className="col-span-2 py-3">میزان فروش</div>
                <div className="col-span-2 py-3">قیمت</div>
                <div className="col-span-2 py-3">دسته بندی</div>
                <div className="col-span-2 py-3">وضعیت</div>
                <div className="col-span-1 text-center py-3 px-3">عملیات</div>
            </div>
        </div>
    );
};

export default TableHeader;