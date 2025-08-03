import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';

const CustomersHeader = ({ isOpenTable, setIsOpenTable , title , logo }) => {
    return (
        <div className="px-3 sm:px-4 py-3 sm:py-4">
            <div className="relative flex items-center mb-4 sm:mb-6 gap-2 sm:gap-3 font-modam">
                <img
                    className="w-6 h-6 sm:w-8 md:w-9 sm:h-8 md:h-9"
                    src={logo}
                    alt="products"
                />
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{title}</h2>
                
                {/* آیکون فلش برای باز و بسته کردن جدول */}
                <div className="flex justify-between items-center mb-3 sm:mb-4 mt-3 sm:mt-5">
                    <button
                        onClick={() => setIsOpenTable(!isOpenTable)}
                        className="text-lg sm:text-xl text-[#4D4D4D] hover:text-black transition-colors"
                    >
                        {isOpenTable ? (
                            <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                            <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </button>
                </div>
                
                <div className="absolute bottom-0 left-6 sm:left-8 right-0 h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"></div>
            </div>
        </div>
    );
};

export default CustomersHeader;