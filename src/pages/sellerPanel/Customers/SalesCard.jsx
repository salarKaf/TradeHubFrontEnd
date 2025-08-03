// SalesCard.js
import React from 'react';

function SalesCard({ title, amount, logo, desc, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="w-full sm:w-[320px] md:w-[360px] h-[140px] md:h-[180px] flex gap-3 font-modam justify-between items-center p-3 md:p-4 rounded-xl border-2 border-black border-opacity-25 flex-shrink-0">
        {/* Skeleton Content */}
        <div className="flex-1 min-w-0">
          <div className='items-center py-8 md:py-20'>
            {/* Title Skeleton */}
            <div className="h-4 md:h-5  rounded animate-pulse mb-3 md:mb-5 w-3/4"></div>
            {/* Amount Skeleton */}
            <div className="h-5 md:h-6  rounded animate-pulse mb-3 md:mb-5 w-1/2"></div>
            {/* Description Skeleton */}
            <div className="h-3  rounded animate-pulse w-full"></div>
            <div className="h-3  rounded animate-pulse w-2/3 mt-1"></div>
          </div>
        </div>
        {/* Icon Skeleton */}
        <div className=" rounded-lg p-2 flex-shrink-0 animate-pulse">
          <div className='w-[28px] h-[28px] md:w-[35px] md:h-[35px rounded'></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[320px] md:w-[360px] h-[140px] md:h-[180px] flex gap-3 font-modam justify-between items-center p-3 md:p-4 rounded-xl border-2 border-black border-opacity-25 flex-shrink-0hover:shadow-lg transition-shadow">
      <div className="flex-1 min-w-0">
        <div className='items-center py-8 md:py-20'>
          <h3 className="text-sm md:text-lg font-medium text-gray-800 truncate mb-3 md:mb-5">{title}</h3>
          <p className="text-lg md:text-xl font-semibold text-gray-600 whitespace-nowrap mb-3 md:mb-5">{amount}</p>
          <p className="text-[10px] md:text-[11px] text-gray-900 line-clamp-2 leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className="bg-[#7d97ff81] rounded-lg p-2 flex-shrink-0">
        <img className='w-[28px] h-[28px] md:w-[35px] md:h-[35px]' src={logo} alt="card-icon" />
      </div>
    </div>
  );
}

export default SalesCard;