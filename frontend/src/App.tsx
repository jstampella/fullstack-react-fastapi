import './App.css';
import { useAuthStore } from './hooks';
import { statusAuth } from './store/auth';
import { AuthRoutes, AuthenticatedRoutes } from './routes/routes';
import LayoutApp from './layout/LayoutApp';
import { useEffect } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

function App() {
  const { status, checkAuthToken } = useAuthStore();
  useEffect(() => {
    checkAuthToken();
  }, []);

  return (
    <>
      {status === statusAuth.noauthentication && <AuthRoutes />}
      {status === statusAuth.authentication && (
        <LayoutApp>
          <AuthenticatedRoutes />
        </LayoutApp>
      )}
      {status === statusAuth.checking && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color='inherit' />
        </Backdrop>
      )}
    </>
  );
}

export default App;
