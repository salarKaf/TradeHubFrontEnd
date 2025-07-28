import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/TradePages/Home";
import About from "./pages/TradePages/About";
import Contact from "./pages/TradePages/contact";
import Pricing from "./pages/TradePages/pricing";
import SignupForm from "./pages/TradePages/signUp";
import LoginForm from "./pages/TradePages/login"
import Navbar from "./pages/TradePages/components/Navbar";
import CreateStore from "./pages/TradePages/CreateStore";
import RulesTrade from "./pages/TradePages/rulesTrade";
import PricingPlans from "./pages/TradePages/Plans/Plans";
import PaymentCallback from './pages/TradePages/Plans/components/PaymentCallback';
import PaymentResult from './pages/TradePages/Plans/components/PaymentResult.jsx';
import OTPForm from "./pages/TradePages/OTPForm"
import Slug from "./pages/TradePages/slug";

// Seller Panel Pages
import HomeSeller from "./pages/sellerPanel/Home/Home";
import Appearance from "./pages/sellerPanel/Appearance/Appearance";
import Profile from "./pages/sellerPanel/Profile/Profile";
import Orders from "./pages/sellerPanel/Orders/Orders";
import Products from "./pages/sellerPanel/Product/Products";
import Customers from "./pages/sellerPanel/Customers/Customers";
import AddProductaPage from './pages/sellerPanel/AddProduct/AddProductaPage';
import ShowProductaPage from './pages/sellerPanel/ShowProducts/ShowProductPage';
import ChangePasswordForm from "./pages/sellerPanel/Profile/ChangePasswordForm.jsx";

// Website Pages  
import HomeWebsite from '../src/pages/website/pages/Home/Home.jsx';
import AboutWebsite from '../src/pages/website/pages/AboutUs/AboutWebsite';
import ShopWebsite from '../src/pages/website/pages/Shop/ShopWebsite.jsx';
import RulesWebsite from '../src/pages/website/pages/Rules/RulesWebsite';
import ProductPage from '../src/pages/website/pages/Product/ProductPage.jsx';
import Cart from '../src/pages/website/pages/Cart/Cart.jsx';
import SignUp from '../src/pages/website/pages/Auth/SignUp';
import Login from '../src/pages/website/pages/Auth/Login.jsx';
import ProductAfterPurchase from './pages/website/pages/Cart/ProductAfterPurchase.jsx';
import OTPFormBuyer from './pages/website/pages/Auth/OTPFormBuyer.jsx'
import PaymentCallbackOrder from './pages/website/pages/Orders/PaymentCallbackOrder.jsx';
// Slug Handler Component
import SlugHandler from '../src/pages/website/pages/SlugHandler.jsx';

import { WebsiteProvider } from '../src/pages/website/pages/WebsiteProvider.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function App() {
  const location = useLocation();

  // مسیرهایی که باید Navbar نمایش داده بشه (صفحات اصلی پلتفرم)
  const showNavbarPaths = ["/", "/about", "/contact", "/pricing", "/portfolio"];
  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/* صفحات اصلی پلتفرم */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/storeForm" element={<CreateStore />} />

        <Route path="/OTPForm" element={<OTPForm />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/payment-result" element={<PaymentResult />} />

        {/* مسیرهای پنل فروشنده (بدون slug) */}
        <Route path='/HomeSeller/:websiteId' element={<HomeSeller />} />
        <Route path='/appearance/:websiteId' element={<Appearance />} />
        <Route path='/profile/:websiteId' element={<Profile />} />
        <Route path='/customers/:websiteId' element={<Customers />} />
        <Route path='/orders/:websiteId' element={<Orders />} />
        <Route path='/products/:websiteId' element={<Products />} />
        <Route path='/seller/products/:websiteId/add' element={<AddProductaPage />} />
        <Route path='/detailProduct/:websiteId/:productId' element={<ShowProductaPage />} />
        <Route path='/ChangePassword/:websiteId' element={<ChangePasswordForm />} />
        <Route path="/rules/:websiteId" element={<RulesTrade />} />
        <Route path="/PricingPlans/:websiteId" element={<PricingPlans />} />
        <Route path="/Slug/:websiteId" element={<Slug />} />  // برای تعریف اسلاگ توسط کاربر
        {/* مسیرهای فروشگاه با اسلاگ - تغییر کلیدی اینجاست */}
        <Route path="/website/orders/payment-callback" element={<PaymentCallbackOrder />} />

        <Route path="/:slug" element={<SlugHandler />} />
        <Route path="/:slug/*" element={
          <WebsiteProvider>
            <Routes>
              <Route path="home" element={<HomeWebsite />} />
              <Route path="about" element={<AboutWebsite />} />
              <Route path="shop" element={<ShopWebsite />} />
              <Route path="rules" element={<RulesWebsite />} />
              <Route path="product/:productId" element={<ProductPage />} />
              <Route path="cart" element={<Cart />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="login" element={<Login />} />
              <Route path="digital-product-purchased" element={<ProductAfterPurchase />} />
              <Route path="otp-verification" element={<OTPFormBuyer />} />

            </Routes>
          </WebsiteProvider>
        } />
      </Routes>
    </>
  );
}