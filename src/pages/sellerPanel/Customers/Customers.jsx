import React from 'react';
import MainLayout from '../Layouts/MainLayout'
import CustomersContent from './CustomersContent'
import ReportOrder from './ReportOrder';
import CouponManagement from './CouponManagement';

const Customers = () => {
    return (
        <div>


            <MainLayout>
                {/* Main Content */}
                <ReportOrder></ReportOrder>
                <CouponManagement />
                <CustomersContent></CustomersContent>
            </MainLayout>


        </div>
    );
};

export default Customers;

























