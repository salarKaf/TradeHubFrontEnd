import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import InfoCard from '../Layouts/card';
import { FiBell } from 'react-icons/fi'; // آیکن نوتیفیکیشن
import { Line } from 'react-chartjs-2';
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
  const [data, setData] = useState({
    totalSales: 45000000,
    totalProducts: 120,
    totalOrders: 50,
    recentOrders: [
      { date: "1404/04/04", product: "محصول اول", name: "نام محصول", amount: "250,000" },
      { date: "1404/04/04", product: "محصول اول", name: "نام محصول", amount: "250,000" },
      { date: "1404/04/04", product: "محصول اول", name: "نام محصول", amount: "250,000" },
      { date: "1404/04/04", product: "محصول اول", name: "نام محصول", amount: "250,000" },

    ],
    announcements: [
      { message: "محصول یک از دسته بندی یک فروش رفت.", date: "24 فروردین 1404" },
      { message: "مشتری اول دیدگاهی راجع به محصول اول منتشر کرد.", date: "24 فروردین 1404" },
      { message: "محصول اول به دسته بندی اول اضافه شد.", date: "24 فروردین 1404" },
    ],
    bestProducts: [

      { product: "محصول اول", name: "نام محصول", amount: "250,000", Numsale: "50" },
      { product: "محصول اول", name: "نام محصول", amount: "250,000", Numsale: "50" },
      { product: "محصول اول", name: "نام محصول", amount: "250,000", Numsale: "50" },
      { product: "محصول اول", name: "نام محصول", amount: "250,000", Numsale: "50" },



    ]
  });

  useEffect(() => {
    // فرض کنید اینجا داده‌ها از بک‌اند بارگذاری می‌شود
    // fetchData();
  }, []);

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
          title="120"
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

        {/* اعلان‌های جدید */}

        <div className="mb-6  w-[42%] font-modam rounded-xl border-black border-opacity-20 border-2">
          <h2 className="text-2xl font-semibold mb-10 p-6  text-zinc-600">اعلان‌های جدید</h2>
          <div>
            {data.announcements.map((announcement, index) => (
              <div key={index} className="py-1 px-5 mb-4 flex justify-between">

                <div className='px-3'>
                  <p className="text-md pb-1">{announcement.message}</p>
                  <p className="text-gray-500">{announcement.date}</p>

                </div>
                <FiBell className='w-5 h-5'></FiBell>


              </div>
            ))}
          </div>
          <a className='p-10 text-cyan-700' href='/orders'>   مشاهده کل اعلانات    &gt;   </a>

        </div>

        {/* جدول آخرین سفارشات */}
        <div className="mb-6 pb-6 p-5 w-[55%] font-modam rounded-xl border-black border-opacity-20 border-2 ">
          <h2 className="text-2xl font-semibold mb-4 p-5 text-zinc-600">آخرین سفارشات</h2>
          <table className="w-full table-auto mb-6">
            <thead>
              <tr className="my-10">
                <th className="p-2 ">تاریخ</th>
                <th className="p-2 ">شناسه محصول</th>
                <th className='p-2 '>نام محصول</th>
                <th className="p-2 ">مبلغ</th>

              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order, index) => (
                <tr key={index} className="border-t border-black border-opacity-10 text-center">
                  <td className="py-3">{order.date}</td>
                  <td className="py-3">{order.product}</td>
                  <td className="py-3">{order.name}</td>
                  <td className="py-3">{order.amount} تومان</td>

                </tr>

              ))}
            </tbody>

          </table>
          <a className='p-10 text-cyan-700' href='/orders'> مشاهده کل سفارشات   &gt; </a>


        </div>

      </div>
      {/* نمودار فروش */}


      <div className='p-4 flex justify-between'>

        <div className='mb-6 pb-6 w-[42%] font-modam rounded-xl border-black border-opacity-20 border-2'>
          <h2 className="text-2xl font-semibold mb-4 p-5 text-zinc-600">آخرین سفارشات</h2>

          <table className="w-full table-auto mb-6">
            <thead>
              <tr className="my-10">
                <th className="p-2 ">شناسه محصول</th>
                <th className="p-2 ">نام محصول</th>
                <th className='p-2 '>مبلغ</th>
                <th className="p-2 ">تعداد فروش</th>

              </tr>
            </thead>
            <tbody>
              {data.bestProducts.map((order, index) => (
                <tr key={index} className="border-t border-black border-opacity-10 text-center">
                  <td className="py-3">{order.product}</td>
                  <td className="py-3">{order.name}</td>
                  <td className="py-3">{order.amount}</td>
                  <td className="py-3">{order.Numsale} تومان</td>

                </tr>

              ))}
            </tbody>

          </table>
          <a className='p-10 text-cyan-700' href='/orders'> مشاهده کل محصولات   &gt; </a>
        </div>


        <div className='mb-6 pb-6 p-5 w-[55%] font-modam rounded-xl border-black border-opacity-20 border-2'>
          <h2>نگاهی به میزان فروش 6 ماه اخیر</h2>
          <Line data={chartData} />
        </div>

      </div>



      <div className='flex h-24 mx-4 border-2 border-black border-opacity-20 rounded-lg items-center justify-between'>
        <h1 className="text-lg pr-5 my-4 font-modam"> برای اضافــه کردن محصول جدید به فروشگاه خود روی دکمه رو به رو کلیک کنید.</h1>
        <Link to='/products' className="bg-[#1e202d] font-modam font-medium text-lg w-64 h-3/5 ml-32 text-white py-2 px-6 rounded-3xl shadow-md pt-3">
          افــزودن مـحـصول جـدیـد +
        </Link>

      </div>
      {/* دکمه افزودن محصول جدید */}

    </div>
  );
};

export default HomeContent;
