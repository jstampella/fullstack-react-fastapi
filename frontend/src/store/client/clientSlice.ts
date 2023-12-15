import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IClient, IClientPagination } from '../../interfaces/client.interfaces';

export enum statusClient {
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
  status: statusClient;
  listClients: IClientPagination;
  client: IClient | null;
  errorMessage: string | null;
  records: IClient[] | null;
}

const initialState: IInitialState = {
  status: statusClient.checking,
  listClients: { data: [], page: 0, limit: 5, total: 0 },
  client: null,
  errorMessage: null,
  records: null,
};

export const clientSlice = createSlice({
  name: 'client',
  initialState: initialState,
  reducers: {
    onList: (state, { payload }: PayloadAction<IClientPagination>) => {
      state.errorMessage = null;
      state.listClients = payload;
      state.status = statusClient.list;
    },
    onUpdate: (state, { payload }: PayloadAction<IClient>) => {
      state.errorMessage = null;
      state.listClients.data = state.listClients.data.map((item) =>
        item.dni === payload.dni ? payload : item
      );
      state.status = statusClient.saved;
    },
    onCreate: (state, { payload }: PayloadAction<IClient>) => {
      state.errorMessage = null;
      state.status = statusClient.saved;
      state.listClients.data.push(payload);
    },
    onRecords: (state, { payload }: PayloadAction<IClient[]>) => {
      state.errorMessage = null;
      state.status = statusClient.completed;
      state.records = payload;
    },
    onDelete: (state) => {
      state.errorMessage = null;
      state.listClients.data = state.listClients.data.filter(
        (item) => item.dni !== state.client?.dni
      );
      state.client = null;
      state.status = statusClient.deleted;
      state.listClients.total -= 1;
    },
    onSearch: (state, { payload }: PayloadAction<IClientPagination>) => {
      state.errorMessage = null;
      state.listClients = payload;
      state.status = statusClient.search;
    },
    onSelect: (state, { payload }: PayloadAction<IClient | null>) => {
      state.errorMessage = null;
      state.client = payload;
    },
    onSetError: (state, { payload }: PayloadAction<string>) => {
      state.status = statusClient.error;
      state.errorMessage = payload;
    },
    onChangeStatus: (state, { payload }: PayloadAction<statusClient | undefined>) => {
      state.status = payload || statusClient.checking;
      state.errorMessage = null;
    },
    onClearErrorMessage: (state) => {
      state.errorMessage = null;
      state.status = statusClient.ok;
    },
    onChangePage: (state, { payload }: PayloadAction<{ page?: number; limit?: number }>) => {
      state.errorMessage = null;
      state.listClients = { ...state.listClients, ...payload };
      state.status = statusClient.ok;
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
} = clientSlice.actions;
