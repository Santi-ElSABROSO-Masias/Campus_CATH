import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { MyCourses } from './pages/MyCourses';
import { Login } from './pages/Login';

// Mock de validación sencilla
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // ✅ Después (clave del backend real)
  const isAuth = !!localStorage.getItem('campus_session_token');
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas aseguradas */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
