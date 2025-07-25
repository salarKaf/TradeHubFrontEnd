import PurchasedProduct from './PurchasedProduct.jsx';
import Navbar from '../../components/Navbar.jsx'
import Header from '../../components/Header.jsx'
import Footer from '../../components/Footer.jsx'

const ProductAfterPurchase = () => {

    return (

        <div>
            <Navbar></Navbar>
            <Header></Header>
            <div className='mt-10 mb-36'>
                <PurchasedProduct></PurchasedProduct>


            </div>
            <div className=' h-[1px] bg-black/30 '></div>
            <Footer></Footer>
        </div>

    )


}

export default ProductAfterPurchase;