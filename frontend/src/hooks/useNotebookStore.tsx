import { useDispatch } from 'react-redux';
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
  statusNotebook,
} from '../store/notebook';
import { INotebook, INotebookCreate, INotebookPagination } from '../interfaces';
import {
  createNotebookApi,
  deleteNotebookApi,
  getAllNotebooksApi,
  getNotebookByIdApi,
  getNotebookByUserApi,
  getNotebookSearchApi,
  updateNotebookApi,
} from '../api/notebook.api';

export const useNotebookStore = () => {
  const { status, errorMessage, notebook, listNotebooks } = useAppSelector(
    (state) => state.notebook
  );
  const dispatch = useDispatch();

  const getNotebooks = async ({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<INotebookPagination | undefined> => {
    dispatch(onChangeStatus(statusNotebook.checking));
    try {
      const pag = page ?? listNotebooks.page;
      const lim = limit || listNotebooks.limit;
      const list = await getAllNotebooksApi(pag, lim);
      list.data.forEach((element, index) => {
        const sum = list.page * list.limit;
        element.position = index + 1 + sum;
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

  const deleteNotebook = async () => {
    dispatch(onChangeStatus());
    try {
      const { id } = notebook ?? {};
      if (!id) throw new Error('Hubo un problema para obtener el id del notebooke');
      await deleteNotebookApi(id);
      dispatch(onDelete());
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  const createNotebook = async (notebook: INotebookCreate) => {
    dispatch(onChangeStatus(statusNotebook.saving));
    try {
      const res = await createNotebookApi(notebook);
      dispatch(onCreate(res));
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };
  const updatenotebook = async (upNotebook: INotebookCreate) => {
    dispatch(onChangeStatus(statusNotebook.saving));
    const { id } = notebook ?? {};
    if (!id) throw new Error('Hubo un problema para obtener el id del notebook');
    try {
      const res = await updateNotebookApi(id, upNotebook);
      dispatch(onUpdate(res));
    } catch (error) {
      dispatch(onSetError((error as Error).message));
      setTimeout(() => {
        dispatch(onClearErrorMessage());
      }, 4000);
    }
  };

  const getNotebook = async (id: number) => {
    dispatch(onChangeStatus(statusNotebook.checking));
    try {
      const res = await getNotebookByIdApi(id);
      dispatch(onSelect(res));
      dispatch(onChangeStatus(statusNotebook.edit));
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

  const getSearchNotebook = async (search: string) => {
    dispatch(onChangeStatus(statusNotebook.checking));
    try {
      const list = await getNotebookSearchApi(search);
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

  const getNotebookByUser = async (): Promise<INotebook[] | undefined> => {
    dispatch(onChangeStatus(statusNotebook.checking));
    try {
      const list = await getNotebookByUserApi();
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
    listNotebooks,
    notebook,
    // metodos
    getNotebooks,
    deleteNotebook,
    createNotebook,
    getNotebook,
    updatenotebook,
    changePage,
    getSearchNotebook,
    getNotebookByUser,
  };
};
