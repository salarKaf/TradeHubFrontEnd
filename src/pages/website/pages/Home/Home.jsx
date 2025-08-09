import React from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import ProductGrid from "./ProductGrid";
import ProductSlider from "./ProductSlider";
import Footer from "../../components/Footer";

const HomeWebsite = () => {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <Header />
      <ProductGrid />
      <div className="mt-10 mb-56">
        <ProductSlider />
      </div>
      <div className="h-[1px] bg-black/30"></div>
      <Footer />
    </div>
  );
};

export default HomeWebsite;