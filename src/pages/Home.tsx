export const Home = () => {
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
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-40 bg-gray-200 relative overflow-hidden">
                                {/* Fallback pattern bg */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1d4ed8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700">Orica</div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                    Inducción a la Seguridad y Gestión de Riesgos {(2026 - i)}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <UserCircle size={16} />
                                    <span>Instructor Asignado</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                                    <span>Principiante</span>
                                    <span className="font-medium bg-gray-100 px-2 py-1 rounded">84 Enrolled</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

import { UserCircle } from 'lucide-react';
