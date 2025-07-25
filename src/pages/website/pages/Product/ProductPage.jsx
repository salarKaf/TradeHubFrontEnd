import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import ProductShow from "./productShow";
import Footer from "../../components/Footer";

const ProductPage = () => {


  return (
    <div>
      <Navbar />
      <Header />
      <div className='mt-10'>
        <ProductShow></ProductShow>

      </div>

      <div className='mt-20'>
        <Footer></Footer>
      </div>

    </div>
  );
};

export default ProductPage;