import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ProductsHeader = ({ isOpenTable, setIsOpenTable }) => {
    const { websiteId } = useParams();
   
    return (
        <div className="px-4 py-4">
            <div className="relative flex flex-col md:flex-row md:items-center mb-6 gap-3 font-modam">
                <div className="flex items-center gap-3">
                    <img
                        className="w-9 h-9"
                        src="/SellerPanel/Products/icons8-product-50 1.png"
                        alt="products"
                    />
                    <h2 className="text-2xl font-semibold">محصولات</h2>
                    
                    <button
                        onClick={() => setIsOpenTable(!isOpenTable)}
                        className="text-xl text-[#4D4D4D] hover:text-black transition-colors"
                    >
                        {isOpenTable ? (
                            <FaChevronDown className="w-5 h-5" />
                        ) : (
                            <FaChevronRight className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <Link
                    to={`/seller/products/${websiteId}/add`}
                    className="md:mr-auto md:pr-8 bg-[#1e202d] font-modam font-medium text-sm md:text-lg w-full md:w-64 text-white py-3 md:py-4 rounded-full shadow-md text-center md:text-right  hover:bg-[#2a2d3f] transition-colors"
                >
                    + افزودن محصــول جدید
                </Link>
                
                <div className="absolute bottom-0 left-8 right-0 h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"></div>
            </div>
        </div>
    );
};

export default ProductsHeader;