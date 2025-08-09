import { Search } from 'lucide-react';

const ProductsToolbar = ({ isOpenTable, sortBy, handleSort, searchTerm, handleSearch, totalItems }) => {
    if (!isOpenTable) return null;

    return (
        <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Search - Mobile First */}
                <div className="relative w-full lg:flex-1 lg:max-w-md lg:order-2">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder={`جست و جو در میان ${totalItems} فاکتور سفارش`}
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>

                {/* Filters */}
                <div dir='rtl' className="flex items-center gap-1 sm:gap-2 font-modam lg:order-1 overflow-x-auto">
                    <h1 className="px-2 sm:px-4 py-2 text-gray-700 font-semibold rounded-lg transition-colors text-xs sm:text-base whitespace-nowrap">
                        مرتب سازی بر اساس:
                    </h1>
                    <img src='/SellerPanel/Products/icons8-sort-by-50 1.png' alt="sort" className="w-6 h-6 flex-shrink-0" />

                    <button
                        onClick={() => handleSort('newest')}
                        className={`px-2 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-base whitespace-nowrap ${sortBy === 'newest'
                            ? 'text-red-600 font-medium'
                            : 'text-gray-700'
                            }`}
                    >
                        جدیدترین
                    </button>
                    <button
                        onClick={() => handleSort('bestselling')}
                        className={`px-2 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-base whitespace-nowrap ${sortBy === 'bestselling'
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-700'
                            }`}
                    >
                        بیشترین مبلغ
                    </button>
                    <button
                        onClick={() => handleSort('complete')}
                        className={`px-2 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-base whitespace-nowrap ${sortBy === 'complete'
                            ? 'text-green-700 font-medium'
                            : 'text-gray-700'
                            }`}
                    >
                        تحویل داده شده
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsToolbar;