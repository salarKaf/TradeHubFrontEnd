import React from 'react';
import Navbar from '../../components/Navbar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Products from './products';   

const ShopWebsite = () => {

  return (
    <div className="relative">
      <Navbar />
      <Header />
      <Products />
      <div className=' h-[1px] bg-black/30 '></div>

      <Footer></Footer>
    </div>
  );


}

export default ShopWebsite;