import React, { useState } from 'react';
import SalesCard from './SalesCard';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import OrdersHeader from './CustomersHeader'

const ReportOrder = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="py-10 ">
            <div className=" mb-5">
                <OrdersHeader
                    isOpenTable={isOpen}
                    setIsOpenTable={setIsOpen}
                    title="آمار مشتریان"
                    logo="/public/SellerPanel/Customers/icons8-stats-32 1.png"
                />
                {isOpen && (
                    <div className=" flex justify-evenly px-6">
                        <SalesCard
                            title="تعداد کل مشتریان"
                            amount="۵,۰۰۰"
                            logo='/public/SellerPanel/Customers/icons8-numbers-50 2.png'
                            desc=' '
                        />
                        <SalesCard
                            title="میانگین خرید هر مشتری"
                            amount="45۰,۰۰۰"
                            logo='/public/SellerPanel/Customers/icons8-shopping-cart-48(2).png'
                            desc=' '
                        />
                        <SalesCard
                            title="تعداد مشتریان فعال"
                            amount="350"
                            logo='/public/SellerPanel/Customers/icons8-active-50 1.png'
                            desc='مشتریانی که حداقل یک سفارش در سه ماه اخیر داشته اند'
                        />

                    </div>
                )}

            </div>
        </div>
    );
}

export default ReportOrder;
















