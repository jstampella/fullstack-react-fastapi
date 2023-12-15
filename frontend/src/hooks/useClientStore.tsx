import { useDispatch } from 'react-redux';
import { IClient, IClientCreate, IClientPagination } from '../interfaces/client.interfaces';
import { useAppSelector } from '.';
import {
  onChangePage,
  onChangeStatus,
  onClearErrorMessage,
  onCreate,
  onDelete,
  onList,
  onRecords,
  onSearch,
  onSelect,
  onSetError,
  onUpdate,
  statusClient,
} from '../store/client';
import {
  createClientApi,
  deleteClientApi,
  getAllClientsApi,
  getClientByIdApi,
  getClientByUserApi,
  getClientSearchApi,
  updateClientApi,
} from '../api/client.api';

export const useClientStore = () => {
  const { status, errorMessage, client, listClients } = useAppSelector((state) => state.client);
  const dispatch = useDispatch();

  const getClients = async ({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<IClientPagination | undefined> => {
    dispatch(onChangeStatus(statusClient.checking));
    try {
      const pag = page ?? listClients.page;
      const lim = limit || listClients.limit;
      const list = await getAllClientsApi(pag, lim);
      list.data.forEach((element, index) => {
        const sum = list.page * list.limit;
        element.id = index + 1 + sum;
      });
      dispatch(onList(list));
      return list;
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  const deleteClient = async () => {
    dispatch(onChangeStatus());
    try {
      const { _id } = client ?? {};
      if (!_id) throw new Error('Hubo un problema para obtener el id del cliente');
      await deleteClientApi(_id);
      dispatch(onDelete());
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  const createClient = async (client: IClientCreate) => {
    dispatch(onChangeStatus(statusClient.saving));
    try {
      const res = await createClientApi(client);
      dispatch(onCreate(res));
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };
  const updateclient = async (upClient: IClientCreate) => {
    dispatch(onChangeStatus(statusClient.saving));
    const { _id } = client ?? {};
    if (!_id) throw new Error('Hubo un problema para obtener el id del cliente');
    try {
      const res = await updateClientApi(_id, upClient);
      dispatch(onUpdate(res));
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  const getClient = async (id: string) => {
    dispatch(onChangeStatus(statusClient.checking));
    try {
      const res = await getClientByIdApi(id);
      dispatch(onSelect(res));
      dispatch(onChangeStatus(statusClient.edit));
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  const changePage = (payload: { page?: number; limit?: number }) => {
    dispatch(onChangePage(payload));
  };

  const getSearchClient = async (search: string) => {
    dispatch(onChangeStatus(statusClient.checking));
    try {
      const list = await getClientSearchApi(search);
      list.data.forEach((element, index) => {
        const sum = list.page * list.limit;
        element.id = index + 1 + sum;
      });
      dispatch(onSearch(list));
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  const getClientByUser = async (): Promise<IClient[] | undefined> => {
    dispatch(onChangeStatus(statusClient.checking));
    try {
      const list = await getClientByUserApi();
      dispatch(onRecords(list));
      return list;
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  return {
    // propiedades
    status,
    errorMessage,
    listClients,
    client,
    // metodos
    getClients,
    deleteClient,
    createClient,
    getClient,
    updateclient,
    changePage,
    getSearchClient,
    getClientByUser,
  };
};
