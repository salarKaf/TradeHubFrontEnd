import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWebsiteIdBySlug, getWebsiteById } from "../../../API/website";

const Header = () => {
  const { slug } = useParams();
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // تصاویر و متن‌های پیش‌فرض
  const defaultBackgroundImage = "/website/Group 432.png";
  const defaultLogoImage = "/website/Picsart_25-04-16_19-30-26-995 1.png";
  const defaultStoreName = "ویترین";
  const defaultSubSlogan = "خرید امن محصولات اینترنتی با کیفیت و بهترین قیمت در سریع‌ترین زمان ممکن";

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        console.log('❌ No slug found');
        setLoading(false);
        return;
      }

      try {
        console.log('🚀 Step 1: Getting website ID for slug:', slug);
        
        // مرحله 1: گرفتن websiteId از slug
        const slugResponse = await getWebsiteIdBySlug(slug);
        
        if (!slugResponse || !slugResponse.website_id) {
          throw new Error('Website not found for slug: ' + slug);
        }

        console.log('✅ Step 2: Website ID found:', slugResponse.website_id);

        // مرحله 2: گرفتن اطلاعات website
        const websiteData = await getWebsiteById(slugResponse.website_id);
        
        if (!websiteData) {
          throw new Error('Website data not found for ID: ' + slugResponse.website_id);
        }

        console.log('✅ Step 3: Website data received:', websiteData);
        setWebsiteData(websiteData);
        setError(null);

      } catch (err) {
        console.error('❌ Error in Header:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // استخراج اطلاعات
  const storeName = websiteData?.business_name || defaultStoreName;
  const storeSlogan = websiteData?.store_slogan || defaultSubSlogan;
  const logoImage = websiteData?.logo_url || defaultLogoImage;
  const backgroundImage = websiteData?.banner_image || defaultBackgroundImage;

  console.log('🎬 Header State:', { loading, error, hasData: !!websiteData, storeName });

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-[calc(100vh-5rem)] font-rubik flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative w-full h-[calc(100vh-5rem)] font-rubik flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-gray-600 mt-2">Slug: {slug}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] font-rubik">
      {/* بک‌گراند */}
      <img
        src={backgroundImage}
        alt="هدر سایت"
        className="w-full h-full object-cover absolute top-0 left-0 z-0"
        onError={(e) => {
          if (e.target.src !== defaultBackgroundImage) {
            e.target.src = defaultBackgroundImage;
          }
        }}
      />
      
      {/* محتوا */}
      <div className="absolute inset-0 flex flex-col items-start justify-center text-right px-4 z-10 mr-32">
        {/* لوگو و نام */}
        <div className="flex items-end mb-6">
          <img
            src={logoImage}
            alt="لوگو فروشگاه"
            className="w-14 h-14 mt-8 ml-2"
            style={{ alignSelf: 'flex-end' }}
            onError={(e) => {
              if (e.target.src !== defaultLogoImage) {
                e.target.src = defaultLogoImage;
              }
            }}
          />
          <h1 className="text-4xl font-bold text-black">
            فروشگاه اینترنتی <span>{storeName}</span>
          </h1>
        </div>
        
        {/* شعار */}
        <div className="mt-20 mr-16 mb-6 flex flex-col items-start">
          <p className="font-medium text-black text-lg">{storeSlogan}</p>
          <div className="relative mt-4 w-full max-w-lg h-8">
            <div className="absolute w-[580px] h-px bg-black top-2"></div>
            <div className="absolute w-[120px] h-px bg-black top-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;