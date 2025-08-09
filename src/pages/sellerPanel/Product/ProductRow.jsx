// ProductRow.js
import { Edit, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { editItem } from '../../../API/Items';
import { useState } from 'react';

const ProductRow = ({ product, onDelete, websiteId }) => {
   const [isToggling, setIsToggling] = useState(false);
   const [isAvailable, setIsAvailable] = useState(product.category === "فعال");
  
   const formatNumber = (num) => {
       if (!num && num !== 0) return '0';
       
       const cleanNum = parseFloat(num);
       
       if (cleanNum % 1 === 0) {
           return cleanNum.toLocaleString('fa-IR');
       } else {
           return cleanNum.toLocaleString('fa-IR', {
               maximumFractionDigits: 2,
               minimumFractionDigits: 0
           });
       }
   };
  
   const toggleAvailability = async () => {
       try {
           setIsToggling(true);
           const newStatus = !isAvailable;
           const newStock = newStatus ? 10000 : 0;
           await editItem(product.id, {
               is_available: newStatus,
               stock: newStock
           });
           setIsAvailable(newStatus);
       } catch (err) {
           console.error("❌ خطا در تغییر وضعیت محصول:", err);
           alert("خطا در تغییر وضعیت محصول");
       } finally {
           setIsToggling(false);
       }
   };
  
   return (
       <div className="px-5 py-5 hover:bg-gray-50 transition-colors min-w-[800px] font-modam">
           <div className="grid grid-cols-12 gap-4 items-center">
               <div className="col-span-3">
                   <span className="font-medium text-gray-900 text-sm md:text-base">{product.name}</span>
               </div>
               <div className="col-span-2 text-gray-600 text-sm md:text-base">
                   {formatNumber(product.sales)} فروش
               </div>
               <div className="col-span-2 font-medium text-gray-900 text-sm md:text-base">
                   {formatNumber(product.price)} ریال
               </div>
               <div className="col-span-2 text-gray-600 text-sm md:text-base text-center">
                   {product.status}
               </div>
               <div className="col-span-2">
                   <button
                       onClick={toggleAvailability}
                       disabled={isToggling}
                       className={`text-xs md:text-sm px-2 md:px-3 mx-10 py-1 rounded-full transition-colors text-center ${
                           isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                       }`}
                   >
                       {isToggling ? "..." : isAvailable ? "فعال" : "غیرفعال"}
                   </button>
               </div>
               <div className="col-span-1 flex items-center justify-center gap-2">
                   <button
                       onClick={() => onDelete(product)}
                       className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                   >
                       <Trash2 size={14} className="md:w-4 md:h-4" />
                   </button>
                   <Link to={`/detailProduct/${websiteId}/${product.id}`}
                       className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                   >
                       <Edit size={14} className="md:w-4 md:h-4" />
                   </Link>
               </div>
           </div>
       </div>
   );
};

export default ProductRow;