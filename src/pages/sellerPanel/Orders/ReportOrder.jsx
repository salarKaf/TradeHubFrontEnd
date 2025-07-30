import React, { useState, useEffect } from 'react';
import SalesCard from './SalesCard';
import OrdersHeader from './OrdersHeader';
import { getActivePlan } from '../../../API/website';
import {
    getSalesSummary,
    getTotalSalesCount
} from '../../../API/orders';


import { getTotalRevenue } from '../../../API/dashboard';
import { useParams } from 'react-router-dom';

const ReportOrder = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [planType, setPlanType] = useState(null);
    const [stats, setStats] = useState({
        total: null,
        daily: null,
        monthly: null,
        yearly: null,
    });

    const { websiteId } = useParams();

    useEffect(() => {

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const plan = await getActivePlan(websiteId);
                setPlanType(plan?.plan?.name || null);

                // گرفتن آمار فروش کل
                const [countRes, revenueRes] = await Promise.all([
                    getTotalSalesCount(websiteId, token),
                    getTotalRevenue(websiteId),
                ]);

                const result = {
                    total: {
                        total_sales_count: countRes.total_sales_count,
                        total_sales_amount: revenueRes.total_revenue, // ← اصلاح شده
                    },
                    daily: null,
                    monthly: null,
                    yearly: null,
                };

                if (plan?.plan?.name === 'Pro') {
                    const [daily, monthly, yearly] = await Promise.all([
                        getSalesSummary(websiteId, token, 'daily'),
                        getSalesSummary(websiteId, token, 'monthly'),
                        getSalesSummary(websiteId, token, 'yearly'),
                    ]);
                    result.daily = daily;
                    result.monthly = monthly;
                    result.yearly = yearly;
                }

                setStats(result);
            } catch (err) {
                console.error('Error fetching sales stats:', err);
            }
        };


        if (websiteId) fetchStats();
    }, [websiteId]);

    return (
        <div className="py-10">
            <div className="mb-5">
                <OrdersHeader
                    isOpenTable={isOpen}
                    setIsOpenTable={setIsOpen}
                    title="گزارش فروش"
                    logo="/SellerPanel/Orders/icons8-report-50(1) 1.png"
                />

                {isOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-fit">
                        {/* نمایش فروش کل فقط در صورتی که دیتا موجود باشه */}
                        {stats.total && (
                            <SalesCard
                                title="فروش کل"
                                amount={stats.total.total_sales_amount?.toLocaleString('fa-IR') || 'نامشخص'}
                                count={stats.total.total_sales_count?.toLocaleString('fa-IR') || '0'}
                                logo='/public/SellerPanel/Orders/icons8-shopping-cart-48(1).png'
                            />
                        )}

                        {/* کارت‌های دیگر فقط برای پلن Pro و زمانی که دیتا وجود دارد */}
                        {planType === 'Pro' && stats.daily && (
                            <SalesCard
                                title="فروش روزانه"
                                amount={stats.daily?.revenue?.toLocaleString('fa-IR')}
                                count={stats.daily?.count?.toLocaleString('fa-IR')}
                                logo="/SellerPanel/Orders/icons8-last-24-hours-64 1.png"
                            />
                        )}
                        {planType === 'Pro' && stats.monthly && (
                            <SalesCard
                                title="فروش ماهانه"
                                amount={stats.monthly?.revenue?.toLocaleString('fa-IR')}
                                count={stats.monthly?.count?.toLocaleString('fa-IR')}
                                logo="/SellerPanel/Orders/icons8-month-50(1).png"
                            />
                        )}
                        {planType === 'Pro' && stats.yearly && (
                            <SalesCard
                                title="فروش سالانه"
                                amount={stats.yearly?.revenue?.toLocaleString('fa-IR')}
                                count={stats.yearly?.count?.toLocaleString('fa-IR')}
                                logo="/SellerPanel/Orders/icons8-plus-1-year-50(1).png"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportOrder;
