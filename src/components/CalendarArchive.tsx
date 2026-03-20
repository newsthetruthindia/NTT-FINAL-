'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CalendarArchive() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    
    const year = clickedDate.getFullYear();
    const month = String(clickedDate.getMonth() + 1).padStart(2, '0');
    const dateStr = String(clickedDate.getDate()).padStart(2, '0');
    
    router.push(`/archive/${year}/${month}/${dateStr}`);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Browse History</span>
          <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">
            {monthName} <span className="text-primary italic lowercase font-serif font-normal">{year}</span>
          </h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevMonth}
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleNextMonth}
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <div key={idx} className="aspect-square flex items-center justify-center">
            {day && (
              <button
                onClick={() => handleDateClick(day)}
                className={`
                  w-full h-full rounded-2xl text-sm font-bold transition-all duration-300
                  ${selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'hover:bg-primary/5 hover:text-primary text-gray-700'
                  }
                `}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-50">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
           </div>
           <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 leading-none mb-1">Select A Day</p>
              <p className="text-gray-400 text-[10px] font-medium tracking-tight italic">Browse authentic news stories from our deep archive.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
