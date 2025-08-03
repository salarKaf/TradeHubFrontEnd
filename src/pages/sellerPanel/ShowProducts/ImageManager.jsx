import React, { useState, useEffect } from "react";
import { FaTimes, FaTrashAlt, FaPlus, FaChevronLeft, FaChevronRight, FaExpand, FaCheck } from "react-icons/fa";
import { getItemImages, getItemImageById } from '../../../API/Items';
import axios from 'axios';
import { deleteItemImage } from '../../../API/Items';
import { setMainItemImage } from '../../../API/Items';

const ImageManager = ({
    productId,
    onImagesChange,
    className = ""
}) => {
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showPrimarySetConfirm, setShowPrimarySetConfirm] = useState(false);

    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    // دریافت تصاویر از بک‌اند
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imageMetaList = await getItemImages(productId);
                const imageUrls = await Promise.all(
                    imageMetaList.map(async (img) => {
                        const url = await getItemImageById(img.image_id);
                        return {
                            url,
                            isMain: img.is_main,
                            imageId: img.image_id
                        };
                    })
                );

                const sortedImages = imageUrls.sort((a, b) => b.isMain - a.isMain);
                const imagesList = sortedImages;
                const primaryIndex = imageUrls.findIndex(img => img.isMain) ?? 0;

                setImages(imagesList);
                setPrimaryImageIndex(primaryIndex);

                // اطلاع رسانی به کامپوننت والد
                if (onImagesChange) {
                    onImagesChange({
                        images: imagesList,
                        primaryImageIndex: primaryIndex
                    });
                }
            } catch (error) {
                console.error("❌ خطا در دریافت تصاویر:", error);
            }
        };

        if (productId) {
            fetchImages();
        }
    }, [productId, onImagesChange]);

    // انتخاب فایل برای آپلود
    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedImageFile(file);
        e.target.value = '';
    };

    // آپلود تصویر
    const uploadImage = async () => {
        if (!selectedImageFile) return;

        setIsUploading(true);
        setUploadStatus(null);

        const formData = new FormData();
        formData.append('files', selectedImageFile);
        formData.append('is_main_flags', 'true');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://media.localhost/api/v1/item/upload_item_images/${productId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            // بروزرسانی تصاویر
            const imageMetaList = await getItemImages(productId);
            const imageUrls = await Promise.all(
                imageMetaList.map(async (img) => {
                    const url = await getItemImageById(img.image_id);
                    return {
                        url,
                        isMain: img.is_main
                    };
                })
            );

            const sortedImages = imageUrls.sort((a, b) => b.isMain - a.isMain);
            const imagesList = sortedImages.map(i => i.url);
            const primaryIndex = imageUrls.findIndex(img => img.isMain) ?? 0;

            setImages(imagesList);
            setPrimaryImageIndex(primaryIndex);

            // اطلاع رسانی به کامپوننت والد
            if (onImagesChange) {
                onImagesChange({
                    images: imagesList,
                    primaryImageIndex: primaryIndex
                });
            }

            setUploadStatus('success');
            setSelectedImageFile(null);
            setTimeout(() => setUploadStatus(null), 3000);

        } catch (error) {
            console.error("❌ خطا در آپلود تصویر:", error);
            setUploadStatus('error');
            setTimeout(() => setUploadStatus(null), 5000);
        } finally {
            setIsUploading(false);
        }
    };

    const cancelUpload = () => {
        setSelectedImageFile(null);
        setUploadStatus(null);
    };

    // تنظیم عکس اصلی
    const setPrimaryImage = async () => {
        const selected = images[currentImageIndex];

        if (!selected?.imageId) {
            console.error("❌ تصویر انتخاب شده آیدی ندارد");
            return;
        }

        try {
            await setMainItemImage(selected.imageId);

            const updatedImages = images.map((img, index) => ({
                ...img,
                isMain: index === currentImageIndex
            }));

            setImages(updatedImages);
            setPrimaryImageIndex(currentImageIndex);
            setShowPrimarySetConfirm(true);

            if (onImagesChange) {
                onImagesChange({
                    images: updatedImages,
                    primaryImageIndex: currentImageIndex
                });
            }

            setTimeout(() => setShowPrimarySetConfirm(false), 2000);
        } catch (err) {
            // خطا در حال حاضر در API فایل لاگ شده
        }
    };

    // حذف تصویر
    const confirmDeleteImage = (index) => {
        setShowDeleteConfirm(index);
    };

    const deleteImage = async () => {
        const targetImage = images[showDeleteConfirm];
        if (!targetImage || !targetImage.imageId) {
            console.error("❌ تصویر برای حذف پیدا نشد");
            setShowDeleteConfirm(null);
            return;
        }

        setIsDeleting(true);

        try {
            await deleteItemImage(targetImage.imageId);

            // حذف از state
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

            setImages(newImages);
            setPrimaryImageIndex(newPrimaryIndex);
            setShowDeleteConfirm(null);

            if (onImagesChange) {
                onImagesChange({
                    images: newImages,
                    primaryImageIndex: newPrimaryIndex
                });
            }

            setDeleteSuccess(true);
            setTimeout(() => setDeleteSuccess(false), 3000);
        } catch (err) {
            console.error("❌ خطا در حذف تصویر:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    // ناوبری تصاویر
    const prevImage = () => {
        setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
    };

    const nextImage = () => {
        setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
    };

    return (
        <>
            <div className={`flex flex-col items-center space-y-4 w-full max-w-md mx-auto ${className}`}>
                {/* تصویر اصلی */}
                <div className="w-full aspect-square max-w-[420px] relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                    {images.length > 0 ? (
                        <>
                            <img
                                src={images[currentImageIndex].url}
                                alt={`تصویر ${currentImageIndex + 1}`}
                                className="object-cover w-full h-full"
                            />

                            {/* دکمه‌های ناوبری */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
                                    >
                                        <FaChevronLeft className="text-sm md:text-base" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
                                    >
                                        <FaChevronRight className="text-sm md:text-base" />
                                    </button>
                                </>
                            )}

                            {/* دکمه تنظیم به عنوان اصلی */}
                            <button
                                onClick={setPrimaryImage}
                                className={`absolute bottom-2 left-2 px-2 md:px-3 py-1 text-xs rounded-md transition-all ${currentImageIndex === primaryImageIndex
                                    ? 'bg-green-600 text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {currentImageIndex === primaryImageIndex ? (
                                    <span className="flex items-center gap-1">
                                        <FaCheck className="text-xs" />
                                        <span className="hidden sm:inline">عکس اصلی</span>
                                        <span className="sm:hidden">اصلی</span>
                                    </span>
                                ) : (
                                    <>
                                        <span className="hidden sm:inline">تنظیم اصلی</span>
                                        <span className="sm:hidden">اصلی</span>
                                    </>
                                )}
                            </button>

                            {/* دکمه تمام صفحه */}
                            <button
                                onClick={() => setIsFullscreen(true)}
                                className="absolute bottom-2 right-2 bg-gray-700 bg-opacity-70 text-white p-1.5 md:p-2 rounded-md hover:bg-opacity-90"
                            >
                                <FaExpand className="text-xs md:text-sm" />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                            <span className="text-sm md:text-base text-center px-4">هیچ تصویری انتخاب نشده</span>
                        </div>
                    )}
                </div>

                {/* تصاویر کوچک */}
                <div className="flex items-center gap-2 flex-wrap justify-center max-w-full overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <div key={index} className="relative group flex-shrink-0">
                            <img
                                src={image.url}
                                alt={`تصویر کوچک ${index + 1}`}
                                className={`w-12 h-12 md:w-16 md:h-16 object-cover rounded-md cursor-pointer border-2 transition-all ${index === currentImageIndex
                                    ? 'border-blue-500 opacity-100'
                                    : 'border-gray-300 opacity-70 hover:opacity-100'
                                    } ${index === primaryImageIndex ? 'ring-2 ring-green-400' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                            {/* دکمه حذف */}
                            <button
                                onClick={() => confirmDeleteImage(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ fontSize: '8px' }}
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    ))}

                    {/* دکمه افزودن تصویر */}
                    {!selectedImageFile ? (
                        <label className="w-12 h-12 md:w-16 md:h-16 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all flex-shrink-0">
                            <FaPlus className="text-gray-400 text-xs mb-0.5" />
                            <span className="text-xs text-gray-500 hidden md:block">افزودن</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAddImage}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            {/* پیش‌نمایش تصویر انتخاب شده */}
                            <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-blue-400 rounded-md overflow-hidden">
                                <img
                                    src={URL.createObjectURL(selectedImageFile)}
                                    alt="پیش‌نمایش"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* دکمه‌های ارسال و انصراف */}
                            <div className="flex gap-1">
                                <button
                                    onClick={uploadImage}
                                    disabled={isUploading}
                                    className="px-1.5 md:px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-2 h-2 md:w-3 md:h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span className="hidden sm:inline">ارسال...</span>
                                        </>
                                    ) : (
                                        'ارسال'
                                    )}
                                </button>

                                <button
                                    onClick={cancelUpload}
                                    disabled={isUploading}
                                    className="px-1.5 md:px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                    <span className="hidden sm:inline">انصراف</span>
                                    <span className="sm:hidden">×</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* مودال تمام صفحه */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={images[currentImageIndex].url}
                            alt={`تصویر بزرگ ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-2 md:top-4 right-2 md:right-4 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30"
                        >
                            <FaTimes className="text-sm md:text-base" />
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-2 md:p-3 rounded-full hover:bg-opacity-30"
                                >
                                    <FaChevronLeft className="text-sm md:text-base" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-2 md:p-3 rounded-full hover:bg-opacity-30"
                                >
                                    <FaChevronRight className="text-sm md:text-base" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* مودال تایید حذف */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-4 md:p-6 rounded-lg max-w-sm w-full">
                        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-center">تایید حذف</h3>
                        <p className="text-gray-600 mb-4 md:mb-6 text-center text-sm md:text-base">آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟</p>
                        <div className="flex justify-center gap-3 md:gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-3 md:px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm md:text-base"
                            >
                                انصراف
                            </button>

                            <button
                                onClick={deleteImage}
                                disabled={isDeleting}
                                className="px-3 md:px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2 min-w-[60px] md:min-w-[80px] text-sm md:text-base"
                            >
                                {isDeleting ? (
                                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "حذف"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* نوتیفیکیشن تنظیم عکس اصلی */}
            {showPrimarySetConfirm && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-3 md:px-4 py-2 rounded-md z-50 flex items-center gap-2 text-sm md:text-base max-w-xs">
                    <FaCheck className="flex-shrink-0" />
                    <span>عکس به عنوان تصویر اصلی تنظیم شد</span>
                </div>
            )}

            {/* نوتیفیکیشن وضعیت آپلود */}
            {uploadStatus === 'success' && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-3 md:px-4 py-2 rounded-md z-50 flex items-center gap-2 text-sm md:text-base max-w-xs">
                    <FaCheck className="flex-shrink-0" />
                    <span>تصویر با موفقیت آپلود شد</span>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-3 md:px-4 py-2 rounded-md z-50 flex items-center gap-2 text-sm md:text-base max-w-xs">
                    <FaTimes className="flex-shrink-0" />
                    <span>خطا در آپلود تصویر. دوباره تلاش کنید</span>
                </div>
            )}

            {deleteSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-3 md:px-4 py-2 rounded-md z-50 flex items-center gap-2 shadow-lg text-sm md:text-base max-w-xs">
                    <FaCheck className="flex-shrink-0" />
                    <span>تصویر با موفقیت حذف شد</span>
                </div>
            )}
        </>
    );
};

export default ImageManager;