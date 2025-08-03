import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="relative w-full bg-[#FFF7E7]">
      <div className="absolute top-0 left-0 w-full h-[85px] bg-[#1E212D] md:bg-transparent z-0"></div>
      
      <svg
        className="hidden md:block absolute top-0 left-0 w-full h-[178px] z-0"
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

      <div className="relative z-10 flex justify-between items-center px-4 md:px-8 py-4 md:py-6 text-[#FAF3E0]">
        
        <div className="flex gap-3 md:gap-4">
          <Link
            to="/login"
            className="border border-white text-white bg-transparent px-4 md:px-5 py-2 rounded-2xl font-bold hover:bg-white hover:text-[#1E212D] transition-all text-sm md:text-base">
            ورود به حساب
          </Link>
          <Link
            to="/signup"
            className="bg-[#EABF9F] text-[#1E212D] px-4 md:px-5 py-2 rounded-2xl font-bold hover:bg-[#f3d6bb] transition-all text-sm md:text-base"
          >
            شروع کنید
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-[#EABF9F] text-[20px] md:text-[25px] font-krona mt-2">Trade Hub</h1>

          <div className="hidden md:flex justify-center items-center gap-3 mt-3">
            <div className="w-10 h-px bg-[#FAF3E0]"></div>
            <div className="w-32 h-px bg-[#FAF3E0]"></div>
          </div>
        </div>

      </div>
    </div>
  );
}