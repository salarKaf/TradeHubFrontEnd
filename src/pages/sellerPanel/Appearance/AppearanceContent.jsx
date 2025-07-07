import { Import } from 'lucide-react';
import StoreHeaderSettings from './StoreHeaderSetting'
import EditableList from './EditableList';
import { ScrollText, HelpCircle } from "lucide-react";
import ShopDescriptionCard from './ShopDescriptionCard';
import ContactInfo from './ShopContactCard';
// داده‌ها
const faqList = [
    { 
        id: 1, 
        title: "عنوان پرسش ۱",
        question: "این یک پرسش نمونه است؟",
        answer: "این یک پاسخ نمونه است."
    },
    { 
        id: 2, 
        title: "عنوان پرسش ۲",
        question: "پرسش دوم چیست؟",
        answer: "پاسخ دوم اینجا قرار دارد."
    },
    { 
        id: 3, 
        title: "عنوان پرسش ۳",
        question: "آخرین پرسش",
        answer: "آخرین پاسخ"
    },
];

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
    // تابع برای ذخیره تغییرات
    const handleSaveRules = (updatedData) => {
        console.log("Rules updated:", updatedData);
        // اینجا میتونی داده ها رو به سرور بفرستی یا به state اصلی بدی
    };

    const handleSaveFAQ = (updatedData) => {
        console.log("FAQ updated:", updatedData);
        // اینجا میتونی داده ها رو به سرور بفرستی یا به state اصلی بدی
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
            <ContactInfo/>
        </div>
    );
}

export default AppearanceContent;