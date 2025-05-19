import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/contact";
import Pricing from "./pages/public/pricing";
import SignupForm from "./pages/public/signUp";
import LoginForm from "./pages/public/login"
import Navbar from "./pages/public/components/Navbar";
import CreateStore from "./pages/public/CreateStore";

export default function App() {
  const location = useLocation();
  
  // مسیرهایی که باید Navbar نمایش داده بشه
  const showNavbarPaths = ["/", "/about", "/contact", "/pricing" , "/portfolio"];
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
        <Route path="/login"  element={<LoginForm></LoginForm>}/>
        <Route path="/storeForm" element={<CreateStore></CreateStore>}/>
      </Routes>
    </>
  );
}
