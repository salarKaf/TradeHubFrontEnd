import { Search } from 'lucide-react';

const CustomersToolbar = ({ isOpenTable, sortBy, handleSort, searchTerm, handleSearch, totalItems }) => {
    if (!isOpenTable) return null;
    
    return (
        <div className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
                {/* Filters */}
                <div dir='ltr' className="flex items-center gap-2 font-modam">

                    <button
                        onClick={() => handleSort('highest_purchase')}
                        className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'highest_purchase'
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-700'
                            }`}
                    >
                        بیشترین خرید
                    </button>
                    <button
                        onClick={() => handleSort('most_orders')}
                        className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'most_orders'
                            ? 'text-purple-600 font-medium'
                            : 'text-gray-700'
                            }`}
                    >
                        بیشترین سفارش
                    </button>
                    <button
                        onClick={() => handleSort('newest')}
                        className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'newest'
                            ? 'text-red-600 font-medium'
                            : 'text-gray-700'
                            }`}
                    >
                        جدیدترین
                    </button>
                    <button
                        onClick={() => handleSort('alphabetical')}
                        className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'alphabetical'
                            ? 'text-orange-600 font-medium'
                            : 'text-gray-700'
                            }`}
                    >
                        الفبایی
                    </button>
                    <h1 className="px-4 py-2 text-gray-700 font-semibold rounded-lg transition-colors">
                        :مرتب سازی
                    </h1>
                    <img src='/public/SellerPanel/Products/icons8-sort-by-50 1.png' alt="sort" />
                </div>
                
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder={`جست و جو در میان ${totalItems} مشتری`}
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomersToolbar;