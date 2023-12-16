import { Navigate, Route, Routes } from 'react-router-dom';
import { ClientFormPage } from '../pages/notebook/NotebookFormPage';
import { LoginPage, RegisterPage } from '../pages/auth';
import { HomePage } from '../pages/HomePage';
import { NotebooksPage } from '../pages/notebook/NotebooksPage';

export const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/notebooks' element={<NotebooksPage />} />
      <Route path='/add-notebook' element={<ClientFormPage />} />
      <Route path='/add-notebook/:id' element={<ClientFormPage />} />
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
