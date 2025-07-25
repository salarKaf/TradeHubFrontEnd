import React from 'react';
import Navbar from '../../components/Navbar';
import Header from '../../components/Header';
import Rules from './Rules';
import Footer from '../../components/Footer';


const RulesWebsite = () => {

  return (
    <div>
      <Navbar />
      <Header />
      <div className='mt-10 mb-36'>
        <Rules></Rules>
      </div>
      <div className=' h-[1px] bg-black/30 '></div>
      <Footer></Footer>

    </div>
  );


}

export default RulesWebsite;