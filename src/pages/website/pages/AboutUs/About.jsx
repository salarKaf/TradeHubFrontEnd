import React, { useEffect, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { getWebsiteIdBySlug, getWebsiteById } from '../../../../API/website';
import { useParams } from 'react-router-dom';

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

        setAboutContent(websiteData?.welcome_text || '');
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
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-16 font-rubik">
      {/* درباره ما */}
      {aboutContent.trim() && (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">درباره ما</h2>
          <p className="text-gray-700 leading-loose text-justify">{aboutContent}</p>
        </div>
      )}

      {/* سوالات متداول */}
      {faqData.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 border-b pb-5">پرسش‌های متداول</h2>

          <div className="space-y-16">
            {faqData.map((faq, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <FaQuestionCircle className="text-black" />
                  <span>{faq.question}</span>
                </div>
                <div className="mt-6 pl-8 text-gray-600 leading-relaxed text-sm">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
