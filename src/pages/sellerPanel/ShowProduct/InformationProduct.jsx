import React, { useState } from "react";
import { FaPencilAlt, FaAsterisk, FaChevronDown } from "react-icons/fa";

const ProductForm = ({ productData, onProductDataChange, isEditable = true, errors = {} }) => {
    const [editingField, setEditingField] = useState(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [selectedPath, setSelectedPath] = useState([]);

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

    // تغییرات ورودی‌ها
    const handleChange = (e) => {
        const { name, value } = e.target;
        onProductDataChange({
            ...productData,
            [name]: value
        });
    };

    // شروع ویرایش فیلد
    const startEdit = (fieldName) => {
        if (isEditable) {
            setEditingField(fieldName);
        }
    };

    // پایان ویرایش فیلد
    const finishEdit = () => {
        setEditingField(null);
    };

    // انتخاب دسته‌بندی
    const handleCategorySelect = (category, level) => {
        const newPath = selectedPath.slice(0, level);
        newPath.push(category);
        setSelectedPath(newPath);

        const categoryString = newPath.join('/');
        onProductDataChange({
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
    const renderCategoryOptions = (categories, level = 0) => {
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

    return (
        <div className="space-y-6 w-2/4">
            {/* نام محصول */}
            <div className="font-modam text-lg">
                <div className="relative">
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        onBlur={finishEdit}
                        readOnly={editingField !== 'name' && !isEditable}
                        className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 ${
                            errors.name ? 'border-red-500' : 'border-gray-800 border-opacity-40'
                        } ${editingField !== 'name' && !isEditable ? 'cursor-default' : ''}`}
                        placeholder="نام محصول"
                    />
                    {isEditable && editingField !== 'name' && (
                        <button
                            onClick={() => startEdit('name')}
                            className="absolute left-12 top-6 text-gray-500 hover:text-blue-500"
                        >
                            <FaPencilAlt />
                        </button>
                    )}
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
                            onBlur={finishEdit}
                            readOnly={editingField !== 'price' && !isEditable}
                            className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 ${
                                errors.price ? 'border-red-500' : 'border-gray-800 border-opacity-40'
                            } ${editingField !== 'price' && !isEditable ? 'cursor-default' : ''}`}
                            placeholder="قیمت محصول"
                        />
                        {isEditable && editingField !== 'price' && (
                            <button
                                onClick={() => startEdit('price')}
                                className="absolute left-12 top-6 text-gray-500 hover:text-blue-500"
                            >
                                <FaPencilAlt />
                            </button>
                        )}
                        <FaAsterisk className="absolute left-4 top-6 text-red-500 text-xs" />
                    </div>
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* دسته بندی محصول */}
                <div className="w-[70%]">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => isEditable && setShowCategoryDropdown(!showCategoryDropdown)}
                            className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 text-right flex items-center justify-between ${
                                errors.category ? 'border-red-500' : 'border-gray-800 border-opacity-40'
                            } ${!isEditable ? 'cursor-default' : ''}`}
                        >
                            <span className={productData.category ? 'text-black' : 'text-gray-500'}>
                                {productData.category || 'دسته بندی محصول'}
                            </span>
                            <div className="flex items-center gap-2">
                                {isEditable && (
                                    <FaPencilAlt className="text-gray-500 text-sm" />
                                )}
                                <FaAsterisk className="text-red-500 text-xs" />
                                <FaChevronDown className={`text-gray-500 text-sm transition-transform ${
                                    showCategoryDropdown ? 'rotate-180' : ''
                                }`} />
                            </div>
                        </button>

                        {showCategoryDropdown && isEditable && (
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
                        onBlur={finishEdit}
                        readOnly={editingField !== 'link' && !isEditable}
                        className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 mt-2 ${
                            errors.link ? 'border-red-500' : 'border-gray-800 border-opacity-40'
                        } ${editingField !== 'link' && !isEditable ? 'cursor-default' : ''}`}
                        placeholder="لینک محصول دیجیتال"
                    />
                    {isEditable && editingField !== 'link' && (
                        <button
                            onClick={() => startEdit('link')}
                            className="absolute left-12 top-6 text-gray-500 hover:text-blue-500"
                        >
                            <FaPencilAlt />
                        </button>
                    )}
                    <FaAsterisk className="absolute left-4 top-6 text-red-500 text-xs" />
                </div>
                {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
            </div>

            {/* توضیحات محصول */}
            <div className="font-modam text-lg">
                <div className="relative">
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        onBlur={finishEdit}
                        readOnly={editingField !== 'description' && !isEditable}
                        className={`bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36 mt-2 ${
                            editingField !== 'description' && !isEditable ? 'cursor-default' : ''
                        }`}
                        placeholder="توضیحات محصول"
                        rows="4"
                    />
                    {isEditable && editingField !== 'description' && (
                        <button
                            onClick={() => startEdit('description')}
                            className="absolute left-4 top-6 text-gray-500 hover:text-blue-500"
                        >
                            <FaPencilAlt />
                        </button>
                    )}
                </div>
            </div>

            {/* اطلاعات اضافی */}
            <div className="font-modam text-lg">
                <div className="relative">
                    <textarea
                        name="additionalInfo"
                        value={productData.additionalInfo}
                        onChange={handleChange}
                        onBlur={finishEdit}
                        readOnly={editingField !== 'additionalInfo' && !isEditable}
                        className={`bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-36 mt-2 ${
                            editingField !== 'additionalInfo' && !isEditable ? 'cursor-default' : ''
                        }`}
                        placeholder="شرح امکان مرجوعی کالا"
                        rows="2"
                    />
                    {isEditable && editingField !== 'additionalInfo' && (
                        <button
                            onClick={() => startEdit('additionalInfo')}
                            className="absolute left-4 top-6 text-gray-500 hover:text-blue-500"
                        >
                            <FaPencilAlt />
                        </button>
                    )}
                </div>
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
                            onBlur={finishEdit}
                            readOnly={editingField !== 'discount' && !isEditable}
                            className={`bg-[#fbf7ed] w-full px-4 py-2 border border-gray-800 border-opacity-40 shadow-sm rounded-3xl h-16 mt-2 pr-12 ${
                                editingField !== 'discount' && !isEditable ? 'cursor-default' : ''
                            }`}
                            placeholder="درصد تخفیف"
                        />
                        {isEditable && editingField !== 'discount' && (
                            <button
                                onClick={() => startEdit('discount')}
                                className="absolute left-16 top-6 text-gray-500 hover:text-blue-500"
                            >
                                <FaPencilAlt />
                            </button>
                        )}
                        <img src='/SellerPanel/Products/icons8-discount-64 1(1).png' className="absolute right-4 top-6 text-gray-500" alt="discount" />
                    </div>
                </div>
            </div>

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

export default ProductForm;