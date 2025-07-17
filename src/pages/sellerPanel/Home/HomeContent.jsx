import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import InfoCard from '../Layouts/card';
import { FiBell } from 'react-icons/fi'; // آیکن نوتیفیکیشن
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { getActivePlan } from '../../../API/website';


import { getTotalRevenue, getTotalSalesCount, getProductCount } from '../../../API/dashboard';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';



// Registering the required components of Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartData = {
  labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
  datasets: [
    {
      label: 'فروش',
      data: [1000, 2000, 3000, 4000, 5000, 6000], // داده‌ها باید به صورت صحیح وارد شوند
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
    },
  ],
};


const HomeContent = () => {


  const { websiteId } = useParams();

  const [data, setData] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: [],
    announcements: [],
    bestProducts: [],
  });

  const [planType, setPlanType] = useState(null); // "Basic" یا "Pro"

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const website_Id = websiteId;

        const [revenue, salesCount, productCount, activePlan] = await Promise.all([
          getTotalRevenue(website_Id),
          getTotalSalesCount(website_Id),
          getProductCount(website_Id),
          getActivePlan(website_Id),
        ]);

        setData(prevData => ({
          ...prevData,
          totalSales: revenue?.total_revenue || 0,
          totalOrders: salesCount?.total_sales_count || 0,
          totalProducts: productCount?.product_count || 0,
        }));

        setPlanType(activePlan?.plan?.name || null);




        console.log("✅ داده‌های داشبورد با موفقیت دریافت شد:");
        console.log("درآمد:", revenue?.total_revenue);
        console.log("تعداد سفارش:", salesCount?.total_sales_count);

      } catch (error) {
        console.error("❌ خطا در دریافت اطلاعات داشبورد:", error);
      }
    };

    if (websiteId) fetchDashboardData();
  }, [websiteId]);



  return (
    <div>
      <div className='mx-4 border-2 border-black border-opacity-20 rounded-lg'>
        <h1 className="text-lg pr-5 my-4 font-modam"> به پنل فـروشنــدگان خوش آمدید. آمار و اطـلاعـات فروشـــگاه شما در یک نگاه.</h1>
      </div>

      <div className="p-4 h-44 flex w-full justify-between">
        {/* اولین کارت (بزرگترین) */}
        <div className="flex font-modam justify-between items-center p-6 rounded-xl border-2 border-black border-opacity-20 w-full max-w-[450px] flex-grow">
          <div>
            <h2 className="text-3xl font-medium">{data.totalSales.toLocaleString()}</h2>
            <p className="text-lg text-opacity-5 font-extralight">درآمد کل فروشگاه از ابتدا</p>
          </div>
          <div>
            <img src='/SellerPanel/Home/Frame 64.png' alt="sales" />
          </div>
        </div>

        {/* دومین کارت */}
        <InfoCard
          title={data.totalProducts.toLocaleString()}
          subtitle="محصولات"
          logo="/public/SellerPanel/Home/icons8-package-64(1).png"
          titleColor="text-black"
        />

        {/* سومین کارت (کوچکترین) */}
        <div className="flex font-modam justify-between items-center p-6 rounded-xl border-2 border-black border-opacity-20 w-full max-w-[300px] flex-grow">
          <div>
            <h2 className="text-3xl font-medium">{data.totalOrders}</h2>
            <p className="text-lg text-opacity-5 font-extralight">فروش</p>
          </div>
          <div>
            <img src='/SellerPanel/Home/shoping-cart.png' alt="orders" />
          </div>
        </div>
      </div>

      <div className='p-4 flex justify-between'>


        {/* جدول آخرین سفارشات */}
        <div className={`mb-6 pb-6 p-5 font-modam rounded-xl border-black border-opacity-20 border-2 ${planType === "Pro" ? "w-[55%]" : "w-[48%]"}`}>
          <h2 className="text-2xl font-semibold mb-4 p-5 text-zinc-600">آخرین سفارشات</h2>
          <table className="w-full table-auto mb-6">
            <thead>
              <tr className="my-10">
                <th className="p-2 ">تاریخ</th>
                <th className="p-2 ">شناسه سفارش</th>
                <th className="p-2 ">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.length > 0 ? (
                data.recentOrders.map((order, index) => (
                  <tr key={index} className="border-t border-black border-opacity-10 text-center">
                    <td className="py-3">{order.date}</td>
                    <td className="py-3">{order.name}</td>
                    <td className="py-3">{order.amount} تومان</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500">
                    اطلاعاتی جهت نمایش وجود ندارد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <a className='p-10 text-cyan-700' href={`/orders/${websiteId}`} > مشاهده کل سفارشات   &gt; </a>
        </div>


        <div className={`mb-6 pb-6 font-modam rounded-xl border-black border-opacity-20 border-2 ${planType === "Pro" ? "w-[42%]" : "w-[48%]"}`}>
          <h2 className="text-2xl font-semibold mb-4 p-5 text-zinc-600">آخرین محصولات</h2>
          <table className="w-full table-auto mb-6">
            <thead>
              <tr className="my-10">
                <th className="p-2 ">نام محصول</th>
                <th className='p-2 '>مبلغ</th>
                <th className="p-2 ">تعداد فروش</th>
              </tr>
            </thead>
            <tbody>
              {data.bestProducts.length > 0 ? (
                data.bestProducts.map((order, index) => (
                  <tr key={index} className="border-t border-black border-opacity-10 text-center">
                    <td className="py-3">{order.name}</td>
                    <td className="py-3">{order.amount}</td>
                    <td className="py-3">{order.Numsale} تومان</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500">
                    اطلاعاتی جهت نمایش وجود ندارد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <a className='p-10 text-cyan-700' href={`/products/${websiteId}`}> مشاهده کل محصولات   &gt; </a>
        </div>
      </div>

      <div className='p-4 flex justify-between'>





        {/* اعلان‌های جدید - فقط برای Pro */}
        {planType !== "Pro" && (
          <div className="mb-6 w-[42%] font-modam rounded-xl border-black border-opacity-20 border-2">
            <h2 className="text-2xl font-semibold mb-10 p-6 text-zinc-600">اعلان‌های جدید</h2>
            <div>
              {data.announcements.length > 0 ? (
                data.announcements.map((announcement, index) => (
                  <div key={index} className="py-1 px-5 mb-4 flex justify-between">
                    <div className='px-3'>
                      <p className="text-md pb-1">{announcement.message}</p>
                      <p className="text-gray-500">{announcement.date}</p>
                    </div>
                    <FiBell className='w-5 h-5'></FiBell>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  اعلانی وجود ندارد
                </div>
              )}
            </div>
            {data.announcements.length > 0 && (
              <a className='p-10 text-cyan-700' href='/orders'>   مشاهده کل اعلانات    &gt;   </a>
            )}
          </div>
        )}

        {planType !== "Pro" && (
          <div className='mb-6 pb-6 p-5 w-[55%] font-modam rounded-xl border-black border-opacity-20 border-2'>
            <h2>نگاهی به میزان فروش 6 ماه اخیر</h2>
            <Line data={chartData} />
          </div>
        )}
      </div>

      <div className='flex h-24 mx-4 border-2 border-black border-opacity-20 rounded-lg items-center justify-between'>
        <h1 className="text-lg pr-5 my-4 font-modam"> برای اضافــه کردن محصول جدید به فروشگاه خود روی دکمه رو به رو کلیک کنید.</h1>
        <Link to={`/products/${websiteId}`} className="bg-[#1e202d] font-modam font-medium text-lg w-64 h-3/5 ml-32 text-white py-2 px-6 rounded-3xl shadow-md pt-3">
          افــزودن مـحـصول جـدیـد +
        </Link>
      </div>
    </div>
  );
};

export default HomeContent;
