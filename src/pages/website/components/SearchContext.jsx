// 1. SearchContext.js - ایجاد Context برای مدیریت جستجو
import React, { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // داده‌های نمونه محصولات (در پروژه واقعی از API دریافت می‌شود)
  const allProducts = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `محصول شماره ${i + 1}`,
    price: `${(i + 1) * 100_000} تومان`,
    rating: Math.floor(Math.random() * 5) + 1,
    discount: i % 5 === 0 ? "10%" : null,
    soldOut: i % 7 === 0,
    category: ['الکترونیک', 'پوشاک', 'خانه و آشپزخانه', 'کتاب', 'ورزش'][i % 5],
    description: `توضیحات محصول شماره ${i + 1}`,
    createdAt: new Date(Date.now() - i * 10000000),
  }));

  // تابع جستجو
  const performSearch = (term) => {
    setSearchTerm(term);
    setIsSearching(true);

    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // شبیه‌سازی تاخیر API
    setTimeout(() => {
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase())
      );
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  // پاک کردن جستجو
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const value = {
    searchTerm,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
    allProducts
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

