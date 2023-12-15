import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface AppState {
  appState: string;
  isRTL: boolean;
  theme: Theme;
  hasImage: boolean;
  broken: boolean;
}

const initialState: AppState = {
  appState: '',
  isRTL: false,
  theme: 'light',
  hasImage: false,
  broken: false,
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<string>) => {
      state.appState = action.payload;
    },
    setRtlState: (state, action: PayloadAction<boolean>) => {
      state.isRTL = Boolean(action.payload);
    },
    setThemeState: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setHasImageState: (state, action: PayloadAction<boolean>) => {
      state.hasImage = Boolean(action.payload);
    },
  },
});

export const { setAppState, setRtlState, setThemeState, setHasImageState } = appStateSlice.actions;
