import React, { useState, useEffect } from 'react';
import SalesCard from './SalesCard';
import OrdersHeader from './CustomersHeader';
import { getActiveBuyers, getAverageOrder, getTotalBuyers } from '../../../API/customers';
import { getActivePlan } from '../../../API/website';
import { useParams } from 'react-router-dom';

const ReportOrder = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [planType, setPlanType] = useState(null);
    const [stats, setStats] = useState({
        total: null,
        average: null,
        active: null,
    });

    const { websiteId } = useParams();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const plan = await getActivePlan(websiteId);
                setPlanType(plan?.plan?.name || null);

                const total = await getTotalBuyers(websiteId, token);

                let average = null;
                let active = null;

                if (plan?.plan?.name === 'Pro') {
                    const [avgRes, activeRes] = await Promise.all([
                        getAverageOrder(websiteId, token),
                        getActiveBuyers(websiteId, token),
                    ]);
                    average = avgRes;
                    active = activeRes;
                }

                setStats({
                    total,
                    average,
                    active,
                });
            } catch (err) {
                console.error('خطا در دریافت آمار مشتریان:', err);
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
                    title="آمار مشتریان"
                    logo="/public/SellerPanel/Customers/icons8-stats-32 1.png"
                />

                {isOpen && (
                    <div className="flex justify-start px-6 flex-wrap gap-4">
                        {/* همیشه نمایش داده شود */}
                        <SalesCard
                            title="تعداد کل مشتریان"
                            amount={stats.total?.buyers_count?.toLocaleString('fa-IR') || '...'}
                            logo="/public/SellerPanel/Customers/icons8-numbers-50 2.png"
                            desc=" "
                        />

                        {/* فقط برای پلن Pro */}
                        {planType === 'Pro' && (
                            <>
                                <SalesCard
                                    title="میانگین خرید هر مشتری"
                                    amount={stats.average?.average_order_per_buyer?.toLocaleString('fa-IR') || '...'}
                                    logo="/public/SellerPanel/Customers/icons8-shopping-cart-48(2).png"
                                    desc=" "
                                />

                                <SalesCard
                                    title="تعداد مشتریان فعال"
                                    amount={stats.active?.active_buyers_count?.toLocaleString('fa-IR') || '...'}
                                    logo="/public/SellerPanel/Customers/icons8-active-50 1.png"
                                    desc="مشتریانی که حداقل یک سفارش در سه ماه اخیر داشته‌اند"
                                />
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReportOrder;
