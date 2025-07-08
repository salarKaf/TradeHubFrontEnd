import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/TradePages/Home";
import About from "./pages/TradePages/About";
import Contact from "./pages/TradePages/contact";
import Pricing from "./pages/TradePages/pricing";
import SignupForm from "./pages/TradePages/signUp";
import LoginForm from "./pages/TradePages/login"
import Navbar from "./pages/TradePages/components/Navbar";
import CreateStore from "./pages/TradePages/CreateStore";
import ChooseSellerType from "./pages/TradePages/ChooseSellerType";
import RulesTrade from "./pages/TradePages/rulesTrade";
import PricingPlans from "./pages/TradePages/Plans";
import OTPForm from "./pages/TradePages/OTPForm"


import HomeSeller from "./pages/sellerPanel/Home/Home";
import Appearance from "./pages/sellerPanel/Appearance/Appearance";
import Profile from "./pages/sellerPanel/Profile/Profile";
import Orders from "./pages/sellerPanel/Orders/Orders";
import Products from "./pages/sellerPanel/Product/Products";
import Customers from "./pages/sellerPanel/Customers/Customers";
import AddProductaPage from './pages/sellerPanel/AddProduct/AddProductaPage';
import ShowProductaPage from './pages/sellerPanel/ShowProducts/ShowProductPage';
import ShowCustomer from './pages/sellerPanel/Customers/CustomerDetails/ShowCustomer';


import '@fortawesome/fontawesome-free/css/all.min.css';

export default function App() {
  const location = useLocation();

  // مسیرهایی که باید Navbar نمایش داده بشه
  const showNavbarPaths = ["/", "/about", "/contact", "/pricing", "/portfolio"];
  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm></LoginForm>} />
        <Route path="/storeForm" element={<CreateStore></CreateStore>} />
        <Route path="/choose-seller-types" element={<ChooseSellerType></ChooseSellerType>} />
        <Route path="/rules" element={<RulesTrade></RulesTrade>}></Route>
        <Route path="/PricingPlans" element={<PricingPlans/>}/>
        <Route path="/OTPForm" element={<OTPForm/>}/>




        <Route path='/HomeSeller' element={<HomeSeller />}></Route>
        <Route path='/appearance' element={<Appearance></Appearance>}></Route>
        <Route path='/profile' element={<Profile></Profile>} />
        <Route path='/customers' element={<Customers></Customers>} />
        <Route path='/orders' element={<Orders></Orders>} />
        <Route path='/products' element={<Products></Products>} />
        <Route path='/AddProduct' element={<AddProductaPage></AddProductaPage>}></Route>
        <Route path='/detailProduct' element={<ShowProductaPage></ShowProductaPage>}></Route>
        <Route path="/customer-details/:id" element={<ShowCustomer />} />
      </Routes>
    </>
  );
}
