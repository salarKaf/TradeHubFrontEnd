import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    onPreviousPage, 
    onNextPage,
    startIndex,
    itemsPerPage,
    totalItems
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, startPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="mt-6">
            {/* Pagination Controls */}
            <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button 
                        onClick={onPreviousPage}
                        disabled={currentPage === 1}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            currentPage === 1 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-800 text-white hover:bg-gray-900'
                        }`}
                    >
                        <ChevronRight size={16} />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                                currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button 
                        onClick={onNextPage}
                        disabled={currentPage === totalPages}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            currentPage === totalPages 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-800 text-white hover:bg-gray-900'
                        }`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                </div>
            </div>

            {/* Pagination Info */}
            {totalItems > 0 && (
                <div className="text-center mt-4 text-sm text-gray-600">
                    نمایش {startIndex + 1} تا {Math.min(startIndex + itemsPerPage, totalItems)} از {totalItems} فاکتور
                </div>
            )}
        </div>
    );
};


export default Pagination;