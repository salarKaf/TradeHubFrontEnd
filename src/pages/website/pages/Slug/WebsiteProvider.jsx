// pages/website/pages/WebsiteProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getWebsiteIdBySlug } from '/src/API/website.js';

const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
  const [websiteId, setWebsiteId] = useState(null);
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [slugLoading, setSlugLoading] = useState(true);

  const { slug } = useParams();
  const location = useLocation();

  // اول چک کن از state آمده
  useEffect(() => {
    if (location.state?.websiteId) {
      console.log('🎯 WebsiteProvider: Website ID from state:', location.state.websiteId);
      setWebsiteId(location.state.websiteId);
      setSlugLoading(false);
      return;
    }

    // اگر از state نیامده، از slug بگیر
    if (slug && !websiteId) {
      console.log('🔍 WebsiteProvider: No state websiteId, fetching from slug:', slug);
      fetchWebsiteIdFromSlug();
    }
  }, [location.state, slug]);

  const fetchWebsiteIdFromSlug = async () => {
    try {
      setSlugLoading(true);
      console.log('🚀 WebsiteProvider: Fetching website ID for slug:', slug);

      const response = await getWebsiteIdBySlug(slug);

      if (response && response.website_id) {
        console.log('✅ WebsiteProvider: Website ID from slug:', response.website_id);
        setWebsiteId(response.website_id);
      } else {
        console.error('❌ WebsiteProvider: No website found for slug:', slug);
        setError('فروشگاه یافت نشد');
      }
    } catch (err) {
      console.error('❌ WebsiteProvider: Error fetching website ID:', err);
      setError('خطا در بارگذاری فروشگاه');
    } finally {
      setSlugLoading(false);
    }
  };

  // پاک کردن cache وقتی slug تغییر میکنه
  useEffect(() => {
    setWebsiteData(null);
    setError(null);
    setWebsiteId(null);
    setSlugLoading(true);
  }, [slug]);

  const updateWebsiteData = (data) => {
    console.log('📊 WebsiteProvider: Updating website data:', data);
    setWebsiteData(data);
    setError(null);
  };

  const setLoadingState = (loadingState) => {
    setLoading(loadingState);
  };

  const setErrorState = (errorMessage) => {
    setError(errorMessage);
  };

  const value = {
    websiteId,
    websiteData,
    slug,
    loading,
    error,
    slugLoading,
    setLoading: setLoadingState,
    setError: setErrorState,
    updateWebsiteData,
    isDataLoaded: !!websiteData && !!websiteId,
    hasError: !!error,
    isLoading: loading || slugLoading,
  };

  console.log('🔍 WebsiteProvider Current State:', {
    slug,
    websiteId,
    slugLoading,
    hasWebsiteData: !!websiteData,
    locationState: location.state?.websiteId || 'none'
  });

  return (
    <WebsiteContext.Provider value={value}>
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};

export const useWebsiteId = () => {
  const { websiteId } = useWebsite();
  return websiteId;
};

export const useWebsiteData = () => {
  const { websiteData, loading, error, isDataLoaded } = useWebsite();
  return { websiteData, loading, error, isDataLoaded };
};