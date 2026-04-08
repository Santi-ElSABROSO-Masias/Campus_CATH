import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CalendarProps {
    initialDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({ initialDate = new Date(2026, 3, 8) }) => {
    // Current month/year being viewed
    const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    // Currently selected day
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const generateCalendarDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        // First day of current month
        const firstDayOfMonth = new Date(year, month, 1);
        // Get day of week (0 = Sun, 1 = Mon...)
        let startDay = firstDayOfMonth.getDay();
        // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0, 2=Tue -> 1...)
        startDay = startDay === 0 ? 6 : startDay - 1;

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                currentMonth: false
            });
        }

        // Current month days
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= lastDayOfMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                currentMonth: true
            });
        }

        // Next month days (fill up to 42 for exactly 6 rows)
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                currentMonth: false
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    const isToday = (date: Date) => {
        const today = new Date(2026, 3, 8); // System "Today" as requested
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <CalendarIcon size={20} className="text-blue-600" /> Calendario
                </h2>
                <button className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full transition" title="Nuevo evento">
                    <Plus size={18} />
                </button>
            </div>

            <div className="flex justify-between items-center mb-4 text-slate-700">
                <button 
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-slate-100 rounded transition"
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="font-semibold text-sm uppercase tracking-wide">
                    {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button 
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-slate-100 rounded transition"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                    <div key={d} className="text-xs font-bold text-slate-400 py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day, idx) => {
                    const selected = isSelected(day.date);
                    const today = isToday(day.date);
                    
                    return (
                        <button
                            key={idx}
                            onClick={() => handleDateClick(day.date)}
                            className={`
                                py-2 text-sm rounded-lg transition-all relative
                                ${!day.currentMonth ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'}
                                ${selected ? 'bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm z-10' : ''}
                                ${today && !selected ? 'border border-blue-200 text-blue-600 font-semibold' : ''}
                            `}
                        >
                            {day.date.getDate()}
                            {today && !selected && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 space-y-2">
                <Link 
                    to="/calendar" 
                    className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition block text-center border border-transparent"
                >
                    Ir al calendario completo
                </Link>
                <button 
                    onClick={() => console.log("Exportando calendario...")}
                    className="w-full py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 border border-slate-200 rounded-lg transition"
                >
                    Exportar calendarios
                </button>
            </div>
        </div>
    );
};
