
// SalesCard.js
import React from 'react';

function SalesCard({ title, amount, count, logo }) {
  return (
    <div className="w-full max-w-[280px] h-[120px] sm:h-[140px] flex gap-2 sm:gap-3 font-modam justify-between items-center p-3 sm:p-4 rounded-xl border-2 border-black border-opacity-25 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <div className='flex justify-between items-center pb-2 sm:pb-3'>
          <h3 className="text-xs sm:text-sm font-medium text-gray-800 truncate">{title}</h3>
          <p className="text-xs font-semibold text-gray-600 whitespace-nowrap">{count} عدد</p>
        </div>
        <div className='flex justify-between items-center'>
          <h1 className='text-xs sm:text-sm font-medium text-gray-700'>به مبلغ</h1>
          <p className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{amount}</p>
        </div>
      </div>
      <div className="bg-[#7d97ff81] rounded-lg p-1.5 sm:p-2 flex-shrink-0">
        <img className='w-[28px] h-[28px] sm:w-[35px] sm:h-[35px]' src={logo} alt="card-icon" />
      </div>
    </div>
  );
}

export default SalesCard;
