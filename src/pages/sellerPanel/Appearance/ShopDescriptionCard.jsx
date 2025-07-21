import React, { useState } from 'react';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';  // از این آیکن استفاده می‌کنیم
import { Save, CheckCircle } from 'lucide-react';
import { getWebsiteById, updateWebsitePartial } from '../../../API/website'; // فرض میکنم path درسته
import { useEffect } from 'react';
import { useParams } from "react-router-dom";

const ShopDescriptionCard = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const { websiteId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const website = await getWebsiteById(websiteId);
                if (website && website.guide_page) {
                    setDescription(website.guide_page);
                }
            } catch (err) {
                console.error("خطا در گرفتن اطلاعات فروشگاه", err);
            }
        };

        fetchData();
    }, []);




    const handleSave = async () => {
        if (description.trim() === '') {
            setShowSuccessMessage(false);
            // نمایش مدال خطا
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                    <div class="flex items-center justify-center mb-4">
                        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800 text-center mb-2">توجه!</h3>
                    <p class="text-gray-600 text-center mb-4">لطفاً توضیحاتی در مورد فروشگاه خود وارد کنید</p>
                    <button onclick="this.parentElement.parentElement.remove()" class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        متوجه شدم
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
            modal.onclick = (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            };

            return;
        }

        try {
            const website = await getWebsiteById(websiteId);
            await updateWebsitePartial(website.id, {
                website_id: website.id,
                guide_page: description,
            });

            setIsEditing(false);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 2000);
        } catch (err) {
            console.error("خطا در ذخیره توضیحات:", err);
        }
    };



    return (
        <div className="w-full text-right p-4 rounded-xl font-modam">
            {/* Header */}
            <div
                className="flex items-center justify-between border-b pb-4 cursor-pointer py-1 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3 font-bold text-[#1E212D]  text-2xl">
                    {/* Image */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-0">
                        <img
                            src="/public/SellerPanel/Settings/icons8-about-me-50 1.png"
                            alt="Logo"
                            className="w-25 h-25 object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    </div>
                    <span className='opacity-90'>درباره فروشگاه خود اضافه کنید</span>
                    {/* Toggle Arrow - Inline with the text */}
                    <div>
                        {isOpen ? (
                            <FaChevronDown className="w-5 h-5 text-[#1E212D]" />
                        ) : (
                            <FaChevronLeft className="w-5 h-5 text-[#1E212D]" />
                        )}
                    </div>
                </div>
            </div>

            {/* Success Message Modal */}
            {showSuccessMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">عالی!</h3>
                        <p className="text-gray-600 text-center mb-4">اطلاعات فروشگاه شما با موفقیت ذخیره شد</p>
                        <button
                            onClick={() => setShowSuccessMessage(false)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            متوجه شدم
                        </button>
                    </div>
                </div>
            )}

            {/* Description Section */}
            {isOpen && (
                <div className="mt-6 flex flex-col gap-4 rounded-xl p-5  relative">
                    {/* Edit/Save Button */}
                    <div className="absolute -top-3 left-4 z-10">
                        {!isEditing ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                }}
                                className="w-10 h-10 bg-slate-600 hover:bg-slate-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110"
                                title="ویرایش توضیحات"
                            >
                                <FiEdit className="w-5 h-5" /> {/* از FiEdit استفاده شد */}
                            </button>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSave();
                                }}
                                className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-110"
                                title="ذخیره تغییرات"
                            >
                                <Save className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="توضیحاتی در مورد فروشگاه خود، خدمات، تخصص‌ها و ویژگی‌های منحصر به فردتان بنویسید..."
                            className={`w-full h-36 p-4 border rounded-lg resize-none transition-all duration-200 ${!isEditing
                                ? 'bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-white border-gray-300 text-gray-800'
                                }`}
                            disabled={!isEditing}
                        />
                        {!isEditing && description && (
                            <div className="absolute inset-0 bg-transparent rounded-lg cursor-not-allowed"></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopDescriptionCard;
