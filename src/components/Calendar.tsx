import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'deadline' | 'start' | 'cert_exp' | 'notif';
}

interface CalendarProps {
    initialDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({ initialDate = new Date(2026, 3, 8) }) => {
    const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [openPopoverDate, setOpenPopoverDate] = useState<string | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Effect to fetch events with debounce/throttle
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchEvents = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('campus_session_token');
                if (!token) return;

                const month = viewDate.getMonth();
                const year = viewDate.getFullYear();
                
                const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar/events?month=${month}&year=${year}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    signal: controller.signal
                });

                if (response.ok && isMounted) {
                    const data = await response.json();
                    setEvents(data);
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error("Failed to fetch calendar events", err);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchEvents, 300); // 300ms debounce

        return () => {
            isMounted = false;
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [viewDate]);

    // Click-away listener for popover
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpenPopoverDate(null);
            }
        };

        if (openPopoverDate) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openPopoverDate]);

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
        setOpenPopoverDate(null);
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
        setOpenPopoverDate(null);
    };

    const handleDateClick = (date: Date) => {
        const dateStr = date.toDateString();
        setSelectedDate(date);
        
        // Toggle popover if it has events
        const hasEvents = events.some(e => new Date(e.date).toDateString() === dateStr);
        if (hasEvents) {
            setOpenPopoverDate(openPopoverDate === dateStr ? null : dateStr);
        } else {
            setOpenPopoverDate(null);
        }
    };

    const generateCalendarDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        let startDay = firstDayOfMonth.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;

        const days = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), currentMonth: false });
        }
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= lastDayOfMonth; i++) {
            days.push({ date: new Date(year, month, i), currentMonth: true });
        }
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ date: new Date(year, month + 1, i), currentMonth: false });
        }
        return days;
    };

    const calendarDays = generateCalendarDays();

    const isToday = (date: Date) => {
        const today = new Date(2026, 3, 8);
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const getDayEvents = (date: Date) => {
        const dateStr = date.toDateString();
        return events.filter(e => new Date(e.date).toDateString() === dateStr);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'deadline': return 'bg-red-500';
            case 'start': return 'bg-green-500';
            case 'cert_exp': return 'bg-orange-500';
            case 'notif': return 'bg-blue-400';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <CalendarIcon size={20} className="text-blue-600" /> Calendario
                    {loading && <Loader2 size={16} className="animate-spin text-slate-400 ml-1" />}
                </h2>
                <button className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full transition" title="Nuevo evento">
                    <Plus size={18} />
                </button>
            </div>

            <div className="flex justify-between items-center mb-4 text-slate-700">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded transition"><ChevronLeft size={20} /></button>
                <span className="font-semibold text-sm uppercase tracking-wide">
                    {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded transition"><ChevronRight size={20} /></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                    <div key={d} className="text-xs font-bold text-slate-400 py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center relative">
                {calendarDays.map((day, idx) => {
                    const selected = isSelected(day.date);
                    const today = isToday(day.date);
                    const dayEvents = getDayEvents(day.date);
                    const isPopoverOpen = openPopoverDate === day.date.toDateString();
                    
                    return (
                        <div key={idx} className="relative group">
                            <button
                                onClick={() => handleDateClick(day.date)}
                                className={`
                                    w-full py-2 text-sm rounded-lg transition-all relative flex flex-col items-center
                                    ${!day.currentMonth ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'}
                                    ${selected ? 'bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm z-10' : ''}
                                    ${today && !selected ? 'border border-blue-200 text-blue-600 font-semibold' : ''}
                                `}
                            >
                                <span>{day.date.getDate()}</span>
                                
                                {/* Event Dots */}
                                <div className="flex gap-0.5 mt-0.5 justify-center h-1">
                                    {dayEvents.slice(0, 3).map((event, eIdx) => (
                                        <span key={eIdx} className={`w-1 h-1 rounded-full ${getTypeColor(event.type)}`}></span>
                                    ))}
                                    {dayEvents.length > 3 && <span className="w-1 h-1 rounded-full bg-slate-400"></span>}
                                </div>

                                {today && !selected && (
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                                )}
                            </button>

                            {/* Popover */}
                            {isPopoverOpen && (
                                <div 
                                    ref={popoverRef}
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-3 animate-in fade-in zoom-in duration-200 text-left"
                                >
                                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider border-bottom border-slate-100 pb-1"> Eventos </p>
                                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                        {dayEvents.map(event => (
                                            <div key={event.id} className="flex gap-2 items-start group/item">
                                                <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${getTypeColor(event.type)}`}></span>
                                                <span className="text-xs text-slate-700 leading-tight font-medium group-hover/item:text-blue-600 transition-colors">
                                                    {event.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45"></div>
                                </div>
                            )}
                        </div>
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
