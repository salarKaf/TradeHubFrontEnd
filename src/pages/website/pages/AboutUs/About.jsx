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
    <div className="max-w-6xl mx-auto px-6 py-12 font-rubik bg-gray-30 min-h-screen">
      
      {/* درباره ما */}
      {aboutContent.trim() && (
        <div className="rounded-xl p-8 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">درباره ما</h1>
              <div className="h-1 w-20 bg-gradient-to-r from-neutral-900 rounded-full mt-3"></div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg mr-10">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border hover:border-blue-200">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-gray-900" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-base text-justify">
                        {aboutContent}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-1 bg-gradient-to-r"></div>
            </div>
          </div>
        </div>
      )}

      {/* سوالات متداول */}
      {faqData.length > 0 && (
        <div className="rounded-xl p-8 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageSquare className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">پرسش‌های متداول</h1>
              <div className="h-1 w-20 bg-gradient-to-r from-neutral-900 rounded-full mt-3"></div>
            </div>
          </div>

          <div className="space-y-6 mr-10">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border hover:border-blue-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <HelpCircle className="w-6 h-6 text-gray-900" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                        {faq.question}
                      </h3>
                      
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed text-base">
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

      {/* در صورت عدم وجود محتوا */}
      {!aboutContent.trim() && faqData.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center mr-10">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">اطلاعاتی موجود نیست</h3>
          <p className="text-gray-500">در حال حاضر اطلاعات درباره ما یا پرسش‌های متداول تعریف نشده است.</p>
        </div>
      )}
    </div>
  );
};

export default AboutUs;