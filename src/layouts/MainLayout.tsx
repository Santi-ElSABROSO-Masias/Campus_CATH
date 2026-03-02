import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, UserCircle, Settings, Menu, LogOut } from 'lucide-react';

export const MainLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('campus_session');
        navigate('/login');
    };
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Corporativo Moodle-like */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button className="p-2 -ml-2 text-gray-500 hover:text-gray-700 lg:hidden">
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                                C
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                                Campus_CATH
                            </span>
                        </div>

                        {/* Nav Principal */}
                        <nav className="hidden lg:flex items-center gap-1 ml-6">
                            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                                Página Principal
                            </Link>
                            <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                                Área Personal
                            </Link>
                            <Link to="/my-courses" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                                Mis Cursos
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-gray-700 relative p-1">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 relative p-1 hidden sm:block">
                            <MessageSquare size={20} />
                        </button>
                        <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                        <button className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">J. Vera</span>
                            <UserCircle size={28} className="text-gray-400" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 transition-colors ml-2"
                            title="Cerrar sesión"
                        >
                            <LogOut size={20} className="text-red-500" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer minimalista */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Campus_CATH (e-Learning Soluciones).
                    </p>
                    <div className="flex gap-4 mt-4 md:mt-0 text-gray-400">
                        <button className="hover:text-blue-600"><Settings size={18} /></button>
                    </div>
                </div>
            </footer>
        </div>
    );
};
