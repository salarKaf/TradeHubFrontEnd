const TableHeader = ({ isSearchMode }) => {
    return (
        <div className="px-6 py-3 border-b bg-[#eac09fad] font-modam text-lg shadow-inner">
            <div className="grid grid-cols-12 gap-2 text-center items-center">
                <div className="col-span-2 py-3">شماره سفارش</div>
                <div className="col-span-2 py-3">تاریخ ثبت</div>
                <div className="col-span-2 py-3">
                    {isSearchMode ? 'محصول' : 'مجموع مبلغ'}
                </div>
                <div className="col-span-2 py-3">
                    {isSearchMode ? 'مبلغ' : 'تعداد محصولات'}
                </div>
                <div className="col-span-3 py-3">مشتری</div>
                <div className="col-span-1 py-3">
                    {isSearchMode ? '' : 'عملیات'}
                </div>
            </div>
        </div>
    );
};

export default TableHeader;