// ReportOrder.js
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

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-[280px] h-[120px] sm:h-[140px] flex gap-2 sm:gap-3 justify-between items-center p-3 sm:p-4 rounded-xl border-2 border-gray-200 animate-pulse">
      <div className="flex-1 min-w-0">
        <div className='flex justify-between items-center pb-2 sm:pb-3'>
          <div className="h-3 sm:h-4 bg-gray-300 rounded w-16 sm:w-20"></div>
          <div className="h-3 bg-gray-300 rounded w-8 sm:w-10"></div>
        </div>
        <div className='flex justify-between items-center'>
          <div className="h-3 sm:h-4 bg-gray-300 rounded w-10 sm:w-12"></div>
          <div className="h-4 sm:h-5 bg-gray-300 rounded w-20 sm:w-24"></div>
        </div>
      </div>
      <div className="bg-gray-300 rounded-lg w-[32px] h-[32px] sm:w-[39px] sm:h-[39px]"></div>
    </div>
  );
};

const ReportOrder = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [planType, setPlanType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: null,
        daily: null,
        monthly: null,
        yearly: null,
    });
    const { websiteId } = useParams();

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const plan = await getActivePlan(websiteId);
                setPlanType(plan?.plan?.name || null);

                const [countRes, revenueRes] = await Promise.all([
                    getTotalSalesCount(websiteId, token),
                    getTotalRevenue(websiteId),
                ]);

                const result = {
                    total: {
                        total_sales_count: countRes.total_sales_count,
                        total_sales_amount: revenueRes.total_revenue,
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
            } finally {
                setIsLoading(false);
            }
        };

        if (websiteId) fetchStats();
    }, [websiteId]);

    return (
        <div className="py-6 sm:py-10 px-4 sm:px-0 ">
            <div className="mb-5">
                <OrdersHeader
                    isOpenTable={isOpen}
                    setIsOpenTable={setIsOpen}
                    title="گزارش فروش"
                    logo="/SellerPanel/Orders/icons8-report-50(1) 1.png"
                />
                {isOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 w-full justify-items-center ">
                        {isLoading ? (
                            <>
                                <LoadingSkeleton />
                                {planType === 'Pro' && (
                                    <>
                                        <LoadingSkeleton />
                                        <LoadingSkeleton />
                                        <LoadingSkeleton />
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {stats.total && (
                                    <SalesCard
                                        title="فروش کل"
                                        amount={stats.total.total_sales_amount?.toLocaleString('fa-IR') || 'نامشخص'}
                                        count={stats.total.total_sales_count?.toLocaleString('fa-IR') || '0'}
                                        logo='/SellerPanel/Orders/icons8-shopping-cart-48(1).png'
                                    />
                                )}

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
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportOrder;