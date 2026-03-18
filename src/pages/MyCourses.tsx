import { useState, useEffect } from 'react';
import { Filter, Search, MoreVertical, LayoutGrid, List, Download } from 'lucide-react';
import { generarCertificadoHTML } from '../utils/generarCertificado';

export const MyCourses = () => {
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

    // Filter only completed
    const completedCourses = enrollments.filter(e => e.computedProgress === 100);

    const handleDownloadCertificate = (enrollment: any) => {
        const userStr = localStorage.getItem('campus_user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (!user) {
            alert("No se encontró información de usuario. Por favor inicie sesión nuevamente.");
            return;
        }

        // Include BOM right before the HTML string so browsers definitely treat it as UTF-8
        const htmlContent = '\uFEFF' + generarCertificadoHTML({
            nombre: user.name,
            apellido: user.lastName,
            // Prioritiza primero el DNI que viene directo de la tabla de usuarios via la relación del backend, luego el cache
            dni: enrollment.user?.dni || user.dni || user.username || 'Sin DNI',
            fechaAprobacion: new Date(enrollment.enrolledAt).toLocaleDateString(), // Approx since we dont have exact completedAt at root level usually,
            codigoUnico: 'CERT-' + enrollment.id.substring(0, 8).toUpperCase(),
            cursoTitulo: enrollment.course.title
        });

        const htmlUrl = URL.createObjectURL(new Blob([htmlContent], { type: 'text/html;charset=utf-8' }));

        const printWindow = window.open(htmlUrl, '_blank');
        if (printWindow) {
            printWindow.document.close();
            printWindow.focus();
        }
    };
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
                {loading ? (
                    <div className="col-span-full text-center py-10 text-slate-500">Cargando cursos...</div>
                ) : completedCourses.length === 0 ? (
                    <div className="col-span-full text-center py-10 border rounded-xl bg-slate-50 border-dashed text-slate-500">
                        Aún no tienes inducciones completadas.
                    </div>
                ) : (
                    completedCourses.map(e => (
                        <CourseCard
                            key={e.id}
                            empresa="Catalina Huanca"
                            titulo={e.course.title}
                            progreso={e.computedProgress}
                            actividades={`${e.attempts.filter((a: any) => a.status === 'Completado').length} actividades completadas`}
                            onDownload={() => handleDownloadCertificate(e)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

interface CourseCardProps {
    empresa: string;
    titulo: string;
    progreso: number;
    actividades: string;
    onDownload: () => void;
}

const CourseCard = ({ empresa, titulo, progreso, actividades, onDownload }: CourseCardProps) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full relative">
            <div className="h-40 bg-slate-200 relative">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:12px_12px]"></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm">{empresa}</div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="absolute top-4 right-4 text-white hover:text-blue-200 transition bg-black/20 p-1.5 rounded-full backdrop-blur-sm"
                >
                    <MoreVertical size={18} />
                </button>

                {menuOpen && (
                    <div className="absolute top-12 right-4 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden w-48 z-10 animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => { onDownload(); setMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                        >
                            <Download size={16} className="text-[#00A064]" />
                            Descargar Certificado
                        </button>
                    </div>
                )}
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
    )
};
