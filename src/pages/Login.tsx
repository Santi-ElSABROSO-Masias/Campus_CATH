import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const cleanUsername = username.trim();
            const cleanPassword = password.trim();

            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: cleanUsername, password: cleanPassword })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar token y datos del usuario reales devueltos por NestJS
                localStorage.setItem('campus_session_token', data.access_token);
                localStorage.setItem('campus_user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setError(data.message || 'Credenciales inválidas. Revise los datos.');
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError(`Error de red: ${err.message || 'No se pudo conectar al servidor.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

                <div className="bg-blue-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl mx-auto shadow-md mb-4">
                        C
                    </div>
                    <h2 className="text-2xl font-bold text-white">Campus_CATH</h2>
                    <p className="text-blue-100 mt-2 text-sm">Plataforma e-Learning Soluciones</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de usuario</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ej: temp_12345678"
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ingrese su contraseña temporal"
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Conectando...' : 'Acceder al Campus'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500">¿Olvidó su contraseña? <br />Contacte a Seguridad / SSOMA</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
