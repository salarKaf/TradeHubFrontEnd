import React from 'react';

function SalesCard({ title, amount, logo, desc }) {
  return (
    <div className="w-[360px] h-[180px] flex gap-3 font-modam justify-between items-center p-4 rounded-xl border-2 border-black border-opacity-25 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <div className='items-center py-20'>
          <h3 className="text-lg font-medium text-gray-800 truncate mb-5">{title}</h3>
          <p className="text-xl font-semibold text-gray-600 whitespace-nowrap mb-5">{amount}</p>
          <p className="text-[11px] text-gray-900 truncate">{desc}</p>

        </div>
      </div>
      <div className="bg-[#7d97ff81] rounded-lg p-2 flex-shrink-0">
        <img className='w-[35px] h-[35px]' src={logo} alt="card-icon" />
      </div>
    </div>
  );
}

export default SalesCard;


