import React from "react";

const Header = () => {
  const backgroundImage = "/website/Group 432.png";
  const logoImage = "/website/Picsart_25-04-16_19-30-26-995 1.png";
  const storeName = "ویترین";
  const subSlogan =
    "خرید امن محصولات اینترنتی با کیفیت و بهترین قیمت در سریع‌ترین زمان ممکن";
  
  return (
    <div className="relative w-full h-[calc(100vh-5rem)]  font-rubik">
      {/* بک‌گراند */}
      <img
        src={backgroundImage}
        alt="هدر سایت"
        className="w-full h-full object-cover absolute top-0 left-0 z-0"
      />
      {/* محتوا */}
      <div className="absolute inset-0 flex flex-col items-start justify-center text-right px-4 z-10 mr-32">
        {/* لوگو و نام */}
        <div className="flex items-end mb-6">
          <img
            src={logoImage}
            alt="لوگو فروشگاه"
            className="w-14 h-14 mt-8 ml-2 "
            style={{ alignSelf: 'flex-end' }}
          />
          <h1 className="text-4xl font-bold text-black">
            فروشگاه اینترنتی <span className="">{storeName}</span>
          </h1>
        </div>
        {/* شعار */}
        <div className="mt-20 mr-16 mb-6 flex flex-col items-start">
          <p className="font-medium text-black text-lg">{subSlogan}</p>
          <div className="relative mt-4 w-full max-w-lg h-8">
            <div className="absolute w-[580px] h-px bg-black top-2 right-50"></div>
            <div className="absolute w-96 h-px bg-black top-6 left-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;