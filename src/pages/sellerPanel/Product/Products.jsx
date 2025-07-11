import React from 'react'
import Header from '../Layouts/Header'
import Sidebar from '../Layouts/SideBar'
import Category from './Category'
import ShopifyAdminInterface from './ShopifyAdminInterface'



const Products = () => {
    return (

        <div>

            <Header className='z-10'/>

            <div className="flex h-screen z-0">

                <div className="flex-1 flex ">
                    <div className="w-64 bg-[#EABF9F] ">
                        <Sidebar className='z-0'/>
                    </div>

                    {/* Main Content */}
                    <div className="p-6  bg-[#FAF3E0] flex-1 overflow-auto ">
                        <Category className='z-0'></Category>
                        <ShopifyAdminInterface className='z-0' />

                    </div>
                </div>
            </div>
        </div>
    );


};


export default Products;





