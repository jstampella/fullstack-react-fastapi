import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserPayload } from '../../interfaces/auth.interfaces';

export enum statusAuth {
  checking = 'checking',
  noauthentication = 'no-authentication',
  authentication = 'authentication',
}

export interface IInitialState {
  status: statusAuth;
  user: IUserPayload | null;
  errorMessage: string | null;
}

const initialState: IInitialState = {
  status: statusAuth.checking,
  user: null,
  errorMessage: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    onLogin: (state, { payload }: PayloadAction<IUserPayload>) => {
      state.status = statusAuth.authentication;
      state.user = payload;
      state.errorMessage = null;
    },
    onLogout: (state, { payload }: PayloadAction<string | undefined>) => {
      state.status = statusAuth.noauthentication;
      state.user = null;
      if (payload) state.errorMessage = payload;
    },
    onCheckingCredentials: (state) => {
      state.status = statusAuth.checking;
      state.user = null;
      state.errorMessage = null;
    },
    onClearErrorMessage: (state) => {
      state.errorMessage = null;
    },
  },
});

export const { onLogin, onLogout, onCheckingCredentials, onClearErrorMessage } = authSlice.actions;
