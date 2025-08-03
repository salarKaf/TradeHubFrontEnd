import React from 'react'
import Header from '../Layouts/Header'
import MainLayout from '../Layouts/MainLayout';
import Category from './Category'
import ShopifyAdminInterface from './ShopifyAdminInterface'



const Products = () => {
    return (

        <div>

            <MainLayout>
                <Category className='z-0'></Category>
                <ShopifyAdminInterface className='z-0' />          
                
                  </MainLayout>
        </div>
    );


};


export default Products;











