import React, { useState, useEffect } from "react";
import { FaChevronDown, FaAsterisk, FaTimes, FaAngleLeft } from "react-icons/fa";
import { getWebsiteCategories, getSubcategoriesByCategoryId } from '../../../API/category';

const CategoryDropdown = ({
    value,
    onChange,
    error,
    placeholder = 'دسته بندی محصول',
    websiteId
}) => {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [selectedPath, setSelectedPath] = useState(value ? value.split('/') : []);
    const [categoryTree, setCategoryTree] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const mainCategories = await getWebsiteCategories(websiteId);
                const activeMainCategories = mainCategories.filter(cat => cat.is_active);
                const tree = {};

                for (let category of activeMainCategories) {
                    const subcategories = (await getSubcategoriesByCategoryId(category.id)).filter(sub => sub.is_active);
                    tree[category.name] = {};

                    for (let sub of subcategories) {
                        tree[category.name][sub.name] = {};
                    }
                }

                setCategoryTree(tree);
            } catch (error) {
                console.error("❌ خطا در دریافت دسته‌بندی‌ها:", error);
            }
        };


        if (websiteId) {
            fetchCategories();
        }
    }, [websiteId]);

    const handleCategorySelect = (category, level) => {
        const newPath = selectedPath.slice(0, level);
        newPath.push(category);
        setSelectedPath(newPath);

        const categoryString = newPath.join('/');
        onChange(categoryString);

        let currentLevel = categoryTree;
        for (let i = 0; i < newPath.length; i++) {
            currentLevel = currentLevel[newPath[i]];
        }

        if (!currentLevel || Object.keys(currentLevel).length === 0) {
            setShowCategoryDropdown(false);
        }
    };

    const goBackToLevel = (level) => {
        const newPath = selectedPath.slice(0, level);
        setSelectedPath(newPath);

        const categoryString = level === 0 ? '' : newPath.join('/');
        onChange(categoryString);
    };

    const resetSelection = () => {
        setSelectedPath([]);
        onChange('');
    };

    const renderCategoryOptions = () => {
        let currentLevel = categoryTree;

        for (let i = 0; i < selectedPath.length; i++) {
            currentLevel = currentLevel[selectedPath[i]];
        }

        if (!currentLevel || Object.keys(currentLevel).length === 0) {
            return (
                <div className="px-4 py-2 text-gray-500 text-center">
                    دسته‌بندی انتخاب شده
                </div>
            );
        }

        return Object.keys(currentLevel).map(category => (
            <button
                key={category}
                onClick={() => handleCategorySelect(category, selectedPath.length)}
                className="w-full text-right px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
            >
                {category}
            </button>
        ));
    };

    const renderBreadcrumb = () => {
        if (selectedPath.length === 0) return null;

        return (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-sm">
                <span className="text-gray-600">مسیر انتخاب شده:</span>

                <button
                    onClick={() => goBackToLevel(0)}
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    همه دسته‌ها
                </button>

                {selectedPath.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <FaAngleLeft className="text-gray-400 text-xs" />
                        <button
                            onClick={() => goBackToLevel(index + 1)}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {item}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className={`bg-[#fbf7ed] w-full px-4 py-2 border shadow-sm rounded-3xl h-16 text-right flex items-center justify-between ${error ? 'border-red-500' : 'border-gray-800 border-opacity-40'}`}
                >
                    <span className={value ? 'text-black' : 'text-gray-500'}>
                        {value || placeholder}
                    </span>
                    <div className="flex items-center gap-2">
                        {value && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetSelection();
                                }}
                                className="text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <FaTimes className="text-xs" />
                            </span>
                        )}
                        <FaAsterisk className="text-red-500 text-xs" />
                        <FaChevronDown className={`text-gray-500 text-sm transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-hidden">
                        {renderBreadcrumb()}

                        <div className="max-h-60 overflow-y-auto">
                            {renderCategoryOptions()}
                        </div>

                        {selectedPath.length > 0 && (
                            <div className="border-t border-gray-200 p-2">
                                <button
                                    onClick={resetSelection}
                                    className="w-full text-center py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    انتخاب مجدد دسته‌بندی
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showCategoryDropdown && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowCategoryDropdown(false)}
                />
            )}
        </div>
    );
};

export default CategoryDropdown;