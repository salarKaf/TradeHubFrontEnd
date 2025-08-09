import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWebsiteIdBySlug, getWebsiteById, getLogo, getBanner } from "../../../API/website";

const Header = () => {
  const { slug } = useParams();
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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

        const slugResponse = await getWebsiteIdBySlug(slug);

        if (!slugResponse || !slugResponse.website_id) {
          throw new Error('Website not found for slug: ' + slug);
        }

        const websiteId = slugResponse.website_id;
        localStorage.setItem('current_store_website_id', websiteId); // تغییر نام کلید


        console.log('✅ Step 2: Website ID found:', websiteId);

        const [websiteData, logoUrl, bannerUrl] = await Promise.all([
          getWebsiteById(websiteId),
          getLogo(websiteId),
          getBanner(websiteId),
        ]);

        console.log('✅ Step 3: Website data received:', websiteData);

        setWebsiteData({
          ...websiteData,
          logo_url: logoUrl,   
          banner_image: bannerUrl,  
        });
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

  const storeName = websiteData?.business_name || defaultStoreName;
  const storeSlogan = websiteData?.store_slogan || defaultSubSlogan;
  const logoImage = websiteData?.logo_url || defaultLogoImage;
  const backgroundImage = websiteData?.banner_image || defaultBackgroundImage;

  console.log('🎬 Header State:', { loading, error, hasData: !!websiteData, storeName });

  if (loading) {
    return (
      <div className="relative w-full h-[calc(100vh-5rem)] font-rubik flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
    <div className="font-Kahroba relative w-full h-[calc(100vh-5rem)]">
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

      <div className="absolute inset-0 flex flex-col items-start justify-center text-right px-4 z-10 mr-4 sm:mr-8 md:mr-16 lg:mr-32">

        <div className="flex items-center mb-6 gap-2">
          <img
            src={logoImage}
            alt="لوگو فروشگاه"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
            onError={(e) => {
              if (e.target.src !== defaultLogoImage) {
                e.target.src = defaultLogoImage;
              }
            }}
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
            فروشگاه اینترنتی <span>{storeName}</span>
          </h1>
        </div>

        <div className="hidden md:flex mt-12 mb-6 flex-col items-start mr-0 md:mr-16">
          <p className="font-medium text-black text-base md:text-lg">{storeSlogan}</p>
          <div className="relative mt-4 w-full max-w-xs sm:max-w-sm md:max-w-lg h-8">
            <div className="absolute w-[300px] sm:w-[400px] md:w-[580px] h-px bg-black top-2"></div>
            <div className="absolute w-[320px] sm:w-[420px] md:w-[620px] h-px bg-black top-8 right-4 sm:right-6 md:right-10"></div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Header;
