import React from 'react'

import Header from '../Layouts/Header'
import Sidebar from '../Layouts/SideBar'
import AddProduct from './AddProduct';

const AddProductaPage = () => {
  return (

    <div>

      <Header />

      <div className="flex h-screen ">

        <div className="flex-1 flex ">


          {/* Main Content */}
          <div className="p-6  bg-[#FAF3E0] flex-1 overflow-auto">
            <AddProduct></AddProduct>

          </div>
        </div>
      </div>
    </div>
  );


};


export default AddProductaPage;





