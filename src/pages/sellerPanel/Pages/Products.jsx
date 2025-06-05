import React from 'react'
import HomeContent from '../components/HomeContent'
import Header from '../Layouts/Header'
import Sidebar from '../Layouts/SideBar'
import ShopifyAdminInterface from '../components/Product/productContent'
import Category from '../components/Product/Category'




const Products = () => {
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
                        <Category></Category>
                        <ShopifyAdminInterface />

                    </div>
                </div>
            </div>
        </div>
    );


};


export default Products;





