import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, UserCircle, Settings, Menu, LogOut, Check, X, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

export const MainLayout = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    // Dropdowns state
    const [showNotif, setShowNotif] = useState(false);
    const [showMsg, setShowMsg] = useState(false);

    // Send Message Modal State
    const [showSendModal, setShowSendModal] = useState(false);
    const [receiverDni, setReceiverDni] = useState('');
    const [textContent, setTextContent] = useState('');
    const [sendSuccess, setSendSuccess] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('campus_session_token');
        const userStr = localStorage.getItem('campus_user');
        if (token && userStr) {
            const userStrParsed = JSON.parse(userStr);
            setUser(userStrParsed);
            fetchNotifications(token);
            fetchMessages(token);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchNotifications = async (token: string) => {
        try {
            const res = await fetch('http://localhost:3001/api/enrollments/my-progress', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                const pending = data.filter(enc => enc.computedProgress < 100);
                setNotifications(pending);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchMessages = async (token: string) => {
        try {
            const res = await fetch('http://localhost:3001/api/messages/my-messages', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('campus_session_token');
            // Nota: Para simplificar la demo localmente enviamos el id/DNI, el backend
            // en un caso real buscaría el ID real con el DNI, pero por ahora en la tabla
            // Prisma "receiverId" pide obligatoriamente el UUID. 
            // Vamos a apuntar provisionalmente a mandar la alerta. 
            // (Requerirá que ajustemos el backend para buscar UUID x DNI, o listar usuarios)
        } catch (e) { }
    };

    const handleMarkAsRead = async (msgId: string) => {
        try {
            const token = localStorage.getItem('campus_session_token');
            await fetch(`http://localhost:3001/api/messages/${msgId}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (token) fetchMessages(token);
        } catch (e) { }
    };

    const handleLogout = () => {
        localStorage.removeItem('campus_session_token');
        localStorage.removeItem('campus_user');
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
                            <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center shadow-sm">
                                <img src="/assets/logo ch.png" alt="Logo CH" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00A064] to-[#145A52]">
                                Inducciones Cathalina
                            </span>
                        </div>

                        {/* Nav Principal */}
                        <nav className="hidden lg:flex items-center gap-1 ml-6">
                            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#00A064] transition-colors">
                                Página Principal
                            </Link>
                            <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#00A064] transition-colors">
                                Área Personal
                            </Link>
                            <Link to="/my-courses" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#00A064] transition-colors">
                                Mis Cursos
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowNotif(!showNotif); setShowMsg(false); }}
                                className="text-gray-500 hover:text-gray-700 relative p-1"
                            >
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                            {showNotif && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-700">Notificaciones</div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">No hay notificaciones.</div>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
                                                    <p className="text-sm font-medium text-gray-800">Inducción Pendiente</p>
                                                    <p className="text-xs text-gray-500 mt-1">Recuerda completar: <strong>{n.course?.title}</strong> ({Math.round(n.computedProgress)}%)</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowMsg(!showMsg); setShowNotif(false); }}
                                className="text-gray-500 hover:text-gray-700 relative p-1 hidden sm:block"
                            >
                                <MessageSquare size={20} />
                                {messages.filter(m => !m.isRead).length > 0 && (
                                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF9132] border-2 border-white rounded-full"></span>
                                )}
                            </button>
                            {showMsg && (
                                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-700 flex justify-between items-center">
                                        <span>Buzón de Mensajes</span>
                                        {user && ['AdminEmpresa', 'SuperAdmin', 'Instructor'].includes(user.role) && (
                                            <button onClick={() => { setShowSendModal(true); setShowMsg(false); }} className="text-xs bg-[#00A064] text-white px-2 py-1 rounded hover:bg-[#145A52]">
                                                Nuevo
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {messages.length === 0 ? (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">No hay mensajes nuevos.</div>
                                        ) : (
                                            messages.map(m => (
                                                <div key={m.id} className={`px-4 py-3 border-b border-gray-50 ${m.isRead ? 'opacity-60' : 'bg-green-50/50'}`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-semibold text-[#145A52]">
                                                            {m.sender?.name} {m.sender?.lastName}
                                                        </span>
                                                        {!m.isRead && (
                                                            <button onClick={() => handleMarkAsRead(m.id)} className="text-[10px] text-gray-500 hover:text-blue-500 flex items-center gap-1">
                                                                <Check size={12} /> Marcar leído
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-700">{m.content}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-2 p-1.5 rounded-full transition-colors">
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                {user ? `${user.name} ${user.lastName}` : 'Cargando...'}
                            </span>
                            <UserCircle size={28} className="text-gray-400" />
                        </div>

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

            {/* Send Modal for Admins */}
            {showSendModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Enviar Mensaje a Trabajador</h3>
                            <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {sendSuccess && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{sendSuccess}</div>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">DNI del Destinatario (o UUID temporalmente)</label>
                                <input
                                    type="text"
                                    placeholder="UUID exacto del usuario por ahora"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A064] focus:border-[#00A064] outline-none"
                                    value={receiverDni}
                                    onChange={(e) => setReceiverDni(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje o Recordatorio</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A064] focus:border-[#00A064] outline-none min-h-[100px]"
                                    placeholder="Escribe tu mensaje aquí..."
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem('campus_session_token');
                                        await fetch('http://localhost:3001/api/messages', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                            body: JSON.stringify({ receiverId: receiverDni, content: textContent })
                                        });
                                        setSendSuccess('Mensaje enviado con éxito');
                                        setTimeout(() => { setShowSendModal(false); setSendSuccess(''); }, 2000);
                                    } catch (e) { }
                                }}
                                className="w-full bg-[#00A064] hover:bg-[#145A52] text-white py-2 rounded-lg font-medium flex justify-center items-center gap-2"
                            >
                                <Send size={18} /> Enviar Mensaje
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Inducciones Cathalina.
                    </p>
                    <div className="flex gap-4 mt-4 md:mt-0 text-gray-400">
                        <button className="hover:text-[#00A064]"><Settings size={18} /></button>
                    </div>
                </div>
            </footer>
        </div>
    );
};
