import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, CheckCircle, AlertCircle, Calendar as CalendarIcon, Filter, Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export const Dashboard = () => {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem('campus_session_token');
                if (!token) return;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/enrollments/my-progress`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setEnrollments(data);
                }
            } catch (err) {
                console.error("Failed to fetch progress", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const totalInscritos = enrollments.length;
    const completados = enrollments.filter(e => e.computedProgress === 100).length;

    // Simplistic metric mapping
    const actividadesCompletadas = enrollments.reduce((acc, current) =>
        acc + current.attempts.filter((a: any) => a.status === 'Completado').length, 0);

    // Placeholder for pending calculation
    const actividadesPendientes = enrollments.reduce((acc, current) => {
        const total = current.course.modules.reduce((mAcc: number, mod: any) => mAcc + mod.activities.length, 0);
        const done = current.attempts.filter((a: any) => a.status === 'Completado').length;
        return acc + (total - done);
    }, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Área Personal</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                    Personalizar esta página
                </button>
            </div>

            {/* 3.1 Panel de Métricas */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Cursos inscritos" value={loading ? "..." : String(totalInscritos)} icon={<BookOpen size={24} className="text-blue-500" />} />
                <MetricCard label="Cursos completados" value={loading ? "..." : String(completados)} icon={<CheckCircle size={24} className="text-green-500" />} />
                <MetricCard label="Actividades completadas" value={loading ? "..." : String(actividadesCompletadas)} icon={<Clock size={24} className="text-purple-500" />} />
                <MetricCard label="Actividades pendientes" value={loading ? "..." : Math.max(0, actividadesPendientes).toString()} icon={<AlertCircle size={24} className="text-orange-500" />} />
            </section>

            {/* 3.2 Cursos Accedidos Recientemente */}
            <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Cursos accedidos recientemente</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="text-slate-500">Cargando cursos...</div>
                    ) : enrollments.length === 0 ? (
                        <div className="text-slate-500 p-4 border rounded-xl bg-slate-50 border-dashed">No estás inscrito en ningún curso.</div>
                    ) : (
                        enrollments.slice(0, 3).map((enrollment: any) => (
                            <a href={`/course/${enrollment.id}`} key={enrollment.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group block">
                                <div className="h-32 bg-slate-100 relative">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,#2563eb_25%,transparent_25%,transparent_75%,#2563eb_75%,#2563eb),linear-gradient(45deg,#2563eb_25%,transparent_25%,transparent_75%,#2563eb_75%,#2563eb)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-10"></div>
                                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-700 shadow-sm">
                                        Pueba_CATH
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-12">
                                        {enrollment.course.title}
                                    </h3>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Progreso</span>
                                            <span className="font-medium text-slate-700">{enrollment.computedProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${enrollment.computedProgress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3.3 Línea de Tiempo */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Línea de tiempo</h2>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                <select className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                    <option>Próximos 7 días</option>
                                    <option>Próximos 30 días</option>
                                    <option>Próximos 3 meses</option>
                                </select>
                            </div>
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                <input type="text" placeholder="Buscar por tipo o nombre..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                            <p className="text-slate-600 font-medium">No hay cursos actuales ni tareas pendientes</p>
                            <p className="text-sm text-slate-400 mt-1">¡Estás al día con tus capacitaciones!</p>
                        </div>
                    </div>
                </div>

                {/* 3.4 Calendario */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CalendarIcon size={20} className="text-blue-600" /> Calendario
                        </h2>
                        <button className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full transition" title="Nuevo evento">
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-4 text-slate-700">
                        <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={20} /></button>
                        <span className="font-semibold text-sm uppercase tracking-wide">Marzo 2026</span>
                        <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={20} /></button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                            <div key={d} className="text-xs font-bold text-slate-400 py-1">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {/* Mock Calendar Grid */}
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div key={i} className={`py-1.5 text-sm rounded-lg ${i === 14 ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}>
                                {i + 1}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 space-y-2">
                        <button className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition">Ir al calendario completo</button>
                        <button className="w-full py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 border border-slate-200 rounded-lg transition">Exportar calendarios</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-default">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
            {icon}
        </div>
    </div>
);
