import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importación de páginas
import Home from './pages/Home/Home';
import BookDetails from './pages/BookDetails/BookDetails';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

// Importación de componentes de layout
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './context/PrivateRoute';
import BookManager from './components/books/BookManager';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas con layout principal */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="books/:id" element={<BookDetails />} />
        <Route path="profile" element={<Profile />} />
          {/* Ruta de administración de libros (solo para administradores) */}
          <Route 
          path="books/manage" 
          element={
            <PrivateRoute roles={['Admin']}>
              <BookManager />
            </PrivateRoute>
          } 
        />
      </Route>
      
      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;