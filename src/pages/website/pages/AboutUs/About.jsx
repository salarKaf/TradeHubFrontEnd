import React, { useEffect, useState } from 'react';
import { getWebsiteIdBySlug, getWebsiteById } from '../../../../API/website';
import { useParams } from 'react-router-dom';
import { 
  Users, 
  HelpCircle, 
  Building2, 
  Target, 
  Heart, 
  Award, 
  Lightbulb,
  MessageSquare
} from 'lucide-react';

const AboutUs = () => {
  const { slug } = useParams();
  const [aboutContent, setAboutContent] = useState('');
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!slug) return;

        const { website_id } = await getWebsiteIdBySlug(slug);
        const websiteData = await getWebsiteById(website_id);

        setAboutContent(websiteData?.about_us || '');
        setFaqData(websiteData?.faqs || []);
      } catch (err) {
        console.error('❌ خطا در دریافت اطلاعات درباره ما و پرسش‌ها:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 mx-auto"></div>
          <p className="text-gray-600 text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 bg-gray-30 min-h-screen font-Kahroba">
      
      {aboutContent.trim() && (
        <div className="rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">درباره ما</h1>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-neutral-900 rounded-full mt-2 sm:mt-3"></div>
            </div>
          </div>
          
          <div className="p-2 sm:p-4 rounded-lg mr-0 sm:mr-10">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border hover:border-blue-200">
              <div className="p-4 sm:p-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base text-justify">
                    {aboutContent}
                  </p>
                </div>
              </div>
              
              <div className="h-1 bg-gradient-to-r"></div>
            </div>
          </div>
        </div>
      )}

      {faqData.length > 0 && (
        <div className="rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">پرسش‌های متداول</h1>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-neutral-900 rounded-full mt-2 sm:mt-3"></div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 mr-0 sm:mr-10">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border hover:border-blue-200"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 p-1.5 sm:p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                        {faq.question}
                      </h3>
                      
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="h-1 bg-gradient-to-r"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!aboutContent.trim() && faqData.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center mr-0 sm:mr-10">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">اطلاعاتی موجود نیست</h3>
          <p className="text-sm sm:text-base text-gray-500">در حال حاضر اطلاعات درباره ما یا پرسش‌های متداول تعریف نشده است.</p>
        </div>
      )}
    </div>
  );
};

export default AboutUs;