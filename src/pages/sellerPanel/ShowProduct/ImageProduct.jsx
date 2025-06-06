import React, { useState } from "react";
import { FaTrashAlt, FaPlus, FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaCheck } from "react-icons/fa";

const ImageGallery = ({ images, onImagesChange, primaryImageIndex, onPrimaryImageChange, isEditable = true }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showPrimarySetConfirm, setShowPrimarySetConfirm] = useState(false);

    // افزودن تصویر جدید
    const handleAddImage = (e) => {
        if (!isEditable) return;

        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImages = [...images, reader.result];
                onImagesChange(newImages);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    // تنظیم عکس اصلی
    const setPrimaryImage = () => {
        if (!isEditable) return;

        onPrimaryImageChange(currentImageIndex);
        setShowPrimarySetConfirm(true);
        setTimeout(() => {
            setShowPrimarySetConfirm(false);
        }, 2000);
    };

    // حذف تصویر
    const confirmDeleteImage = (index) => {
        if (!isEditable) return;
        setShowDeleteConfirm(index);
    };

    const deleteImage = () => {
        const newImages = images.filter((_, i) => i !== showDeleteConfirm);
        let newPrimaryIndex = primaryImageIndex;

        if (showDeleteConfirm === primaryImageIndex) {
            newPrimaryIndex = 0;
        } else if (showDeleteConfirm < primaryImageIndex) {
            newPrimaryIndex = primaryImageIndex - 1;
        }

        if (showDeleteConfirm === currentImageIndex) {
            setCurrentImageIndex(0);
        } else if (showDeleteConfirm < currentImageIndex) {
            setCurrentImageIndex(currentImageIndex - 1);
        }

        onImagesChange(newImages);
        onPrimaryImageChange(newPrimaryIndex);
        setShowDeleteConfirm(null);
    };

    // تبدیل عکس قبلی/بعدی
    const prevImage = () => {
        setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
    };

    const nextImage = () => {
        setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
    };

    return (
        <div className="flex flex-col items-center space-y-4 w-1/3">
            {/* تصویر اصلی */}
            <div className="w-[420px] h-[420px] relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                {images.length > 0 ? (
                    <>
                        <img
                            src={images[currentImageIndex]}
                            alt={`تصویر ${currentImageIndex + 1}`}
                            className="object-cover w-full h-full"
                        />

                        {/* دکمه‌های ناوبری */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                >
                                    <FaChevronRight />
                                </button>
                            </>
                        )}

                        {/* دکمه تنظیم به عنوان اصلی */}
                        {isEditable && (
                            <button
                                onClick={setPrimaryImage}
                                className={`absolute bottom-2 left-2 px-3 py-1 text-xs rounded-md transition-all ${currentImageIndex === primaryImageIndex
                                    ? 'bg-green-600 text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {currentImageIndex === primaryImageIndex ? (
                                    <span className="flex items-center gap-1">
                                        <FaCheck className="text-xs" />
                                        عکس اصلی
                                    </span>
                                ) : (
                                    'تنظیم اصلی'
                                )}
                            </button>
                        )}

                        {/* دکمه تمام صفحه */}
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="absolute bottom-2 right-2 bg-gray-700 bg-opacity-70 text-white p-2 rounded-md hover:bg-opacity-90"
                        >
                            <FaExpand />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center justify-center w-96 h-96 text-gray-400">
                        <span>هیچ تصویری انتخاب نشده</span>
                    </div>
                )}
            </div>

            {/* تصاویر کوچک */}
            <div className="flex items-center gap-2 flex-wrap max-w-72">
                {images.map((image, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={image}
                            alt={`تصویر کوچک ${index + 1}`}
                            className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all ${index === currentImageIndex
                                ? 'border-blue-500 opacity-100'
                                : 'border-gray-300 opacity-70 hover:opacity-100'
                                } ${index === primaryImageIndex ? 'ring-2 ring-green-400' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                        {/* دکمه حذف */}
                        {isEditable && (
                            <button
                                onClick={() => confirmDeleteImage(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ fontSize: '10px' }}
                            >
                                <FaTrashAlt />
                            </button>
                        )}
                    </div>
                ))}

                {/* دکمه افزودن تصویر */}
                {isEditable && (
                    <label className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <FaPlus className="text-gray-400 text-sm mb-1" />
                        <span className="text-xs text-gray-500">افزودن</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAddImage}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {/* مودال تمام صفحه */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative max-w-4xl max-h-4xl">
                        <img
                            src={images[currentImageIndex]}
                            alt={`تصویر بزرگ ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30"
                        >
                            <FaTimes />
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30"
                                >
                                    <FaChevronRight />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* مودال تایید حذف */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold mb-4 text-center">تایید حذف</h3>
                        <p className="text-gray-600 mb-6 text-center">آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                انصراف
                            </button>
                            <button
                                onClick={deleteImage}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* نوتیفیکیشن تنظیم عکس اصلی */}
            {showPrimarySetConfirm && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50 flex items-center gap-2">
                    <FaCheck />
                    <span>عکس به عنوان تصویر اصلی تنظیم شد</span>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;