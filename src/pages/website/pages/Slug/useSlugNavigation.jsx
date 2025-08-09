// hooks/useSlugNavigation.js
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebsite } from './WebsiteProvider';

export const useSlugNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug, websiteId } = useWebsite();

  const navigateToPage = (pageName, params = {}) => {
    if (!slug) {
      console.error('Slug not found');
      return;
    }

    let path = `/${slug}/${pageName}`;
   
    if (params.productId) {
      path += `/${params.productId}`;
    }

    navigate(path, {
      state: { websiteId },
      ...params.navigationOptions
    });
  };

  const getPageUrl = (pageName, params = {}) => {
    if (!slug) return '#';
   
    let path = `/${slug}/${pageName}`;
   
    if (params.productId) {
      path += `/${params.productId}`;
    }
   
    return path;
  };

  const isCurrentPage = (pageName) => {
    if (!slug) return false;
    const expectedPath = `/${slug}/${pageName}`;
    return location.pathname === expectedPath;
  };

  const navigateWithState = (path, additionalState = {}) => {
    navigate(path, {
      state: {
        websiteId,
        ...additionalState
      }
    });
  };

  return {
    navigateToPage,
    getPageUrl,
    isCurrentPage,
    navigateWithState,
    slug,
    websiteId,
    currentPath: location.pathname
  };
};