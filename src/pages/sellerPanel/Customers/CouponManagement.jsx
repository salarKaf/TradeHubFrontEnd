import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createCoupon, getCouponsByWebsite, deleteCoupon } from '../../../API/coupons';
import { getActivePlan } from '../../../API/website';
import { FiPlus, FiTrash2, FiTag, FiCalendar, FiPercent } from 'react-icons/fi';
import JalaliDatePicker from '../ShowProducts/JalaliDatePicker';

import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

function convertJalaliToGregorian({ year, month, day }) {
    const selectedDate = dayjs()
        .calendar('jalali')
        .year(year)
        .month(month - 1)
        .date(day)
        .hour(23)
        .minute(59)
        .second(59);

    const today = dayjs().calendar('jalali');

    if (selectedDate.isBefore(today, 'day')) {
        return null;
    }

    return selectedDate.toISOString();
}

const CouponManagement = () => {
    const { websiteId } = useParams();
    const [coupons, setCoupons] = useState([]);
    const [planType, setPlanType] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount_amount: '',
        expiration_date: '',
        usage_limit: 0
    });

    // بررسی پلن و دریافت کوپن‌ها
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [plan, couponsData] = await Promise.all([
                    getActivePlan(websiteId),
                    getCouponsByWebsite(websiteId)
                ]);

                setPlanType(plan?.plan?.name || null);
                setCoupons(couponsData || []);
            } catch (error) {
                console.error('❌ خطا در دریافت اطلاعات:', error);
            }
        };

        if (websiteId) fetchData();
    }, [websiteId]);

    // اگر پلن Pro نباشه، نمایش نده
    if (planType !== "Pro") {
        return null;
    }

    // فرمت کردن عدد با سه رقمی جدا کردن
    const formatNumber = (value) => {
        if (!value) return '';
        // حذف همه کاراکترهای غیرعددی
        const cleanValue = value.toString().replace(/[^\d]/g, '');
        if (cleanValue === '') return '';
        // فرمت کردن با کاما برای نمایش فارسی
        return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // حذف فرمت و دریافت عدد خام
    const parseNumber = (value) => {
        if (!value) return '';
        return value.toString().replace(/[^\d]/g, '');
    };

    // ساخت کوپن جدید
    const handleCreateCoupon = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.code.trim()) {
            alert('لطفا کد کوپن را وارد کنید');
            return;
        }

        if (!formData.discount_amount.trim()) {
            alert('لطفا مبلغ تخفیف را وارد کنید');
            return;
        }

        if (!formData.expiration_date) {
            alert('لطفا تاریخ انقضا را انتخاب کنید');
            return;
        }

        setLoading(true);

        try {
            const expirationDate = convertJalaliToGregorian(formData.expiration_date);

            if (!expirationDate) {
                alert('تاریخ انقضا نمی‌تواند قبل از امروز باشد');
                setLoading(false);
                return;
            }

            const couponData = {
                ...formData,
                website_id: websiteId,
                usage_limit: parseInt(formData.usage_limit) || 0,
                discount_amount: parseNumber(formData.discount_amount),
                expiration_date: expirationDate,
            };

            const newCoupon = await createCoupon(couponData);
            setCoupons([...coupons, newCoupon]);
            setShowCreateForm(false);
            setFormData({ code: '', discount_amount: '', expiration_date: '', usage_limit: 0 });

            console.log('✅ کوپن با موفقیت ساخته شد');
        } catch (error) {
            console.error('❌ خطا در ساخت کوپن:', error);
            alert('خطا در ساخت کوپن. لطفا دوباره تلاش کنید.');
        } finally {
            setLoading(false);
        }
    };

    // حذف کوپن
    const handleDeleteCoupon = async (couponId) => {
        if (!confirm('آیا از حذف این کوپن مطمئن هستید؟')) return;

        try {
            await deleteCoupon(couponId);
            setCoupons(coupons.filter(c => c.coupon_id !== couponId));
            console.log('✅ کوپن با موفقیت حذف شد');
        } catch (error) {
            console.error('❌ خطا در حذف کوپن:', error);
            alert('خطا در حذف کوپن. لطفا دوباره تلاش کنید.');
        }
    };

    // دریافت تاریخ امروز برای محدود کردن date picker
    const getTodayJalali = () => {
        const today = dayjs().calendar('jalali');
        return {
            year: today.year(),
            month: today.month() + 1,
            day: today.date()
        };
    };

    return (
        <div className="p-3 md:p-4 mb-6">
            <div className="font-modam rounded-xl border-2 border-black border-opacity-20">
                {/* هدر */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 md:p-6 border-b border-gray-200 gap-3 md:gap-0">
                    <div className="flex items-center gap-2 md:gap-3">
                        <FiTag className="text-xl md:text-2xl text-blue-600" />
                        <h2 className="text-lg md:text-2xl font-semibold text-zinc-600">مدیریت کوپن‌های تخفیف</h2>
                        <span className="bg-blue-100 text-blue-800 text-sm md:text-base px-2 py-1 rounded-full">Pro</span>
                    </div>

                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base w-full md:w-auto"
                    >
                        <FiPlus className="text-sm md:text-base" />
                        کوپن جدید
                    </button>
                </div>

                {/* فرم ساخت کوپن */}
                {showCreateForm && (
                    <div className="p-4 md:p-6 bg-gray-50 border-b border-gray-200">
                        <form onSubmit={handleCreateCoupon} className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
                            <div>
                                <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                                    کد کوپن <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="مثال: SUMMER2025"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                                    مبلغ تخفیف <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="مثلاً: 100,000"
                                        value={formData.discount_amount}
                                        onChange={(e) => {
                                            const formattedValue = formatNumber(e.target.value);
                                            setFormData({ ...formData, discount_amount: formattedValue });
                                        }}
                                        className="w-full p-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                                        required
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm md:text-base text-gray-500">
                                        ریال
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                                    تاریخ انقضا <span className="text-red-500">*</span>
                                </label>
                                <JalaliDatePicker
                                    value={formData.expiration_date}
                                    onChange={(value) => {
                                        setFormData({ ...formData, expiration_date: value })
                                    }}
                                    placeholder="انتخاب تاریخ انقضا"
                                    minDate={getTodayJalali()}
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">حد استفاده</label>
                                <input
                                    type="number"
                                    placeholder="0 = نامحدود"
                                    value={formData.usage_limit}
                                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                                    min="0"
                                />
                            </div>

                            <div className="md:col-span-4 flex flex-col md:flex-row gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm md:text-base order-2 md:order-1"
                                >
                                    {loading ? 'در حال ساخت...' : 'ساخت کوپن'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="bg-gray-500 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base order-1 md:order-2"
                                >
                                    لغو
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* لیست کوپن‌ها */}
                <div className="p-4 md:p-6">
                    {coupons.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-right py-3 px-2 text-sm md:text-base font-semibold">کد کوپن</th>
                                        <th className="text-right py-3 px-2 text-sm md:text-base font-semibold">مبلغ تخفیف</th>
                                        <th className="text-right py-3 px-2 text-sm md:text-base font-semibold">تاریخ انقضا</th>
                                        <th className="text-right py-3 px-2 text-sm md:text-base font-semibold">سقف استفاده</th>
                                        <th className="text-right py-3 px-2 text-sm md:text-base font-semibold">استفاده شده</th>
                                        <th className="text-right py-3 px-2 text-sm md:text-base font-semibold">وضعیت</th>
                                        <th className="text-right py-3 px-2 text-sm md:text-base font-semibold">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map((coupon) => {
                                        const isExpired = new Date(coupon.expiration_date) < new Date();
                                        const isLimitReached = coupon.usage_limit > 0 && coupon.times_used >= coupon.usage_limit;

                                        return (
                                            <tr key={coupon.coupon_id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-2 font-mono font-semibold text-blue-600 text-sm md:text-md">{coupon.code}</td>
                                                <td className="py-3 px-2">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm md:text-base">{Number(coupon.discount_amount).toLocaleString('fa-IR')}</span>
                                                        <span className="text-sm text-gray-700">ریال</span>
                                                    </div>
                                                </td>

                                                <td className="py-3 px-2">
                                                    <div className="flex items-center gap-1">
                                                        <FiCalendar className="text-sm md:text-md" />
                                                        <span className="text-sm md:text-base">{new Date(coupon.expiration_date).toLocaleDateString('fa-IR')}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-sm md:text-base">
                                                    {coupon.usage_limit === 0 ? 'نامحدود' : coupon.usage_limit.toLocaleString('fa-IR')}
                                                </td>
                                                <td className="py-3 px-2 text-sm md:text-base">{coupon.times_used.toLocaleString('fa-IR')}</td>
                                                <td className="py-3 px-2">
                                                    <span className={`px-2 py-1 rounded-full text-sm ${isExpired || isLimitReached
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {isExpired ? 'منقضی شده' : isLimitReached ? 'تمام شده' : 'فعال'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <button
                                                        onClick={() => handleDeleteCoupon(coupon.coupon_id)}
                                                        className="text-red-600 hover:bg-red-100 p-1 rounded transition-colors"
                                                        title="حذف کوپن"
                                                    >
                                                        <FiTrash2 className="text-sm md:text-base" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 md:py-12 text-gray-500">
                            <FiTag className="text-3xl md:text-4xl mx-auto mb-4 opacity-50" />
                            <p className="text-sm md:text-base">هنوز کوپن تخفیفی ساخته نشده است</p>
                            <p className="text-sm md:text-base mt-1">برای شروع، روی دکمه "کوپن جدید" کلیک کنید</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponManagement;