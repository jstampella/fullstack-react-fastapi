import { useDispatch } from 'react-redux';
import {
  onCheckingCredentials,
  statusAuth,
  onClearErrorMessage,
  onLogin,
  onLogout,
} from '../store/auth';
import { useAppSelector } from './storeHook';
import { useMemo } from 'react';
import { payloadLogin, payloadRegister } from '../interfaces/auth.interfaces';
import { loginApi, registerApi, verifyTokenRequest } from '../api/auth.api';
import Cookies from 'js-cookie';

export const useAuthStore = () => {
  const { status, user, errorMessage } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async (user: payloadLogin) => {
    dispatch(onCheckingCredentials());
    try {
      const res = await loginApi(user);
      localStorage.setItem('token', res.token);
      dispatch(onLogin(res));
    } catch (error) {
      dispatch(onLogout((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  };

  const startRegister = async ({ name, email, password }: payloadRegister) => {
    dispatch(onCheckingCredentials());
    try {
      // Aca va la consulta a la api
      const result = await registerApi({ email, password, name });
      localStorage.setItem('token', result.token);
      dispatch(onLogin(result));
    } catch (error) {
      dispatch(onLogout((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  const checkAuthToken = async () => {
    const cookies = Cookies.get();
    const token = localStorage.getItem('token');
    if (!cookies.token && !token) {
      startLogout();
      return;
    }
    if (!cookies.token && token) Cookies.set('token', token);
    try {
      const res = await verifyTokenRequest();
      if (!res._id) return startLogout();
      dispatch(onLogin(res));
    } catch (error) {
      startLogout();
    }
  };

  const isAuthenticating = useMemo(() => status === statusAuth.checking, [status]);

  return {
    // propiedades
    status,
    user,
    errorMessage,
    isAuthenticating,
    // metodos
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout,
  };
};
