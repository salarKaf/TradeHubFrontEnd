import { Search } from 'lucide-react';

const ProductsToolbar = ({ isOpenTable, sortBy, handleSort, searchTerm, handleSearch }) => {
    if (!isOpenTable) return null;
    
    return (
        <div className="px-6 py-4">
            <div className="hidden md:flex items-center justify-between gap-4">
                <div dir='ltr' className="flex items-center gap-2 font-modam">
                    <button
                        onClick={() => handleSort('bestselling')}
                        className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'bestselling'
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-700'
                        }`}
                    >
                        پر فروش ترین
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
                    <h1 className="px-4 py-2 text-gray-700 font-semibold rounded-lg transition-colors">
                        :مرتب سازی
                    </h1>
                    <img src='/SellerPanel/Products/icons8-sort-by-50 1.png' alt="sort" />
                </div>
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="جست و جو در میان محصولات"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="md:hidden space-y-4">
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="جست و جو در محصولات"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <img src='/SellerPanel/Products/icons8-sort-by-50 1.png' alt="sort" className="w-5 h-5" />
                    <span className="text-sm text-gray-700 font-medium">مرتب سازی:</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleSort('newest')}
                            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${sortBy === 'newest'
                                ? 'bg-red-100 text-red-600 font-medium'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            جدیدترین
                        </button>
                        <button
                            onClick={() => handleSort('bestselling')}
                            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${sortBy === 'bestselling'
                                ? 'bg-blue-100 text-blue-600 font-medium'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            پرفروش
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsToolbar;