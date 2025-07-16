
// hooks/usePlans.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const usePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                'http://tradehub.localhost/api/v1/plan/get-all-plans/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const formattedPlans = response.data.map(plan => ({
                id: plan.id,
                apiId: plan.id,
                name: plan.name,
                price: plan.price,
                dailyPrice: Math.floor(plan.price / 30),
                features: plan.name === 'Basic' ? [
                    'آنالیز های محدود',
                    'امکان اضافه کردن محصول',
                    'دسته بندی محصولات',
                    'مشاهده فاکتور',
                    'مشاهده سفارشات مشتری ها',
                    'تنظیم فیچر های ظاهری سایت',
                    'تنظیم لوگو و سر صفحه'
                ] : [
                    'آمارگیری کامل و پیشرفته',
                    'پرسش و پاسخ برای هر محصول',
                    'آپشن کد تخفیف برای مشتری',
                    'تخفیف گذاشتن روی محصولات',
                    'جزئیات خرید هر مشتری',
                    'آنالیز رفتاری هر مشتری',
                    'نوتیفیکشن های هوشمند',
                    'تمام امکانات پلن Basic',
                    'پشتیبانی اولویت دار 24/7'
                ],
                popular: plan.name === 'Pro',
                color: plan.name === 'Pro' ? 'gradient' : 'blue',
                subtitle: plan.name === 'Basic' ? 'مناسب برای شروع کسب و کار' : 'بهترین انتخاب برای رشد کسب و کار',
                badge: plan.name === 'Pro' ? '⭐ محبوب ترین' : 'پلن پایه'
            }));

            setPlans(formattedPlans);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching plans:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    return { plans, loading, fetchPlans };
};

export default usePlans;
