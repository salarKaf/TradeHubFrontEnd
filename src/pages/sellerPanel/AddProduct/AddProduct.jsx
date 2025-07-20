import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaArrowLeft, FaSave, FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaCheck, FaAsterisk, FaChevronDown } from "react-icons/fa";
import { createItem } from '../../../API/Items';
import { getWebsiteCategories, getSubcategoriesByCategoryId } from '../../../API/category';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CategoryDropdown from '../ShowProducts/CategoryDropdown';

const AddProduct = () => {
    const { websiteId } = useParams();

    // وضعیت برای فیلدها و تصاویر
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        category: '',
        subcategory: '',
        link: '',
        description: '',
        additionalInfo: '',
        discount: ''
    });

    // تصاویر انتخاب شده برای آپلود
    const [selectedImages, setSelectedImages] = useState([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    const [errors, setErrors] = useState({});
    const [newlyCreatedItemId, setNewlyCreatedItemId] = useState(null);
    const [categoryTree, setCategoryTree] = useState({});
    const [categoryIdMap, setCategoryIdMap] = useState({}); // اسم به آیدی
    const [showSubcategory, setShowSubcategory] = useState(false);
    
    // وضعیت آپلود تصاویر
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    
    // وضعیت‌های جدید برای بهبود UI
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const mainCategories = await getWebsiteCategories(websiteId);
                const tree = {};
                const nameToId = {};

                for (let category of mainCategories) {
                    const subcategories = await getSubcategoriesByCategoryId(category.id);
                    tree[category.name] = {};
                    nameToId[category.name] = category.id;

                    for (let sub of subcategories) {
                        tree[category.name][sub.name] = {};
                        nameToId[`${category.name}/${sub.name}`] = sub.id;
                    }
                }

                setCategoryTree(tree);
                setCategoryIdMap(nameToId);
            } catch (err) {
                console.error("❌ خطا در دریافت دسته‌بندی:", err);
            }
        };

        if (websiteId) fetchCategories();
    }, [websiteId]);

    // نمایش پیام موفقیت
    const showMessage = (type, text) => {
        setMessageText(text);
        if (type === 'success') {
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 4000);
        } else {
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 4000);
        }
    };

    // تغییرات ورودی‌ها
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });

        // پاک کردن خطا وقتی کاربر شروع به تایپ می‌کند
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // تغییر دسته‌بندی و چک کردن زیردسته
    const handleCategoryChange = (category) => {
        setProductData({
            ...productData,
            category,
            subcategory: '' // ریست زیردسته
        });

        // بررسی اینکه آیا زیردسته دارد
        const parts = category.split('/');
        if (parts.length === 1 && categoryTree[parts[0]]) {
            const hasSubcategories = Object.keys(categoryTree[parts[0]]).length > 0;
            setShowSubcategory(hasSubcategories);
        } else {
            setShowSubcategory(false);
        }

        // پاک کردن خطا
        if (errors.category) {
            setErrors({
                ...errors,
                category: ''
            });
        }
    };

    // انتخاب تصاویر
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const imageFiles = files.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            id: Date.now() + index
        }));

        setSelectedImages([...selectedImages, ...imageFiles]);
        e.target.value = '';
    };

    // حذف تصویر از لیست انتخاب شده
    const removeSelectedImage = (imageId) => {
        const updatedImages = selectedImages.filter(img => img.id !== imageId);
        setSelectedImages(updatedImages);
        
        // اگر تصویر اصلی حذف شد، اولین تصویر را اصلی قرار بده
        if (primaryImageIndex >= updatedImages.length) {
            setPrimaryImageIndex(0);
        }
    };

    // تنظیم تصویر اصلی
    const setPrimaryImage = (index) => {
        setPrimaryImageIndex(index);
    };

    // اعتبارسنجی فیلدها
    const validateFields = () => {
        const newErrors = {};

        if (!productData.name.trim()) {
            newErrors.name = 'نام محصول الزامی است';
        }
        if (!productData.price.trim()) {
            newErrors.price = 'قیمت محصول الزامی است';
        }
        if (!productData.category.trim()) {
            newErrors.category = 'دسته‌بندی محصول الزامی است';
        }
        if (!productData.link.trim()) {
            newErrors.link = 'لینک محصول الزامی است';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // آپلود تصاویر پس از ساخت محصول
    const uploadImages = async (itemId) => {
        if (selectedImages.length === 0) return { success: true };

        setIsUploadingImages(true);
        setUploadStatus('uploading');

        const formData = new FormData();
        
        // اضافه کردن فایل‌ها
        selectedImages.forEach(image => {
            formData.append('files', image.file);
        });

        // اضافه کردن فلگ‌های is_main
        selectedImages.forEach((image, index) => {
            formData.append('is_main_flags', index === primaryImageIndex ? 'true' : 'false');
        });

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://media.localhost/api/v1/item/upload_item_images/${itemId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            setUploadStatus('success');
            
            setTimeout(() => setUploadStatus(null), 3000);

            return { success: true };

        } catch (error) {
            console.error("❌ خطا در آپلود تصاویر:", error);
            setUploadStatus('error');
            setTimeout(() => setUploadStatus(null), 5000);
            return { success: false, error };
        } finally {
            setIsUploadingImages(false);
        }
    };

    // ذخیره تغییرات
    const handleSave = async () => {
        if (!validateFields()) return;

        setIsLoading(true);

        // تعیین آیدی دسته‌بندی
        let categoryId;
        let subcategoryId = null;

        // بررسی اینکه آیا زیردسته انتخاب شده یا نه
        const categoryParts = productData.category.split('/');
        
        if (categoryParts.length === 2) {
            // زیردسته انتخاب شده
            const mainCategory = categoryParts[0];
            const subCategory = categoryParts[1];
            
            categoryId = categoryIdMap[mainCategory];
            subcategoryId = categoryIdMap[`${mainCategory}/${subCategory}`];
        } else if (categoryParts.length === 1) {
            // فقط دسته اصلی انتخاب شده
            categoryId = categoryIdMap[productData.category];
            
            // اگر زیردسته در فرم انتخاب شده باشد
            if (productData.subcategory) {
                subcategoryId = categoryIdMap[`${productData.category}/${productData.subcategory}`];
            }
        }

        if (!categoryId) {
            setIsLoading(false);
            showMessage('error', "خطا در تشخیص آیدی دسته‌بندی");
            return;
        }

        const payload = {
            website_id: websiteId,
            category_id: categoryId,
            name: productData.name,
            description: productData.description,
            price: Number(productData.price),
            delivery_url: productData.link,
            post_purchase_note: productData.additionalInfo,
            stock: 1,
        };

        // اگر زیردسته انتخاب شده، به payload اضافه کن
        if (subcategoryId) {
            payload.subcategory_id = subcategoryId;
        }

        try {
            const createdItem = await createItem(payload);
            const itemId = createdItem.item_id;

            setNewlyCreatedItemId(itemId);

            // اگر تصاویر انتخاب شده‌اند، آنها را آپلود کن
            if (selectedImages.length > 0) {
                const uploadResult = await uploadImages(itemId);
                if (uploadResult.success) {
                    showMessage('success', "محصول و تصاویر با موفقیت ایجاد شدند!");
                } else {
                    showMessage('success', "محصول ایجاد شد اما خطا در آپلود تصاویر رخ داد");
                }
            } else {
                showMessage('success', "محصول با موفقیت ایجاد شد!");
            }

            // ریست کردن فرم
            setProductData({
                name: '',
                price: '',
                category: '',
                subcategory: '',
                link: '',
                description: '',
                additionalInfo: '',
                discount: ''
            });
            
            // پاک کردن تصاویر پس از موفقیت کامل
            setTimeout(() => {
                setSelectedImages([]);
                setPrimaryImageIndex(0);
            }, 2000);

        } catch (error) {
            console.error("❌ خطا در ساخت محصول:", error);
            showMessage('error', "خطا در ساخت محصول");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen">
            {/* پیام‌های وضعیت */}
            {showSuccessMessage && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-bounce">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
                        <FaCheck className="text-sm" />
                    </div>
                    <span className="font-medium">{messageText}</span>
                </div>
            )}

            {showErrorMessage && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-bounce">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full">
                        <FaTimes className="text-sm" />
                    </div>
                    <span className="font-medium">{messageText}</span>
                </div>
            )}

            {/* برگشت به صفحه قبلی */}
            <button
                onClick={() => window.history.back()}
                className="flex items-center mb-6 text-blue-500 hover:text-blue-700"
            >
                <FaArrowLeft className="mr-2" />
                برگشت به صفحه قبل
            </button>

            {/* فرم اطلاعات محصول */}
            <div className="p-6 font-modam">
                <p className="text-lg mb-12">فروشنده‌ی گرامی! پس از ویرایش و یا افزودن اطلاعات محصول برای ذخیره شدن و اعمال تغییرات دکمه‌ی ذخیره را بزنید.</p>
                <h2 className="text-2xl font-semibold mb-12">اطلاعات محصول</h2>

                <div className="flex gap-24 justify-center">
                    {/* بخش تصاویر */}
                    <div className="flex flex-col items-center space-y-4 w-1/3">
                        {/* تصویر اصلی */}
                        <div className="w-[420px] h-[420px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden">
                            {selectedImages.length > 0 ? (
                                <img
                                    src={selectedImages[primaryImageIndex]?.preview}
                                    alt="تصویر اصلی"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <p className="text-lg mb-2">تصاویر محصول</p>
                                    <p className="text-sm">تصاویر خود را انتخاب کنید</p>
                                </div>
                            )}
                        </div>

                        {/* تصاویر کوچک */}
                        <div className="flex items-center gap-2 flex-wrap max-w-72">
                            {selectedImages.map((image, index) => (
                                <div key={image.id} className="relative group">
                                    <img
                                        src={image.preview}
                                        alt={`تصویر ${index + 1}`}
                                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all ${
                                            index === primaryImageIndex
                                                ? 'border-blue-500'
                                                : 'border-gray-300 hover:border-blue-300'
                                        } ${index === primaryImageIndex ? 'ring-2 ring-green-400' : ''}`}
                                        onClick={() => setPrimaryImage(index)}
                                    />
                                    {/* دکمه حذف */}
                                    <button
                                        onClick={() => removeSelectedImage(image.id)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ fontSize: '10px' }}
                                    >
                                        <FaTimes />
                                    </button>
                                    {/* نشانگر تصویر اصلی */}
                                    {index === primaryImageIndex && (
                                        <div className="absolute bottom-0 left-0 bg-green-500 text-white text-xs px-1 rounded-tr-md">
                                            اصلی
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* دکمه افزودن تصویر */}
                            <label className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                <FaPlus className="text-gray-400 text-sm mb-1" />
                                <span className="text-xs text-gray-500">افزودن</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* بخش فرم */}
                    <div className="space-y-6 w-2/4">
                        {/* نام محصول */}
                        <div className="font-modam text-lg">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 ${errors.name ? 'border-red-500' : 'border-gray-800 border-opacity-40'}`}
                                    placeholder="نام محصول"
                                />
                                <FaAsterisk className="absolute left-4 top-6 text-red-500 text-xs" />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="flex gap-2 font-modam text-lg">
                            {/* قیمت محصول */}
                            <div className="w-[30%]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="price"
                                        value={productData.price}
                                        onChange={handleChange}
                                        className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 ${errors.price ? 'border-red-500' : 'border-gray-800 border-opacity-40'}`}
                                        placeholder="قیمت محصول"
                                    />
                                    <FaAsterisk className="absolute left-4 top-6 text-red-500 text-xs" />
                                </div>
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                            </div>

                            {/* دسته بندی محصول */}
                            <div className="w-[70%]">
                                <CategoryDropdown
                                    value={productData.category}
                                    onChange={handleCategoryChange}
                                    error={errors.category}
                                    placeholder="دسته بندی محصول"
                                    websiteId={websiteId}
                                />
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>
                        </div>

                        {/* زیردسته بندی (فقط اگر نیاز باشد) */}
                        {showSubcategory && (
                            <div className="font-modam text-lg">
                                <select
                                    name="subcategory"
                                    value={productData.subcategory}
                                    onChange={handleChange}
                                    className="bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-16 mt-2"
                                >
                                    <option value="">انتخاب زیردسته</option>
                                    {categoryTree[productData.category] && 
                                        Object.keys(categoryTree[productData.category]).map(subcat => (
                                            <option key={subcat} value={subcat}>{subcat}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}

                        {/* لینک محصول دیجیتال */}
                        <div className="font-modam text-lg">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="link"
                                    value={productData.link}
                                    onChange={handleChange}
                                    className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 ${errors.link ? 'border-red-500' : 'border-gray-800 border-opacity-40'}`}
                                    placeholder="لینک محصول دیجیتال"
                                />
                                <FaAsterisk className="absolute left-4 top-6 text-red-500 text-xs" />
                            </div>
                            {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
                        </div>

                        {/* توضیحات محصول */}
                        <div className="font-modam text-lg">
                            <textarea
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                className="bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36 mt-2"
                                placeholder="توضیحات محصول"
                                rows="4"
                            />
                        </div>

                        <div className="flex justify-between items-center font-modam">
                            <div>
                                <p>آیا میخواهید تخفیفی برای این محصول قائل شوید؟</p>
                                <p>درصد مورد نظر خود را در فیلد رو به رو وارد کنید.</p>
                            </div>

                            {/* درصد تخفیف */}
                            <div className="w-[50%]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="discount"
                                        value={productData.discount}
                                        onChange={handleChange}
                                        className="bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-16 mt-2 pr-12"
                                        placeholder="درصد تخفیف"
                                    />
                                    <img src='/SellerPanel/Products/icons8-discount-64 1(1).png' className="absolute right-4 top-6 text-gray-500" alt="discount icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* توضیحات پس از خرید */}
                <div className="mx-16 my-12">
                    <div className="ml-auto mb-4 bg-gradient-to-l from-[#1E212D] via-[#2E3A55] to-[#626C93] font-modam font-medium text-lg w-64 text-white py-4 px-6 rounded-full shadow-md">
                        توضیحات پس از خرید محصول
                    </div>
                    <textarea
                        name="additionalInfo"
                        value={productData.additionalInfo}
                        onChange={handleChange}
                        className="bg-[#fbf7ed] w-full px-6 py-6 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36"
                        placeholder="توضیحات خود را در اینجا وارد کنید."
                        rows="4"
                    />
                </div>

                {/* دکمه ذخیره تغییرات */}
                <div className="flex justify-end mt-6 pl-16">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || isUploadingImages}
                        className="bg-[#eac09f87] text-[#1E212D] border-[0.2px] border-[#1e212d8b] shadow-inner py-2 px-4 rounded-lg flex items-center hover:bg-[#B68973] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#1E212D] border-t-transparent rounded-full animate-spin mr-2"></div>
                                در حال ارسال...
                            </>
                        ) : (
                            <>
                                <FaSave className="mr-2" />
                                ذخیره تغییرات
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* نوتیفیکیشن وضعیت آپلود تصاویر */}
            {uploadStatus === 'uploading' && (
                <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md z-50 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال آپلود تصاویر...</span>
                </div>
            )}

            {uploadStatus === 'success' && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50 flex items-center gap-2">
                    <FaCheck />
                    <span>تصاویر با موفقیت آپلود شدند</span>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md z-50 flex items-center gap-2">
                    <FaTimes />
                    <span>خطا در آپلود تصاویر. دوباره تلاش کنید</span>
                </div>
            )}
        </div>
    );
};

export default AddProduct;