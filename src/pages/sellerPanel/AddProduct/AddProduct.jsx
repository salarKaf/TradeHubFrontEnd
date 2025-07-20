import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaArrowLeft, FaSave, FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaCheck, FaAsterisk, FaChevronDown } from "react-icons/fa";
import { createItem } from '../../../API/Items';
import { getWebsiteCategories, getSubcategoriesByCategoryId } from '../../../API/category';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const AddProduct = () => {




    const { websiteId } = useParams();


    

    // دسته‌بندی‌های موجود
    const categories = {
        "لباس": {
            "مردانه": {
                "پیراهن": {},
                "شلوار": {},
                "کت": {}
            },
            "زنانه": {
                "مانتو": {},
                "شلوار": {},
                "بلوز": {}
            },
            "بچگانه": {
                "دخترانه": {},
                "پسرانه": {}
            }
        },
        "الکترونیک": {
            "موبایل": {
                "اندروید": {},
                "آیفون": {}
            },
            "لپ‌تاپ": {
                "گیمینگ": {},
                "اداری": {}
            },
            "لوازم جانبی": {}
        },
        "کتاب": {
            "آموزشی": {
                "ریاضی": {},
                "علوم": {}
            },
            "داستان": {
                "رمان": {},
                "داستان کوتاه": {}
            }
        },
        "خانه و آشپزخانه": {
            "لوازم آشپزخانه": {},
            "تزئینات": {},
            "مبلمان": {}
        }
    };

    // وضعیت برای فیلدها و تصاویر
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        category: '',
        link: '',
        description: '',
        additionalInfo: '',
        images: [],
        primaryImageIndex: 0,
        discount: ''
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showPrimarySetConfirm, setShowPrimarySetConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [selectedPath, setSelectedPath] = useState([]);






    const [categoryTree, setCategoryTree] = useState({});
    const [categoryIdMap, setCategoryIdMap] = useState({}); // اسم به آیدی

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

    // افزودن تصویر جدید
    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductData({
                    ...productData,
                    images: [...productData.images, reader.result]
                });
            };
            reader.readAsDataURL(file);
        }
        e.target.value = ''; // Reset input
    };

    // تنظیم عکس اصلی
    const setPrimaryImage = () => {
        setProductData({
            ...productData,
            primaryImageIndex: currentImageIndex
        });
        setShowPrimarySetConfirm(true);
        setTimeout(() => {
            setShowPrimarySetConfirm(false);
        }, 2000);
    };

    // حذف تصویر
    const confirmDeleteImage = (index) => {
        setShowDeleteConfirm(index);
    };

    const deleteImage = () => {
        const newImages = productData.images.filter((_, i) => i !== showDeleteConfirm);
        let newPrimaryIndex = productData.primaryImageIndex;

        if (showDeleteConfirm === productData.primaryImageIndex) {
            newPrimaryIndex = 0;
        } else if (showDeleteConfirm < productData.primaryImageIndex) {
            newPrimaryIndex = productData.primaryImageIndex - 1;
        }

        if (showDeleteConfirm === currentImageIndex) {
            setCurrentImageIndex(0);
        } else if (showDeleteConfirm < currentImageIndex) {
            setCurrentImageIndex(currentImageIndex - 1);
        }

        setProductData({
            ...productData,
            images: newImages,
            primaryImageIndex: newPrimaryIndex
        });
        setShowDeleteConfirm(null);
    };

    // تبدیل عکس قبلی/بعدی
    const prevImage = () => {
        setCurrentImageIndex(currentImageIndex === 0 ? productData.images.length - 1 : currentImageIndex - 1);
    };

    const nextImage = () => {
        setCurrentImageIndex(currentImageIndex === productData.images.length - 1 ? 0 : currentImageIndex + 1);
    };

    // انتخاب دسته‌بندی
    const handleCategorySelect = (category, level) => {
        const newPath = selectedPath.slice(0, level);
        newPath.push(category);
        setSelectedPath(newPath);

        const categoryString = newPath.join('/');
        setProductData({
            ...productData,
            category: categoryString
        });

        // بررسی اینکه آیا زیر دسته دارد یا نه
        let currentLevel = categories;
        for (let i = 0; i < newPath.length; i++) {
            currentLevel = currentLevel[newPath[i]];
        }

        // اگر زیر دسته نداشت، دراپ‌داون را ببند
        if (!currentLevel || Object.keys(currentLevel).length === 0) {
            setShowCategoryDropdown(false);
        }
    };
    // رندر کردن گزینه‌های دسته‌بندی
    // جایگزین کن این فانکشن رو:
    const renderCategoryOptions = (categories, level = 0) => {
        // اگر هیچ مسیری انتخاب نشده، همه دسته‌های اصلی رو نشون بده
        if (selectedPath.length === 0) {
            return Object.keys(categories).map(category => (
                <button
                    key={category}
                    onClick={() => handleCategorySelect(category, 0)}
                    className="w-full text-right px-4 py-2 hover:bg-gray-100"
                >
                    {category}
                </button>
            ));
        }

        // اگر مسیری انتخاب شده، فقط زیردسته‌های اون رو نشون بده
        let currentLevel = categories;
        for (let i = 0; i < selectedPath.length; i++) {
            currentLevel = currentLevel[selectedPath[i]];
        }

        if (!currentLevel || Object.keys(currentLevel).length === 0) {
            return null;
        }

        return Object.keys(currentLevel).map(category => (
            <button
                key={category}
                onClick={() => handleCategorySelect(category, selectedPath.length)}
                className="w-full text-right px-4 py-2 hover:bg-gray-100"
            >
                {category}
            </button>
        ));
    };

    // ذخیره تغییرات

    const handleSave = async () => {
        if (!validateFields()) return;

        const categoryId = categoryIdMap[productData.category];

        const payload = {
            website_id: websiteId,
            category_id: categoryId,
            name: productData.name,
            description: productData.description,
            price: Number(productData.price),
            delivery_url: productData.link,
            post_purchase_note: productData.additionalInfo,
            stock: 1, // یا بفرست از فرم
        };

        try {
            const createdItem = await createItem(payload);
            const itemId = createdItem.id; // فرض بر اینه که بک آیدی برمی‌گردونه

            // 📌 حالا اگر تصویر انتخاب شده بود، آپلود کن
            if (productData.images.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < productData.images.length; i++) {
                    const imageBlob = await fetch(productData.images[i]).then(r => r.blob());
                    formData.append("files", imageBlob, `image_${i}.png`);
                    formData.append("is_main_flags", i === productData.primaryImageIndex ? "true" : "false");
                }

                await axios.post(`${mediaBaseURL}/item/upload_item_images/${itemId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            alert("✅ محصول با موفقیت ایجاد شد");
        } catch (error) {
            console.error("❌ خطا در ساخت محصول:", error);
            alert("❌ خطا در ساخت محصول");
        }
    };


    return (
        <div className="p-6 min-h-screen">
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
                        <div className="w-[420px] h-[420px] relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                            {productData.images.length > 0 ? (
                                <>
                                    <img
                                        src={productData.images[currentImageIndex]}
                                        alt={`تصویر ${currentImageIndex + 1}`}
                                        className="object-cover w-full h-full"
                                    />

                                    {/* دکمه‌های ناوبری */}
                                    {productData.images.length > 1 && (
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
                                    <button
                                        onClick={setPrimaryImage}
                                        className={`absolute bottom-2 left-2 px-3 py-1 text-xs rounded-md transition-all ${currentImageIndex === productData.primaryImageIndex
                                            ? 'bg-green-600 text-white'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {currentImageIndex === productData.primaryImageIndex ? (
                                            <span className="flex items-center gap-1">
                                                <FaCheck className="text-xs" />
                                                عکس اصلی
                                            </span>
                                        ) : (
                                            'تنظیم اصلی'
                                        )}
                                    </button>

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
                            {productData.images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image}
                                        alt={`تصویر کوچک ${index + 1}`}
                                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all ${index === currentImageIndex
                                            ? 'border-blue-500 opacity-100'
                                            : 'border-gray-300 opacity-70 hover:opacity-100'
                                            } ${index === productData.primaryImageIndex ? 'ring-2 ring-green-400' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                    {/* دکمه حذف */}
                                    <button
                                        onClick={() => confirmDeleteImage(index)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ fontSize: '10px' }}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            ))}

                            {/* دکمه افزودن تصویر */}
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
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                        className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 text-right flex items-center justify-between ${errors.category ? 'border-red-500' : 'border-gray-800 border-opacity-40'}`}
                                    >
                                        <span className={productData.category ? 'text-black' : 'text-gray-500'}>
                                            {productData.category || 'دسته بندی محصول'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <FaAsterisk className="text-red-500 text-xs" />
                                            <FaChevronDown className={`text-gray-500 text-sm transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>

                                    {showCategoryDropdown && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                                            {renderCategoryOptions(categories)}
                                        </div>
                                    )}
                                </div>
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>
                        </div>

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

                        {/* اطلاعات اضافی */}
                        <div className="font-modam text-lg">
                            <textarea
                                name="additionalInfo"
                                value={productData.additionalInfo}
                                onChange={handleChange}
                                className="bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36 mt-2"
                                placeholder="شرح امکان مرجوعی کالا"
                                rows="2"
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
                                    <img src='/SellerPanel/Products/icons8-discount-64 1(1).png' className="absolute right-4 top-6 text-gray-500"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* توضیحات پس از خرید */}

                {/* توضیحات محصول */}
                <div className="mx-16 my-0">

                    <div
                        className="ml-auto mb-0  bg-gradient-to-l from-[#1E212D] via-[#2E3A55] to-[#626C93] font-modam font-medium text-lط w-64 h-4/5  text-white py-4 px-6 rounded-full shadow-md"
                    >
                        توضیحات پس از خرید محصول
                    </div>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className="bg-[#fbf7ed] w-full px-6 py-6  border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36"
                        placeholder="توضیحات خود را در اینجا وارد کنید."
                        rows="4"
                    />
                </div>

                {/* دکمه ذخیره تغییرات */}
                <div className="flex justify-end mt-6 pl-16">
                    <button
                        onClick={handleSave}
                        className="bg-[#eac09f87] text-[#1E212D] border-[0.2px] border-[#1e212d8b] shadow-inner py-2 px-4 rounded-lg flex items-center hover:bg-[#B68973] transition-colors"
                    >
                        <FaSave className="mr-2" />
                        ذخیره تغییرات
                    </button>
                </div>
            </div>

            {/* مودال تمام صفحه */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative max-w-4xl max-h-4xl">
                        <img
                            src={productData.images[currentImageIndex]}
                            alt={`تصویر بزرگ ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30"
                        >
                            <FaTimes />
                        </button>

                        {productData.images.length > 1 && (
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

            {/* کلیک بیرون دراپ‌داون برای بستن */}
            {showCategoryDropdown && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowCategoryDropdown(false)}
                />
            )}
        </div>
    );
};

export default AddProduct;



