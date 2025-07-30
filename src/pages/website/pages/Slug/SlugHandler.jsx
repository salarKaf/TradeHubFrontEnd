// pages/website/pages/SlugHandler.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWebsiteIdBySlug } from '/src/API/website.js';

const SlugHandler = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSlug = async () => {
      if (!slug) {
        setError('اسلاگ معتبر نیست');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching website ID for slug:', slug);
        const response = await getWebsiteIdBySlug(slug);

        if (response && response.website_id) {
          // اگر آیدی پیدا شد، کاربر رو به صفحه اصلی فروشگاه هدایت کن
          navigate(`/${slug}/home`, {
            state: { websiteId: response.website_id },
            replace: true
          });
        } else {
          setError('فروشگاه مورد نظر یافت نشد');
        }
      } catch (err) {
        console.error('خطا در بارگذاری فروشگاه:', err);
        setError('خطایی در بارگذاری فروشگاه رخ داده است');
      } finally {
        setLoading(false);
      }
    };

    handleSlug();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">در حال بارگذاری فروشگاه...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطا</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SlugHandler;