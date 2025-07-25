import { Import } from 'lucide-react';
import StoreHeaderSettings from './StoreHeaderSetting'
import EditableList from './EditableList';
import { ScrollText, HelpCircle } from "lucide-react";
import ShopDescriptionCard from './ShopDescriptionCard';
import ContactInfo from './ShopContactCard';
import { getWebsiteById, updateWebsiteFaqs } from '../../../API/website.js';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// فقط داده‌های قوانین رو اینجا نگه میداریم
const rulesList = [
    {
        id: 1,
        title: "عنوان بند ۱",
        description: "توضیحات بند اول قوانین و مقررات"
    },
    {
        id: 2,
        title: "عنوان بند ۲",
        description: "توضیحات بند دوم قوانین و مقررات"
    },
    {
        id: 3,
        title: "عنوان بند ۳",
        description: "توضیحات بند سوم قوانین و مقررات"
    },
];

const AppearanceContent = () => {
    const [toastMsg, setToastMsg] = useState(null);
    const { websiteId } = useParams();
    const [faqList, setFaqList] = useState([]); // فقط این state رو نگه میداریم

    useEffect(() => {
        const fetchData = async () => {
            try {
                const website = await getWebsiteById(websiteId);
                console.log("🎯 وبسایت از سرور:", website);

                if (website.faqs && website.faqs.length > 0) {
                    // تولید عنوان برای هر پرسش
                    const faqsWithTitles = website.faqs.map((item, index) => ({
                        ...item,
                        id: item.id || Date.now() + index, // اگر id نداره یکی بهش بده
                        title: `پرسش ${index + 1}`,
                    }));
                    setFaqList(faqsWithTitles);
                } else {
                    // اگر FAQ خالی بود، یک آیتم پیش‌فرض بذار
                    setFaqList([]);
                }
            } catch (err) {
                console.error("خطا در گرفتن داده FAQ:", err);
                setFaqList([]); // در صورت خطا لیست خالی بذار
            }
        };

        if (websiteId) fetchData();
    }, [websiteId]);

    const handleSaveRules = (updatedData) => {
        console.log("Rules updated:", updatedData);
        // اینجا میتونی داده ها رو به سرور بفرستی یا به state اصلی بدی
    };

    const handleSaveFAQ = async (updatedData) => {
        console.log("🟢 handleSaveFAQ اجرا شد با:", updatedData);

        try {
            // فرمت داده برای ارسال به سرور (بدون title و id)
            const dataForServer = updatedData.map(item => ({
                question: item.question,
                answer: item.answer
            }));

            await updateWebsiteFaqs(websiteId, dataForServer);
            setFaqList(updatedData); // بروز کن بعد از ذخیره موفق
            console.log("✅ FAQ ذخیره شد");

        } catch (err) {
            console.error("خطا در ذخیره FAQ:", err);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="font-modam mt-5 text-lg">
                در این داشبورد میتوانید تغییراتی را در ظاهر صفحه ای که به مشتریان خود نشان میدهید اعمال کنید.
            </h1>

            <StoreHeaderSettings />

            {/* جدول قوانین */}
            <EditableList
                title="قوانین و مقررات"
                icon={<img src="/public/SellerPanel/Settings/Group 258.png" alt="قوانین" className="w-7 h-7" />}
                items={rulesList}
                viewText="مشاهده‌ی توضیحات"
                onSave={handleSaveRules}
                editIcon={<img src="/public/SellerPanel/Settings/icons8-edit-48.png" alt="ویرایش" className="w-35 h-35" />}
                deleteIcon={<img src="/public/SellerPanel/Settings/icons8-delete-64 1.png" alt="حذف" className="w-35 h-35" />}
            />

            {/* جدول پرسش‌ها */}
            <EditableList
                title="پرسش‌های متداول"
                icon={<img src="/public/SellerPanel/Settings/icons8-questions-60.png" alt="پرسش" className="w-8 h-8" />}
                items={faqList}
                viewText="مشاهده‌ی پرسش و پاسخ"
                onSave={handleSaveFAQ}
                editIcon={<img src="/public/SellerPanel/Settings/icons8-edit-48.png" alt="ویرایش" className="w-35 h-35" />}
                deleteIcon={<img src="/public/SellerPanel/Settings/icons8-delete-64 1.png" alt="حذف" className="w-35 h-35" />}
            />

            <ShopDescriptionCard></ShopDescriptionCard>
            <ContactInfo />
        </div>
    );
}

export default AppearanceContent;