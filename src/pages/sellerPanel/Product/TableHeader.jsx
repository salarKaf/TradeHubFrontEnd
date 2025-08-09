const TableHeader = () => {
    return (
        <div className="bg-[#eac09fad] border-b shadow-inner min-w-[800px]">
            <div className=" py-3 font-modam text-base md:text-lg">
                <div className="grid grid-cols-12 px-4">
                    <div className="col-span-3 py-3 ">نام محصول</div>
                    <div className="col-span-2 py-3">میزان فروش</div>
                    <div className="col-span-2 py-3 px-6">قیمت</div>
                    <div className="col-span-2 py-3 text-center">دسته بندی</div>
                    <div className="col-span-2 py-3 text-center md:pl-8">وضعیت</div>
                    <div className="col-span-1 text-center py-3 px-3">عملیات</div>
                </div>
            </div>
        </div>
    );
};

export default TableHeader;