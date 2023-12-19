import { useEffect, useState } from 'react';
import queryString from 'query-string';
import CustomizedTables, { IHeaders } from '../../components/CustomizedTable';
import { AiFillDelete, AiFillEdit, AiOutlineReload } from 'react-icons/ai';
import { Box, IconButton, TablePagination } from '@mui/material';
import { SimpleDialogResult } from '../../components/DialogResult';
import { useDispatch } from 'react-redux';
import { useNotebookStore, useNotify } from '../../hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchNotebook, formInit } from '../../components/SearchNotebook';
import { convertToPrice, convertirSearchNotebook } from '../../utils/common';
import { INotebook, INotebookPagination } from '../../interfaces';
import { onChangeStatus, statusNotebook, onSelect } from '../../store/notebook';

export const NotebooksPage = (): JSX.Element => {
  const [clientParams, setClientParams] = useState(formInit);
  const { getNotebooks, listNotebooks, status, getSearchNotebook, deleteNotebook } =
    useNotebookStore();
  const dispatch = useDispatch();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const location = useLocation();
  const [listado, setlistado] = useState<INotebookPagination>({
    total: 1,
    limit: 5,
    page: 0,
    data: [],
    isLoading: false,
  });
  const [messageDelete, setmessageDelete] = useState('');
  const [openDelete, setopenDelete] = useState<boolean>(false);

  const cargarLista = async (payload: { page?: number; limit?: number }) => {
    const list = await getNotebooks(payload);
    setlistado((old) => ({ ...old, isLoading: false, ...list }));
  };

  useEffect(() => {
    setlistado((old) => ({ ...old, isLoading: true }));
    if (listNotebooks.data.length === 0) cargarLista({});
    else setlistado((old) => ({ ...old, isLoading: false, ...listNotebooks }));
    dispatch(onChangeStatus(statusNotebook.list));
  }, []);

  useEffect(() => {
    if (status === statusNotebook.search) {
      setlistado((old) => ({ ...old, isLoading: false, ...listNotebooks }));
      if (listNotebooks.data.length === 0) notify('No se encontraron resultados.', 'warning');
    }
    if (status === statusNotebook.clear) {
      cargarLista({});
    }
    if (status === statusNotebook.checking) setlistado((old) => ({ ...old, isLoading: true }));
    if (status === statusNotebook.ok)
      setlistado((old) => ({ ...old, isLoading: false, ...listNotebooks }));
  }, [status]);

  useEffect(() => {
    if (
      Number(listado.page) !== Number(listNotebooks.page) ||
      Number(listado.limit) !== Number(listNotebooks.limit)
    ) {
      setlistado((old) => ({ ...old, isLoading: true }));
      cargarLista({ page: listado.page, limit: listado.limit });
    }
  }, [listado.page, listado.limit]);

  useEffect(() => {
    if (location.search !== '' && location.search) {
      getSearchNotebook(location.search);
      const params = queryString.parse(location.search);
      setClientParams(convertirSearchNotebook(params));
    } else if (status !== statusNotebook.list) {
      setClientParams(formInit);
      cargarLista({});
    }
  }, [location]);

  const deleteDialog = async (row: INotebook) => {
    dispatch(onSelect(row));
    setmessageDelete(`Deseas eliminar la notebook ${row.marca} ${row.modelo}`);
    setopenDelete(true);
  };

  const editDialog = async (row: INotebook) => {
    dispatch(onSelect(row));
    dispatch(onChangeStatus(statusNotebook.edit));
    navigate(`/add-notebook/${row.id}`);
  };

  const confirmDeleteUser = (value: boolean): void => {
    if (value) {
      deleteNotebook().then(() => {
        notify('Notebook eliminado correctamente', 'success');
        dispatch(onChangeStatus(statusNotebook.ok));
      });
    } else {
      dispatch(onSelect(null));
    }
    setopenDelete(false);
  };

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const limit = Number(event.target.value);
    setlistado((old) => ({ ...old, limit }));
  };

  const onPageChange = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => {
    setlistado((old) => ({ ...old, page }));
  };

  interface IExtendINotebook extends INotebook {
    edit?: string;
    delete?: string;
  }
  const headers: IHeaders<IExtendINotebook, (row: INotebook) => void>[]  = [
    { id: 'position', display: '#' },
    { id: 'marca', display:'Marca'},
    { id: 'modelo', display:'Modelo'},
    { id: 'memoria', display:'Memoria'},
    { id: 'placa_video', display:'P. de Video'},
    { id: 'precio', display:'Precio', custom:(e)=>convertToPrice(Number(e))},
    { id: 'edit', display: <AiFillEdit />, action: editDialog },
    { id: 'delete', display: <AiFillDelete />, action: deleteDialog },
  ];

  return (
    <>
      <Box
        aria-label='contenedor-principal'
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 2,
          justifyContent: 'center',
          alignItems: 'flex-start',
          alignContent: 'flex-start',
        }}
      >
        <SearchNotebook clientParams={clientParams} />
        <CustomizedTables
          isLoading={listado.isLoading}
          sx={{ maxHeight: '440px' }}
          headers={headers}
          rows={listado.data}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={Number(listado.total)}
          rowsPerPage={Number(listado.limit)}
          page={Number(listado.page)}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
        <SimpleDialogResult
          open={openDelete}
          message={messageDelete}
          title={'Eliminar Notebook'}
          onClose={confirmDeleteUser}
        />
        <IconButton
          color='inherit'
          sx={{ ':hover': { color: 'background.paper' }, marginTop: '5px' }}
          onClick={() => dispatch(onChangeStatus(statusNotebook.clear))}
        >
          <AiOutlineReload />
        </IconButton>
      </Box>
    </>
  );
};
