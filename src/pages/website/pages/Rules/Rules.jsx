import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getWebsiteById, getWebsiteIdBySlug } from '../../../../API/website';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  UserCheck, 
  AlertTriangle, 
  FileText, 
  Scale,
  Lock,
  Clock
} from 'lucide-react';

const TermsAndConditions = () => {
  const { slug } = useParams();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // آیکون‌های مرتبط با انواع قوانین
  const getIconForPolicy = (sectionTitle) => {
    const title = sectionTitle?.toLowerCase() || '';
    
    if (title.includes('پرداخت') || title.includes('خرید')) return CreditCard;
    if (title.includes('ارسال') || title.includes('حمل')) return Truck;
    if (title.includes('بازگشت') || title.includes('مرجوع')) return RotateCcw;
    if (title.includes('کاربر') || title.includes('عضویت')) return UserCheck;
    if (title.includes('امنیت') || title.includes('حریم')) return Lock;
    if (title.includes('مسئولیت') || title.includes('ضمانت')) return ShieldCheck;
    if (title.includes('قانون') || title.includes('مقررات')) return Scale;
    if (title.includes('زمان') || title.includes('مدت')) return Clock;
    if (title.includes('هشدار') || title.includes('اخطار')) return AlertTriangle;
    
    return FileText; // آیکون پیش‌فرض
  };

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const { website_id } = await getWebsiteIdBySlug(slug);
        const data = await getWebsiteById(website_id);
        setPolicies(data?.store_policy || []);
      } catch (err) {
        console.error("❌ خطا در دریافت قوانین:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 mx-auto"></div>
          <p className="text-gray-600 text-lg">در حال بارگذاری قوانین...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 font-Kahroba bg-gray-30 min-h-screen">
      {/* هدر اصلی */}
      <div className="rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
            <Scale className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-900" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">قوانین و مقررات</h1>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-neutral-900 rounded-full mt-2 sm:mt-3"></div>
          </div>
        </div>
        
        <div className="p-2 sm:p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            لطفاً قبل از استفاده از خدمات فروشگاه، قوانین و مقررات زیر را با دقت مطالعه کنید. 
            استفاده از خدمات ما به منزله پذیرش این قوانین است.
          </p>
        </div>
      </div>

      {/* لیست قوانین */}
      <div className="space-y-4 sm:space-y-6 mr-0 sm:mr-10">
        {policies.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">هیچ قانونی تعریف نشده</h3>
            <p className="text-sm sm:text-base text-gray-500">در حال حاضر قوانین و مقرراتی برای این فروشگاه تعریف نشده است.</p>
          </div>
        ) : (
          policies.map((item, index) => {
            const IconComponent = getIconForPolicy(item.section);
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border hover:border-blue-200"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 p-1.5 sm:p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                        {item.section}
                      </h3>
                      
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          {item.subsection}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* خط جداکننده زیبا */}
                <div className="h-1 bg-gradient-to-r"></div>
              </div>
            );
          })
        )}
      </div>

      {/* فوتر */}
      <div className="mt-8 sm:mt-12 bg-white rounded-xl shadow-md p-4 sm:p-6 border-t-2 border-gray-200 mr-0 sm:mr-10">
        <div className="flex items-start sm:items-center gap-3 text-gray-600">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm leading-relaxed">
            در صورت وجود هرگونه سوال یا ابهام در خصوص قوانین، با پشتیبانی تماس بگیرید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;