import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotebook, INotebookPagination } from '../../interfaces';

export enum statusNotebook {
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
  status: statusNotebook;
  listNotebooks: INotebookPagination;
  notebook: INotebook | null;
  errorMessage: string | null;
  records: INotebook[] | null;
}

const initialState: IInitialState = {
  status: statusNotebook.checking,
  listNotebooks: { data: [], page: 0, limit: 5, total: 0 },
  notebook: null,
  errorMessage: null,
  records: null,
};

export const notebookSlice = createSlice({
  name: 'notebook',
  initialState: initialState,
  reducers: {
    onList: (state, { payload }: PayloadAction<INotebookPagination>) => {
      state.errorMessage = null;
      state.listNotebooks = payload;
      state.status = statusNotebook.list;
    },
    onUpdate: (state, { payload }: PayloadAction<INotebook>) => {
      state.errorMessage = null;
      state.listNotebooks.data = state.listNotebooks.data.map((item: INotebook) =>
        item.id === payload.id ? payload : item
      );
      state.records = state.records && state.records.map((item: INotebook) =>
        item.id === payload.id ? payload : item
      );
      state.notebook = payload;
      state.status = statusNotebook.saved;
    },
    onCreate: (state, { payload }: PayloadAction<INotebook>) => {
      state.errorMessage = null;
      state.status = statusNotebook.saved;
      state.listNotebooks.data.push(payload);
    },
    onRecords: (state, { payload }: PayloadAction<INotebook[]>) => {
      state.errorMessage = null;
      state.status = statusNotebook.completed;
      state.records = payload;
    },
    onDelete: (state) => {
      state.errorMessage = null;
      state.listNotebooks.data = state.listNotebooks.data.filter(
        (item: INotebook) => item.id !== state.notebook?.id
      );
      state.notebook = null;
      state.status = statusNotebook.deleted;
      state.listNotebooks.total -= 1;
    },
    onSearch: (state, { payload }: PayloadAction<INotebookPagination>) => {
      state.errorMessage = null;
      state.listNotebooks = payload;
      state.status = statusNotebook.search;
    },
    onSelect: (state, { payload }: PayloadAction<INotebook | null>) => {
      state.errorMessage = null;
      state.notebook = payload;
    },
    onSetError: (state, { payload }: PayloadAction<string>) => {
      state.status = statusNotebook.error;
      state.errorMessage = payload;
    },
    onChangeStatus: (state, { payload }: PayloadAction<statusNotebook | undefined>) => {
      state.status = payload || statusNotebook.checking;
      state.errorMessage = null;
    },
    onClearErrorMessage: (state) => {
      state.errorMessage = null;
      state.status = statusNotebook.ok;
    },
    onChangePage: (state, { payload }: PayloadAction<{ page?: number; limit?: number }>) => {
      state.errorMessage = null;
      state.listNotebooks = { ...state.listNotebooks, ...payload };
      state.status = statusNotebook.ok;
    },
  },
});

export const {
  onList,
  onUpdate,
  onCreate,
  onDelete,
  onSearch,
  onSelect,
  onSetError,
  onClearErrorMessage,
  onChangeStatus,
  onChangePage,
  onRecords,
} = notebookSlice.actions;
