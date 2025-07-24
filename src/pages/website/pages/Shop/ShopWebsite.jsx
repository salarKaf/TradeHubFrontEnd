import React from 'react';
import Navbar from '../../components/Navbar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Products from './products'; // مطمئن شو مسیر درست باشه   

const ShopWebsite =()=>{

  return (
    <div className="relative">
      <Navbar />
      <Header />
      <Products />
      <Footer></Footer>
    </div>
  );


}

export default ShopWebsite;