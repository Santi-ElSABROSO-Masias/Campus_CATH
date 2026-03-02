import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<div className="p-8 text-xl font-bold text-gray-700">Área Personal en Construcción...</div>} />
          <Route path="my-courses" element={<div className="p-8 text-xl font-bold text-gray-700">Mis Cursos en Construcción...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
