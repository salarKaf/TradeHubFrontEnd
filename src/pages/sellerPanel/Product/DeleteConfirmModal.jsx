import { X } from 'lucide-react';


const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">تایید حذف</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <X size={18} className="md:w-5 md:h-5" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                    آیا از حذف محصول "{productName}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                </p>
                <div className="flex flex-col md:flex-row gap-3 md:justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base order-2 md:order-1"
                    >
                        انصراف
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base order-1 md:order-2"
                    >
                        بله، حذف شود
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;