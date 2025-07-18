// src/API/category.js
import axios from "axios";
import { coreBaseURL } from './api';



export const createMainCategory = async ({ website_id, name }) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${coreBaseURL}/websites/create_website_category`,
    { website_id, name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


export const getWebsiteCategories = async (websiteId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${coreBaseURL}/websites/get_website_categories/${websiteId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const getItemCountByCategoryId = async (categoryId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${coreBaseURL}/items/items/item-count/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};



export const editWebsiteCategory = async ({ category_id, website_id, name }) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${coreBaseURL}/websites/edit_website_category/${category_id}`,
    {
      
      website_id,
      category_id,
      name,

    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};




// ارسال زیر دسته‌بندی جدید
export const createWebsiteSubcategory = async (parentId, name) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${coreBaseURL}/websites/create_website_subcategory`,
    {
      parent_category_id: parentId,
      name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// گرفتن زیر دسته‌های یک دسته خاص
export const getSubcategoriesByCategoryId = async (categoryId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${coreBaseURL}/websites/get_subcategories_by_category_id/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};




export const editSubCategory = async ({ subcategory_id, website_id, name }) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${coreBaseURL}/websites/edit_website_subcategory/${subcategory_id}`,
    {
      website_id,
      subcategory_id,
      name,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


// حذف دسته‌بندی اصلی
export const deleteWebsiteCategory = async (categoryId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${coreBaseURL}/websites/delete_website_category/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// حذف زیردسته‌بندی
export const deleteWebsiteSubcategory = async (subcategoryId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${coreBaseURL}/websites/delete_website_subcategory/${subcategoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
