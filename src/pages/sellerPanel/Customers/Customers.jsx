import React from 'react';
import Header from '../Layouts/Header'
import Sidebar from '../Layouts/SideBar'
import CustomersContent from './CustomersContent'
import ReportOrder from './ReportOrder';
import CouponManagement from './CouponManagement';

const Customers = () => {
    return (
        <div>

            <Header />

            <div className="flex h-screen ">

                <div className="flex-1 flex ">
                    <div className="w-64 bg-[#EABF9F] ">
                        <Sidebar />
                    </div>

                    {/* Main Content */}
                    <div className="p-6  bg-[#FAF3E0] flex-1 overflow-auto">
                        <ReportOrder></ReportOrder>
                        <CouponManagement />
                        <CustomersContent></CustomersContent>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customers;
