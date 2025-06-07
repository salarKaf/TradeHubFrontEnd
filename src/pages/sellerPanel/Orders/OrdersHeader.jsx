import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';


const OrdersHeader = ({ isOpenTable, setIsOpenTable , title , logo }) => {
    return (
        <div className="px-4 py-4">
            <div className="relative flex items-center mb-6 gap-3 font-modam">
                <img
                    className="w-9 h-9"
                    src={logo}
                    alt="products"
                />
                <h2 className="text-2xl font-semibold"> {title}</h2>

                {/* آیکون فلش برای باز و بسته کردن جدول */}
                <div className="flex justify-between items-center mb-4 mt-5">
                    <button 
                        onClick={() => setIsOpenTable(!isOpenTable)} 
                        className="text-xl text-[#4D4D4D] hover:text-black transition-colors"
                    >
                        {isOpenTable ? (
                            <FaChevronDown className="w-5 h-5" />
                        ) : (
                            <FaChevronLeft  className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <div className="absolute bottom-0 left-8 right-0 h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"></div>
            </div>
        </div>
    );
};


export default OrdersHeader;