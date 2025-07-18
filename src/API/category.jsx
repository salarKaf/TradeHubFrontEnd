// src/API/category.js
import axios from "axios";
import { coreBaseURL } from './api';


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
