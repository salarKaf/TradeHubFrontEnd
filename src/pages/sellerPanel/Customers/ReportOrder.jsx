
// ReportOrder.js
import React, { useState, useEffect } from 'react';
import SalesCard from './SalesCard';
import OrdersHeader from './CustomersHeader';
import { getActiveBuyers, getAverageOrder, getTotalBuyers } from '../../../API/customers';
import { getActivePlan } from '../../../API/website';
import { useParams } from 'react-router-dom';

const ReportOrder = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [planType, setPlanType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: null,
        average: null,
        active: null,
    });
    const { websiteId } = useParams();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        if (websiteId) fetchStats();
    }, [websiteId]);

    return (
        <div className="py-6 md:py-10">
            <div className="mb-5">
                <OrdersHeader
                    isOpenTable={isOpen}
                    setIsOpenTable={setIsOpen}
                    title="آمار مشتریان"
                    logo="/public/SellerPanel/Customers/icons8-stats-32 1.png"
                />
                {isOpen && (
                    <div className="px-3 md:px-6">
                        {/* Loading State */}
                        {isLoading ? (
                            <>
                                {/* Main Loading Card - Always shown */}
                                <div className="flex justify-start flex-wrap gap-3 md:gap-4 mb-4">
                                    <SalesCard isLoading={true} />
                                </div>

                                {/* Additional Loading Cards for Pro plan simulation */}
                                <div className="flex justify-start flex-wrap gap-3 md:gap-4">
                                    <SalesCard isLoading={true} />
                                    <SalesCard isLoading={true} />
                                </div>

                                {/* Loading Text */}
                                <div className="text-center mt-6">
                                    <div className="inline-flex items-center gap-2 text-sm md:text-base text-gray-600">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        در حال دریافت آمار مشتریان...
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Loaded State */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                {/* همیشه نمایش داده شود */}
                                <SalesCard
                                    title="تعداد کل مشتریان"
                                    amount={stats.total?.buyers_count?.toLocaleString('fa-IR') || '0'}
                                    logo="/public/SellerPanel/Customers/icons8-numbers-50 2.png"
                                    desc=" "
                                />

                                {/* فقط برای پلن Pro */}
                                {planType === 'Pro' && (
                                    <>
                                        <SalesCard
                                            title="میانگین خرید هر مشتری"
                                            amount={`${stats.average?.average_order_per_buyer?.toLocaleString('fa-IR') || '0'} ریال`} logo="/public/SellerPanel/Customers/icons8-shopping-cart-48(2).png"
                                            desc=" "
                                        />
                                        <SalesCard
                                            title="تعداد مشتریان فعال"
                                            amount={stats.active?.active_buyers_count?.toLocaleString('fa-IR') || '0'}
                                            logo="/public/SellerPanel/Customers/icons8-active-50 1.png"
                                            desc="مشتریانی که حداقل یک سفارش در سه ماه اخیر داشته‌اند"
                                        />
                                    </>
                                )}
                            </div>
                        )}

                        {/* Plan Info */}
                        {!isLoading && planType !== 'Pro' && (
                            <div className="mt-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs md:text-sm text-blue-800 text-center">
                                    💡 برای مشاهده آمار تکمیلی، پلن خود را به Pro ارتقا دهید
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportOrder;