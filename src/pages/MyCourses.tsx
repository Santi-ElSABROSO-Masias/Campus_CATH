import { Filter, Search, MoreVertical, LayoutGrid, List } from 'lucide-react';

export const MyCourses = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-slate-800">Mis Cursos</h1>

            {/* 4.1 y 4.2 Herramientas y Filtros */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none md:w-48">
                        <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <select className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full text-sm font-medium text-slate-700 outline-none">
                            <option>Todos</option>
                            <option>En progreso</option>
                            <option>Futuros</option>
                            <option>Pasados</option>
                            <option>Destacados</option>
                        </select>
                    </div>
                    <div className="relative flex-1 md:flex-none md:w-64">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input type="text" placeholder="Buscar curso..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full text-sm outline-none" />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 p-t-4 md:pt-0 border-slate-100">
                    <select className="py-2 px-3 bg-transparent text-sm font-medium text-slate-600 outline-none cursor-pointer">
                        <option>Ordenar por nombre del curso</option>
                        <option>Ordenar por último acceso</option>
                    </select>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button className="p-1.5 bg-white shadow-sm text-slate-800 rounded-md"><LayoutGrid size={18} /></button>
                        <button className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md transition"><List size={18} /></button>
                    </div>
                </div>
            </div>

            {/* 4.3 Tarjetas de Curso */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Caso 1: En progreso */}
                <CourseCard
                    empresa="Orica"
                    titulo="Desacelera en la Ruta 2026"
                    progreso={66}
                    actividades="2 de 3 actividades completadas"
                />
                {/* Caso 2: Completado */}
                <CourseCard
                    empresa="Demos"
                    titulo="Ruta de Aprendizaje Acelerado"
                    progreso={100}
                    actividades="5 de 5 actividades completadas"
                />
            </div>
        </div>
    );
};

interface CourseCardProps {
    empresa: string;
    titulo: string;
    progreso: number;
    actividades: string;
}

const CourseCard = ({ empresa, titulo, progreso, actividades }: CourseCardProps) => (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
        <div className="h-40 bg-slate-200 relative">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:12px_12px]"></div>
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm">{empresa}</div>
            <button className="absolute top-4 right-4 text-white hover:text-blue-200 transition bg-black/20 p-1.5 rounded-full backdrop-blur-sm">
                <MoreVertical size={18} />
            </button>
        </div>

        <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 text-lg mb-4 cursor-pointer">
                {titulo}
            </h3>

            <div className="mt-auto">
                <p className="text-xs text-slate-500 mb-2">{actividades}</p>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-1000 ${progreso === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${progreso}%` }}
                    ></div>
                </div>
                <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700">{progreso}% completado</span>
                </div>
            </div>
        </div>
    </div>
);
