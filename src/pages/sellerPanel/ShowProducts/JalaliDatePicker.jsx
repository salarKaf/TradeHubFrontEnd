import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';


 const JalaliDatePicker = ({ value, onChange, placeholder = "انتخاب تاریخ" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState({
    year: value?.year || 1403,
    month: value?.month || 1
  });

  // ماه‌های شمسی
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  // روزهای هفته
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  // تعداد روز در هر ماه
  const getDaysInMonth = (year, month) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    // بررسی سال کبیسه برای اسفند
    return isLeapYear(year) ? 30 : 29;
  };

  // بررسی سال کبیسه
  const isLeapYear = (year) => {
    const breaks = [
      -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
      1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
    ];
    
    const gy = year + 1595;
    let leap = -14;
    let jp = breaks[0];
    
    let jump = 0;
    for (let j = 1; j <= 19; j++) {
      const jm = breaks[j];
      jump = jm - jp;
      if (year < jm) break;
      leap += Math.floor(jump / 33) * 8 + Math.floor(((jump % 33) + 3) / 4);
      jp = jm;
    }
    
    let n = year - jp;
    if (n < jump) {
      leap += Math.floor(n / 33) * 8 + Math.floor(((n % 33) + 3) / 4);
      if ((jump % 33) === 4 && (jump - n) === 4) leap++;
    }
    
    return (leap + 1) % 7 < 2;
  };

  // محاسبه روز اول ماه در هفته
  const getFirstDayOfMonth = (year, month) => {
    // تبدیل تاریخ شمسی به میلادی
    const gregorianDate = jalaliToGregorian(year, month, 1);
    const jsDate = new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day);
    return (jsDate.getDay() + 1) % 7; // تنظیم برای شنبه = 0
  };

  // تبدیل شمسی به میلادی (ساده شده)
  const jalaliToGregorian = (jy, jm, jd) => {
    const epOff = jy - 979;
    let epYear = 621 + 33 * Math.floor(epOff / 1029);
    const aux1 = epOff % 1029;
    let aux2 = Math.floor(aux1 / 33);
    let epBase = epYear + 4 * aux2;
    
    if (aux1 % 33 >= 29) {
      aux2++;
      epBase += 4;
    }
    
    if (aux2 === 31) {
      aux2 = 30;
      epYear++;
      epBase++;
    }
    
    let jDayOfYear = 0;
    for (let i = 1; i < jm; i++) {
      jDayOfYear += getDaysInMonth(jy, i);
    }
    jDayOfYear += jd;
    
    const gDayOfYear = jDayOfYear <= 186 
      ? jDayOfYear 
      : jDayOfYear - 186 + Math.floor((epBase + 1) * 365.25) - Math.floor(epYear * 365.25) + 186;
    
    const gy = epBase + Math.floor(gDayOfYear / 365.25);
    const gDayOfYearInGy = gDayOfYear - Math.floor((gy - epBase) * 365.25);
    
    const isLeap = ((gy % 4) === 0 && (gy % 100) !== 0) || ((gy % 400) === 0);
    const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    let gm = 1;
    let gd = gDayOfYearInGy;
    
    for (let i = 0; i < 12; i++) {
      if (gd <= daysInMonths[i]) {
        gm = i + 1;
        break;
      }
      gd -= daysInMonths[i];
    }
    
    return { year: gy, month: gm, day: gd };
  };

  // تولید تقویم ماه
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate.year, currentDate.month);
    const firstDay = getFirstDayOfMonth(currentDate.year, currentDate.month);
    const days = [];
    
    // روزهای خالی ابتدای ماه
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // روزهای ماه
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // انتخاب روز
  const selectDay = (day) => {
    if (day) {
      const selectedDate = {
        year: currentDate.year,
        month: currentDate.month,
        day: day
      };
      onChange(selectedDate);
      setIsOpen(false);
    }
  };

  // ماه قبل
  const prevMonth = () => {
    if (currentDate.month === 1) {
      setCurrentDate({ year: currentDate.year - 1, month: 12 });
    } else {
      setCurrentDate({ ...currentDate, month: currentDate.month - 1 });
    }
  };

  // ماه بعد
  const nextMonth = () => {
    if (currentDate.month === 12) {
      setCurrentDate({ year: currentDate.year + 1, month: 1 });
    } else {
      setCurrentDate({ ...currentDate, month: currentDate.month + 1 });
    }
  };

  // تغییر سال
  const changeYear = (newYear) => {
    setCurrentDate({ ...currentDate, year: newYear });
  };

  const days = generateCalendar();

  return (
    <div className="relative">
      {/* فیلد ورودی */}
      <div
        className="bg-white w-full px-4 py-3 border border-orange-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value 
            ? `${value.year}/${value.month.toString().padStart(2, '0')}/${value.day.toString().padStart(2, '0')}`
            : placeholder
          }
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {/* تقویم */}
      {isOpen && (
        <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 min-w-80">
          {/* هدر */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              {/* انتخاب سال */}
              <select
                value={currentDate.year}
                onChange={(e) => changeYear(parseInt(e.target.value))}
                className="px-2 py-1 border border-gray-200 rounded text-sm"
              >
                {Array.from({ length: 50 }, (_, i) => {
                  const year = 1380 + i;
                  return (
                    <option key={year} value={year}>{year}</option>
                  );
                })}
              </select>
              
              <span className="font-medium">
                {persianMonths[currentDate.month - 1]}
              </span>
            </div>
            
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* روزهای هفته */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* روزهای ماه */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => selectDay(day)}
                disabled={!day}
                className={`
                  p-2 text-sm rounded-lg transition-colors
                  ${!day 
                    ? 'invisible' 
                    : value && value.year === currentDate.year && value.month === currentDate.month && value.day === day
                      ? 'bg-orange-500 text-white font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>
          
          {/* دکمه پاک کردن */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              پاک کردن تاریخ
            </button>
          </div>
        </div>
      )}

      {/* کلیک خارج از تقویم */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
export default JalaliDatePicker;