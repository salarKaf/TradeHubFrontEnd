import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { path: "/", label: "صفحه اصلی" },
    { path: "/contact", label: "ارتباط ما" },
    { path: "/pricing", label: "تعرفه ها" },
    { path: "/portfolio", label: "نمونه کارها" },
  ];

  return (
    <div className="relative w-full">
      {/* منحنی پس‌زمینه طبق SVG جدید */}
      <svg
        className="absolute top-0 left-0 w-full h-[178px] z-0"
        viewBox="0 0 1440 178"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter
            id="filter0_d_83_1457"
            x="-4"
            y="-13"
            width="1448"
            height="191"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_83_1457"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_83_1457"
              result="shape"
            />
          </filter>
        </defs>
        <g filter="url(#filter0_d_83_1457)">
          <path
            d="M0.0938381 -13H1440V144.536C1314.01 71.7307 483.059 105.046 235.575 153.637C-11.9087 202.228 0.0938381 127.12 0.0938381 127.12V-13Z"
            fill="#1E212D"
          />
        </g>
      </svg>

      {/* نوبار */}
      <div className="relative z-10 flex justify-between items-center px-8 py-6 text-white">
        <div className="space-x-4">
          <button className="bg-white text-[#1E212D] px-4 py-2 rounded-md">ورود</button>
          <button className="bg-orange-400 text-white px-4 py-2 rounded-md">شروع کنید</button>
        </div>

        <div className="flex space-x-8 rtl:space-x-reverse">
          {links.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`font-rubik font-semibold hover:text-orange-400 px-3 py-1 rounded transition-all
                  ${isActive ? "border-2 border-orange-400" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <h1 className="text-[#EABF9F] text-[25px] font-krona mt-2">Trade Hub</h1>

          {/* خطوط زیر متن */}
          <div className="flex justify-center flex-d items-center gap-3 mt-3">
            <div className="w-10 h-px bg-[#FAF3E0]"></div>
            <div className="w-32 h-px bg-[#FAF3E0]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
