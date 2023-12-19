import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDisk } from '../../interfaces';

export enum statusDisk {
  checking = 'checking',
  completed = 'completed',
  saving = 'saving',
  saved = 'saved',
  ok = 'ok',
  error = 'error',
  deleted = 'deleted',
  edit = 'edit',
  list = 'list',
  search = 'seach',
  clear = 'clear',
}

export interface IInitialState {
  status: statusDisk;
  listDisks: IDisk[];
  disk: IDisk | null;
  errorMessage: string | null;
}

const initialState: IInitialState = {
  status: statusDisk.checking,
  listDisks: [],
  disk: null,
  errorMessage: null,
};

export const diskSlice = createSlice({
  name: 'disk',
  initialState: initialState,
  reducers: {
    onList: (state, { payload }: PayloadAction<IDisk[]>) => {
      state.errorMessage = null;
      state.listDisks = payload;
      state.status = statusDisk.list;
    },
    onSetError: (state, { payload }: PayloadAction<string>) => {
      state.status = statusDisk.error;
      state.errorMessage = payload;
    },
    onChangeStatus: (state, { payload }: PayloadAction<statusDisk | undefined>) => {
      state.status = payload || statusDisk.checking;
      state.errorMessage = null;
    },
    onClearErrorMessage: (state) => {
      state.errorMessage = null;
      state.status = statusDisk.ok;
    },
  },
});

export const {
  onList,
  onSetError,
  onClearErrorMessage,
  onChangeStatus,
} = diskSlice.actions;
