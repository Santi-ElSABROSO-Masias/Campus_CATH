import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, PlayCircle, FileText, CheckCircle } from 'lucide-react';

export const CourseViewer = () => {
    const { id } = useParams();
    const [enrollment, setEnrollment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<any>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const token = localStorage.getItem('campus_session_token');
                if (!token) return;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/enrollments/my-progress`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const currentEnrollment = data.find((e: any) => e.courseId === id || e.id === id); // We might pass courseId or enrollmentId
                    if (currentEnrollment) {
                        setEnrollment(currentEnrollment);
                        // Auto-select first activity
                        if (currentEnrollment.course?.modules?.length > 0 && currentEnrollment.course.modules[0].activities?.length > 0) {
                            setSelectedActivity(currentEnrollment.course.modules[0].activities[0]);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch course data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="text-xl font-medium text-slate-500 animate-pulse">Cargando contenido del curso...</div></div>;
    }

    if (!enrollment) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
                <div className="text-xl font-medium text-slate-800">No se encontró el curso asignado.</div>
                <Link to="/dashboard" className="text-indigo-600 hover:underline">Volver al inicio</Link>
            </div>
        );
    }

    const course = enrollment.course;

    const isCurrentActivityCompleted = enrollment.attempts?.some((a: any) => a.activityId === selectedActivity?.id && a.status === 'Completado');

    const handleMarkCompleted = async () => {
        if (!selectedActivity || !enrollment) return;

        try {
            const token = localStorage.getItem('campus_session_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/enrollments/attempts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    enrollmentId: enrollment.id,
                    activityId: selectedActivity.id
                })
            });

            if (res.ok) {
                const updatedAttempt = await res.json();
                setEnrollment((prev: any) => {
                    const attempts = prev.attempts ? [...prev.attempts] : [];
                    const existingIndex = attempts.findIndex(a => a.activityId === selectedActivity.id);
                    if (existingIndex >= 0) {
                        attempts[existingIndex] = updatedAttempt;
                    } else {
                        attempts.push(updatedAttempt);
                    }
                    return { ...prev, attempts };
                });
            } else {
                const errorData = await res.text();
                alert(`Error del servidor al marcar completado: ${res.status} ${errorData}`);
            }
        } catch (e: any) {
            console.error("Error marking as completed:", e);
            alert("Error de conexión al marcar como completado: " + e.message);
        }
    };

    const renderContent = () => {
        if (!selectedActivity) return <div className="flex justify-center items-center h-full text-slate-500">Seleccione una actividad del menú lateral.</div>;

        if (selectedActivity.activityType.toLowerCase() === 'video') {
            return (
                <div className="w-full h-full bg-black flex items-center justify-center">
                    <video
                        src={selectedActivity.contentUrl}
                        controls
                        className="max-w-full max-h-full"
                        controlsList="nodownload"
                    >
                        Tu navegador no soporta el tag de video.
                    </video>
                </div>
            );
        }

        if (selectedActivity.activityType.toLowerCase() === 'documento' || selectedActivity.activityType.toLowerCase() === 'pdf') {
            return (
                <div className="w-full h-full bg-slate-100 flex flex-col">
                    <iframe
                        src={`${selectedActivity.contentUrl}#toolbar=0`}
                        className="w-full h-full border-0"
                        title={selectedActivity.title}
                    />
                </div>
            );
        }

        return <div className="p-8 text-center text-slate-600">Tipo de contenido no soportado para previsualización.</div>;
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-10 shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
                    <Link to="/dashboard" className="p-1.5 hover:bg-slate-200 rounded-full text-slate-600 transition">
                        <ChevronLeft size={20} />
                    </Link>
                    <h1 className="font-bold text-slate-800 truncate" title={course.title}>{course.title}</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {course.modules.map((mod: any, index: number) => (
                        <div key={mod.id}>
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
                                Módulo {index + 1}: {mod.title}
                            </h2>
                            <div className="space-y-1">
                                {mod.activities.map((act: any) => {
                                    const isSelected = selectedActivity?.id === act.id;
                                    const isCompleted = enrollment.attempts?.some((a: any) => a.activityId === act.id && a.status === 'Completado');

                                    return (
                                        <button
                                            key={act.id}
                                            onClick={() => setSelectedActivity(act)}
                                            className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition ${isSelected ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
                                        >
                                            <div className={`mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                                                {act.activityType.toLowerCase() === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium leading-snug truncate ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                    {act.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {act.activityType}
                                                    </span>
                                                </div>
                                            </div>
                                            {isCompleted && (
                                                <div className="text-green-500">
                                                    <CheckCircle size={16} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative bg-white">
                <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shadow-sm z-10 shrink-0">
                    <h2 className="font-semibold text-slate-800 text-lg">{selectedActivity?.title || 'Contenido'}</h2>
                    {selectedActivity && !isCurrentActivityCompleted && (
                        <button onClick={handleMarkCompleted} className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm flex items-center gap-2">
                            <CheckCircle size={16} />
                            Marcar como completado
                        </button>
                    )}
                    {isCurrentActivityCompleted && (
                        <div className="flex items-center gap-2 text-green-600 font-medium px-4 py-2 border border-green-200 bg-green-50 rounded-lg">
                            <CheckCircle size={18} />
                            Completado
                        </div>
                    )}
                </header>
                <div className="flex-1 relative overflow-hidden bg-slate-100">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
