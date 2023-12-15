import { Navigate, Route, Routes } from 'react-router-dom';
import { ClientsPage } from '../pages/client/ClientsPage';
import { ClientFormPage } from '../pages/client/ClientFormPage';
import { LoginPage, RegisterPage } from '../pages/auth';
import { HomePage } from '../pages/HomePage';

export const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/clients' element={<ClientsPage />} />
      <Route path='/add-client' element={<ClientFormPage />} />
      <Route path='/add-client/:id' element={<ClientFormPage />} />
      <Route path='/profile' element={<h1>Profile</h1>} />
      <Route path='/*' element={<Navigate to='/' />} />
    </Routes>
  );
};

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  );
};
