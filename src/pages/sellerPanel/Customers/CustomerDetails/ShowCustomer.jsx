import React from 'react';
import Header from '/src/pages/sellerPanel/Layouts/Header'
import Sidebar from '/src/pages/sellerPanel/Layouts/Sidebar'

import CustomerDetails from './CustomerDetails';


const ShowCustomer = () => {
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
                        <CustomerDetails></CustomerDetails>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowCustomer;
