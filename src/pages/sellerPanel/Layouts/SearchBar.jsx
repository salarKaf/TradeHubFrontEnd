import React from "react";
import { FaSearch } from "react-icons/fa"; // برای آیکن جستجو

const SearchBar = () => {
  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <div className="flex items-center bg-[#EDE6D2] rounded-full p-2">
        {/* آیکن جستجو */}
        <FaSearch className="text-gray-500 ml-4" />
        {/* فیلد جستجو */}
        <input
          type="text"
          placeholder="Hinted search text"
          className="w-full p-2 bg-transparent text-gray-700 focus:outline-none rounded-full pl-4"
        />
      </div>
    </div>
  );
};

export default SearchBar;
