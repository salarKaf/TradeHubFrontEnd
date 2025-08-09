import { Import } from 'lucide-react';
import StoreHeaderSettings from './StoreHeaderSetting';
import EditableList from './EditableList';
import { ScrollText, HelpCircle } from "lucide-react";
import ShopDescriptionCard from './ShopDescriptionCard';
import ContactInfo from './ShopContactCard';
import { getWebsiteById, updateWebsiteFaqs, updateWebsitePartial } from '../../../API/website.js';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AppearanceContent = () => {
    const [toastMsg, setToastMsg] = useState(null);
    const { websiteId } = useParams();
    const [faqList, setFaqList] = useState([]);
    const [rulesList, setRulesList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const website = await getWebsiteById(websiteId);
                console.log("🎯 وبسایت از سرور:", website);

                // دریافت سوالات و پاسخ‌ها
                if (website.faqs && website.faqs.length > 0) {
                    const faqsWithTitles = website.faqs.map((item, index) => ({
                        ...item,
                        id: item.id || Date.now() + index,
                        title: `پرسش ${index + 1}`,
                    }));
                    setFaqList(faqsWithTitles);
                } else {
                    setFaqList([]);
                }

                // دریافت قوانین - اینجا مشکل بود!
                if (website.store_policy && website.store_policy.length > 0) {
                    console.log("🔍 قوانین خام از سرور:", website.store_policy);
                    
                    const rulesWithCorrectFormat = website.store_policy.map((item, index) => ({
                        id: item.id || Date.now() + index,
                        title: item.section || "", // section به title تبدیل می‌شود
                        description: item.subsection || "", // subsection به description تبدیل می‌شود
                        // فیلدهای اصلی هم نگه داشته می‌شوند
                        section: item.section,
                        subsection: item.subsection
                    }));
                    
                    console.log("✅ قوانین با فرمت صحیح:", rulesWithCorrectFormat);
                    setRulesList(rulesWithCorrectFormat);
                } else {
                    console.log("⚠️ هیچ قانونی یافت نشد");
                    setRulesList([]);
                }

            } catch (err) {
                console.error("خطا در گرفتن داده:", err);
                setFaqList([]);
                setRulesList([]);
            }
        };

        if (websiteId) fetchData();
    }, [websiteId]);

    const handleSaveRules = async (updatedData) => {
        console.log("🔄 Rules updated:", updatedData);

        try {
            // تبدیل داده‌ها به فرمت سرور
            const dataForServer = updatedData.map(item => ({
                section: item.title, // title به section تبدیل می‌شود
                subsection: item.description // description به subsection تبدیل می‌شود
            }));

            console.log("📤 داده‌های ارسالی به سرور:", dataForServer);

            await updateWebsitePartial(websiteId, { store_policy: dataForServer });
            setRulesList(updatedData);
            console.log("✅ قوانین ذخیره شد");

            // Toast موفقیت
            setToastMsg({ type: 'success', text: 'قوانین با موفقیت ذخیره شد' });
            setTimeout(() => setToastMsg(null), 3000);

        } catch (err) {
            console.error('❌ خطا در ذخیره قوانین:', err);
            
            // Toast خطا
            setToastMsg({ type: 'error', text: 'خطا در ذخیره قوانین' });
            setTimeout(() => setToastMsg(null), 3000);
        }
    };

    const handleSaveFAQ = async (updatedData) => {
        console.log("🟢 handleSaveFAQ اجرا شد با:", updatedData);

        try {
            const dataForServer = updatedData.map(item => ({
                question: item.question,
                answer: item.answer
            }));

            await updateWebsiteFaqs(websiteId, dataForServer);
            setFaqList(updatedData);
            console.log("✅ FAQ ذخیره شد");

            // Toast موفقیت
            setToastMsg({ type: 'success', text: 'پرسش و پاسخ‌ها با موفقیت ذخیره شدند' });
            setTimeout(() => setToastMsg(null), 3000);

        } catch (err) {
            console.error("❌ خطا در ذخیره FAQ:", err);
            
            // Toast خطا
            setToastMsg({ type: 'error', text: 'خطا در ذخیره پرسش و پاسخ‌ها' });
            setTimeout(() => setToastMsg(null), 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast Message */}
            {toastMsg && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 font-modam ${
                    toastMsg.type === 'success' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                }`}>
                    {toastMsg.text}
                </div>
            )}

            <h1 className="font-modam mt-5 text-md md:text-lg">
                در این داشبورد میتوانید تغییراتی را در ظاهر صفحه ای که به مشتریان خود نشان میدهید اعمال کنید.
            </h1>

            <StoreHeaderSettings />

            {/* جدول قوانین */}
            <EditableList
                title="قوانین و مقررات"
                icon={<HelpCircle className="w-7 h-7" />}
                items={rulesList}
                viewText="مشاهده‌ی توضیحات"
                onSave={handleSaveRules}
                editIcon={<img src="/SellerPanel/Settings/icons8-edit-48.png" alt="ویرایش" className="w-35 h-35" />}
                deleteIcon={<img src="/SellerPanel/Settings/icons8-delete-64 1.png" alt="حذف" className="w-35 h-35" />}
            />

            {/* جدول پرسش‌ها */}
            <EditableList
                title="پرسش‌های متداول"
                icon={<img src="/SellerPanel/Settings/icons8-questions-60.png" alt="پرسش" className="w-8 h-8" />}
                items={faqList}
                viewText="مشاهده‌ی پرسش و پاسخ"
                onSave={handleSaveFAQ}
                editIcon={<img src="/SellerPanel/Settings/icons8-edit-48.png" alt="ویرایش" className="w-35 h-35" />}
                deleteIcon={<img src="/SellerPanel/Settings/icons8-delete-64 1.png" alt="حذف" className="w-35 h-35" />}
            />

            <ShopDescriptionCard></ShopDescriptionCard>
            <ContactInfo />
        </div>
    );
}

export default AppearanceContent;