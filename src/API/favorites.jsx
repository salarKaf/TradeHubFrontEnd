
import axios from 'axios';
import { coreBaseURL } from './api';


const getBuyerAuthHeader = (websiteId = null) => {
  const id = websiteId || localStorage.getItem('current_store_website_id');
  const token = localStorage.getItem(`buyer_token_${id}`);
  
  if (!token) {
    throw new Error('توکن buyer یافت نشد - باید وارد شوید');
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const addToFavorites = async (itemId, websiteId = null) => {
  try {
    console.log('🔥 Adding to favorites:', { itemId, websiteId });
    
    const response = await axios.post(
      `${coreBaseURL}/favorite/`,
      null,
      {
        ...getBuyerAuthHeader(websiteId),
        params: { item_id: itemId }
      }
    );
    
    console.log('✅ Added to favorites successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error adding to favorites:', error);
    throw error;
  }
};


export const getFavorites = async (websiteId = null) => {
  try {
    console.log('🔥 Getting favorites list');
    
    const response = await axios.get(
      `${coreBaseURL}/favorite/`,
      getBuyerAuthHeader(websiteId)
    );
    
    console.log('✅ Favorites received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error getting favorites:', error);
    throw error;
  }
};


export const removeFromFavorites = async (favoriteId, websiteId = null) => {
  try {
    console.log('🔥 Removing from favorites:', { favoriteId });
    
    const response = await axios.delete(
      `${coreBaseURL}/favorite/delete/${favoriteId}`,
      getBuyerAuthHeader(websiteId)
    );
    
    console.log('✅ Removed from favorites successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error removing from favorites:', error);
    throw error;
  }
};


export const isItemInFavorites = async (itemId, websiteId = null) => {
  try {
    const favorites = await getFavorites(websiteId);
    return favorites.some(fav => fav.item_id === itemId);
  } catch (error) {
    console.error('❌ Error checking if item is in favorites:', error);
    return false;
  }
};


export const getFavoriteIdByItemId = async (itemId, websiteId = null) => {
  try {
    const favorites = await getFavorites(websiteId);
    const favorite = favorites.find(fav => fav.item_id === itemId);
    return favorite ? favorite.id : null;
  } catch (error) {
    console.error('❌ Error finding favorite ID:', error);
    return null;
  }
};