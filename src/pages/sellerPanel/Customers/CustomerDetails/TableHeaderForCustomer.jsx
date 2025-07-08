const TableHeaderForCustomer = () => {
    return (
        <div className="px-6 py-3 border-b bg-[#eac09fad] font-modam text-lg shadow-inner">
            <div className="grid grid-cols-10 gap-2 text-center items-center">
                <div className="col-span-2 py-3">شماره سفارش</div>
                <div className="col-span-2 py-3">تاریخ ثبت</div>
                <div className="col-span-2 py-3">محصول</div>
                <div className="col-span-2 py-3">مبلغ</div>
                <div className='col-span-2'>وضعیت</div>
            </div>
        </div>
    );
};

export default TableHeaderForCustomer;