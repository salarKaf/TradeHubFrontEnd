import { Search } from 'lucide-react';

const CustomersToolbar = ({ isOpenTable, sortBy, handleSort, searchTerm, handleSearch, totalItems }) => {
    if (!isOpenTable) return null;
   
    return (
        <div  className="px-3  py-3 sm:py-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
                {/* Filters */}
                <div dir='ltr' className="flex items-center gap-1 sm:gap-2 font-modam overflow-x-auto">
                    <button
                        onClick={() => handleSort('highest_purchase')}
                        className={`px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base ${
                            sortBy === 'highest_purchase'
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-700'
                        }`}
                    >
                        بیشترین مبلغ خرید
                    </button>
                    <button
                        onClick={() => handleSort('most_orders')}
                        className={`px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base ${
                            sortBy === 'most_orders'
                                ? 'text-purple-600 font-medium'
                                : 'text-gray-700'
                        }`}
                    >
                        بیشترین سفارش
                    </button>
                    <button
                        onClick={() => handleSort('newest')}
                        className={`px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base ${
                            sortBy === 'newest'
                                ? 'text-red-600 font-medium'
                                : 'text-gray-700'
                        }`}
                    >
                        جدیدترین
                    </button>
                    <h1 className="px-2 sm:px-4 py-2 text-gray-700 font-semibold rounded-lg transition-colors whitespace-nowrap text-sm md:text-base">
                        :مرتب سازی
                    </h1>
                    <img 
                        src='/SellerPanel/Products/icons8-sort-by-50 1.png' 
                        alt="sort" 
                        className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                </div>
               
                {/* Search */}
                <div className="relative flex-1 lg:max-w-md">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder={`جست و جو در میان ${totalItems} مشتری`}
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pr-8 sm:pr-10 pl-3 sm:pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomersToolbar;