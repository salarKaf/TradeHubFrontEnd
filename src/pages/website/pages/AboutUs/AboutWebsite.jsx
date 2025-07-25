import React from 'react';
import Navbar from '../../../components/Navbar';
import Header from '../../../components/Header';
import AboutUs from './About';
import Footer from '../../../components/Footer';
const AboutWebsite = () => {

  return (
    <div className="relative">
      <Navbar />
      <Header />
      <div className='t-10 mb-36'>
        <AboutUs></AboutUs>

      </div>
      <div className=' h-[1px] bg-black/30 '></div>
      <Footer></Footer>
    </div>
  );


}

export default AboutWebsite;