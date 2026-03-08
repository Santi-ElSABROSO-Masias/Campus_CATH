import { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react';

export const Home = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('campus_session_token');

                const response = await fetch('http://localhost:3001/api/courses', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="space-y-8">
            {/* Banner Area */}
            <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Bienvenido a su plataforma de capacitación</h1>
                    <p className="text-blue-100 text-lg mb-6">Explore el catálogo de cursos corporativos disponibles para su perfil.</p>
                    <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                        Explorar catálogo
                    </button>
                </div>
                <div className="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full opacity-50 blur-3xl"></div>
            </div>

            {/* Catálogo */}
            <div>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Cursos Disponibles</h2>
                    <button className="text-blue-600 font-medium hover:underline">Ver todos</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500 py-10">Cargando catálogo...</div>
                    ) : courses.length === 0 ? (
                        <div className="col-span-full text-center py-10 border rounded-xl bg-gray-50 border-dashed text-gray-500">
                            No hay cursos publicados disponibles en este momento.
                        </div>
                    ) : (
                        courses.map((course) => (
                            <a href={`/course/${course.id}`} key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                <div className="h-40 bg-gray-200 relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1d4ed8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700">
                                        Pueba_CATH
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-blue-600/90 text-white backdrop-blur-sm px-2 py-1 rounded text-xs font-medium uppercase">
                                        {course.courseType.replace('InduccionCorta', 'SSOMA')}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 mt-auto">
                                        <UserCircle size={16} />
                                        <span>SSOMA</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                                        <span>Virtual</span>
                                        <span className="font-medium bg-gray-100 px-2 py-1 rounded">{course.timeLimitHours || 2} Hrs</span>
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
