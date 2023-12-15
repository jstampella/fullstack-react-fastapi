import { useEffect, useState } from 'react';
import queryString from 'query-string';
import CustomizedTables, { IHeaders } from '../../components/CustomizedTable';
import { AiFillDelete, AiFillEdit, AiOutlineReload } from 'react-icons/ai';
import { IClient, IClientPagination } from '../../interfaces';
import { useClientStore } from '../../hooks/useClientStore';
import { Box, IconButton, TablePagination } from '@mui/material';
import { SimpleDialogResult } from '../../components/DialogResult';
import { useDispatch } from 'react-redux';
import { onChangeStatus, onSelect, statusClient } from '../../store/client';
import { useNotify } from '../../hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchClient } from '../../components/SearchClient';
import { convertirSearchCliente } from '../../utils/common';

const formInit = {
  dni: '',
  nombre: '',
  apellido: '',
  sexo: '',
};

export const ClientsPage = (): JSX.Element => {
  const [clientParams, setClientParams] = useState(formInit);
  const { getClients, deleteClient, listClients, status, getSearchClient } = useClientStore();
  const dispatch = useDispatch();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const location = useLocation();
  const [listado, setlistado] = useState<IClientPagination>({
    total: 1,
    limit: 5,
    page: 0,
    data: [],
    isLoading: false,
  });
  const [messageDelete, setmessageDelete] = useState('');
  const [openDelete, setopenDelete] = useState<boolean>(false);

  const cargarLista = async (payload: { page?: number; limit?: number }) => {
    const list = await getClients(payload);
    setlistado((old) => ({ ...old, isLoading: false, ...list }));
  };

  useEffect(() => {
    setlistado((old) => ({ ...old, isLoading: true }));
    if (listClients.data.length === 0) cargarLista({});
    else setlistado((old) => ({ ...old, isLoading: false, ...listClients }));
    dispatch(onChangeStatus(statusClient.list));
  }, []);

  useEffect(() => {
    if (status === statusClient.search) {
      setlistado((old) => ({ ...old, isLoading: false, ...listClients }));
      if (listClients.data.length === 0) notify('No se encontraron resultados.', 'warning');
    }
    if (status === statusClient.clear) {
      cargarLista({});
    }
    if (status === statusClient.checking) setlistado((old) => ({ ...old, isLoading: true }));
    if (status === statusClient.ok)
      setlistado((old) => ({ ...old, isLoading: false, ...listClients }));
  }, [status]);

  useEffect(() => {
    if (
      Number(listado.page) !== Number(listClients.page) ||
      Number(listado.limit) !== Number(listClients.limit)
    ) {
      setlistado((old) => ({ ...old, isLoading: true }));
      cargarLista({ page: listado.page, limit: listado.limit });
    }
  }, [listado.page, listado.limit]);

  useEffect(() => {
    if (location.search !== '' && location.search) {
      getSearchClient(location.search);
      const params = queryString.parse(location.search);
      setClientParams(convertirSearchCliente(params));
    } else if (status !== statusClient.list) {
      setClientParams(formInit);
      cargarLista({});
    }
  }, [location]);

  const deleteDialog = async (row: IClient) => {
    dispatch(onSelect(row));
    setmessageDelete(`Deseas eliminar al usuario ${row.nombre} ${row.apellido}`);
    setopenDelete(true);
  };

  const editDialog = async (row: IClient) => {
    dispatch(onSelect(row));
    dispatch(onChangeStatus(statusClient.edit));
    navigate(`/add-client/${row._id}`);
  };

  const confirmDeleteUser = (value: boolean): void => {
    if (value) {
      deleteClient().then(() => {
        notify('Cliente eliminado correctamente', 'success');
        dispatch(onChangeStatus(statusClient.ok));
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

  const headers: IHeaders<IClient>[] = [
    { id: 'id', display: '#' },
    { id: 'dni', display: 'DNI' },
    { id: 'nombre', display: 'Nombre' },
    { id: 'apellido', display: 'Apellido' },
    { id: 'sexo', display: 'Sexo' },
    { id: 'telefono', display: 'Telefono' },
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
        <SearchClient clientParams={clientParams} />
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
          title={'Eliminar Usuario'}
          onClose={confirmDeleteUser}
        />
        <IconButton
          color='inherit'
          sx={{ ':hover': { color: 'background.paper' }, marginTop: '5px' }}
          onClick={() => dispatch(onChangeStatus(statusClient.clear))}
        >
          <AiOutlineReload />
        </IconButton>
      </Box>
    </>
  );
};
