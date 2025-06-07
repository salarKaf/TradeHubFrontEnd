import React, { useState } from 'react';
import SalesCard from './SalesCard';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import OrdersHeader from './OrdersHeader'

const ReportOrder = () => {
    const [isOpen, setIsOpen] = useState(true); 

    return (
        <div className="py-10">
            <div className=" mb-5">
                <OrdersHeader
                    isOpenTable={isOpen}
                    setIsOpenTable={setIsOpen}
                    title="گزارش فروش"
                    logo="/SellerPanel/Orders/icons8-report-50(1) 1.png"
                />
                {isOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-fit">
                        <SalesCard
                            title="فروش روزانه"
                            amount="۵,۰۰۰,۰۰۰"
                            count="50"
                            logo='/SellerPanel/Orders/icons8-last-24-hours-64 1.png'
                        />
                        <SalesCard
                            title="فروش ماهانه"
                            amount="۵۴,۰۰۰,۰۰۰"
                            count="500"
                            logo='/SellerPanel/Orders/icons8-month-50(1).png'
                        />
                        <SalesCard
                            title="فروش سالانه"
                            amount="۵۴۰,۰۰۰,۰۰۰"
                            count="5000"
                            logo='/SellerPanel/Orders/icons8-plus-1-year-50(1).png'
                        />
                        <SalesCard
                            title="فروش کل"
                            amount="۵,۴۰۰,۰۰۰,۰۰۰"
                            count="50000"
                            logo='/public/SellerPanel/Orders/icons8-shopping-cart-48(1).png'
                        />
                    </div>
                )}

            </div>
        </div>
    );
}

export default ReportOrder;
















