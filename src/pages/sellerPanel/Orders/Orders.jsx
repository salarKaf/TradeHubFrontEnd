import React from 'react'
import OrderContent from './OrdersContent'
import MainLayout from '../Layouts/MainLayout'
import ReportOrder from './ReportOrder'

const Orders = () => {
    return (

        <div>
            <MainLayout>
                <ReportOrder></ReportOrder>
                <OrderContent></OrderContent>
            </MainLayout>

        </div>
    );


};


export default Orders;





