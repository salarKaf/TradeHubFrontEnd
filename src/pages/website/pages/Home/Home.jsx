
// HomeWebsite.js
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
      <ProductSlider></ProductSlider>
      <Footer></Footer>
    </div>
  );
};

export default HomeWebsite;