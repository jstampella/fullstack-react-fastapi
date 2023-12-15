import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { useEffect, useMemo, useState } from 'react';
import { useNotify } from '../../hooks';
import { useClientStore } from '../../hooks/useClientStore';
import { IClient, IClientCreate } from '../../interfaces';
import { onChangeStatus, statusClient } from '../../store/client';
import { AiFillCloseCircle, AiOutlineLoading } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { formValidations } from '../../helpers/validator.client';
import { hexToRgba, removeUndefinedAndEmptyProperties } from '../../utils/common';

const formInit = {
  dni: '',
  nombre: '',
  apellido: '',
  sexo: '',
  telefono: '',
};

const stiloInput = {
  color: 'primary.main',
  '& label': {
    color: 'primary.light', // Color del label siempre
  },
  input: {
    color: 'primary.main', // Color del label cuando está en foco
  },
};

export const ClientFormPage = (): JSX.Element => {
  const { createClient, updateclient, status, errorMessage, client, getClient } = useClientStore();
  const { notify } = useNotify();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setformData] = useState(formInit);
  const isCheckingAuthentication = useMemo(() => status === statusClient.saving, [status]);
  const edit = useMemo(() => status === statusClient.edit, [status]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    dni,
    nombre,
    apellido,
    sexo,
    telefono,
    dniValid,
    nombreValid,
    apellidoValid,
    sexoValid,
    telefonoValid,
    isFormValid,
    onInputChange,
    formState,
    isSubmit,
    onResetForm,
  } = useForm<IClientCreate>(formData, formValidations);

  const onSubmit = async (event: React.FormEvent<EventTarget>): Promise<void> => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    const validFormt = removeUndefinedAndEmptyProperties<IClientCreate>(formState);
    if (edit) await updateclient(validFormt);
    else await createClient(validFormt);
    setFormSubmitted(false);
  };

  const formatClient = (client: IClient) => {
    const editClient: IClientCreate = {
      dni: client.dni?.toString() || '',
      nombre: client.nombre,
      apellido: client.apellido,
      sexo: client.sexo,
      telefono: client.telefono?.toString() || '',
    };

    return editClient;
  };

  useEffect(() => {
    if (client) {
      const editClient = formatClient(client);
      setformData(editClient);
    }
  }, [client]);

  useEffect(() => {
    if (!edit) setformData(formInit);
  }, []);

  useEffect(() => {
    if (params.id && client?._id !== params.id) {
      getClient(params.id);
    } else if (client && params.id) {
      const editClient = formatClient(client);
      setformData(editClient);
      dispatch(onChangeStatus(statusClient.edit));
    } else {
      setformData(formInit);
      dispatch(onChangeStatus(statusClient.ok));
    }
  }, [params]);

  useEffect(() => {
    if (status === statusClient.saved) {
      notify('Se guardo correctamente', 'success');
      dispatch(onChangeStatus(statusClient.ok));
      onResetForm();
      navigate('/clients');
    }
  }, [status]);

  const onClose = () => {
    setformData(formInit);
    dispatch(onChangeStatus(statusClient.ok));
  };

  return (
    <Box sx={{ position: 'relative', m: 2 }}>
      {edit && (
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 0 }}
          color='primary'
          aria-label='close'
        >
          <AiFillCloseCircle />
        </IconButton>
      )}
      <Typography variant='h1' gutterBottom>
        {edit ? 'Editar Cliente' : 'Nuevo Cliente'}
      </Typography>
      <form onSubmit={onSubmit}>
        <Grid container sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={12} sm={7} sx={{ mt: 2 }}>
            <TextField
              sx={stiloInput}
              label='DNI'
              type='text'
              placeholder='Dni usuario'
              fullWidth
              name='dni'
              value={dni}
              onChange={onInputChange}
              error={!!dniValid && formSubmitted}
              helperText={dniValid}
              FormHelperTextProps={{ sx: { color: 'red' } }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: 2, minWidth: '130px' }}>
            <FormControl sx={{ ...stiloInput, width: '100%' }} size='small'>
              <InputLabel id='demo-select-small-label'>Sexo</InputLabel>
              <Select
                labelId='demo-select-small-label'
                id='demo-select-small'
                name='sexo'
                value={sexo}
                label='Sexo'
                onChange={(event) => onInputChange({ target: event.target })}
                error={!!sexoValid && formSubmitted}
                sx={{ height: '56px' }}
              >
                <MenuItem value={'F'}>Femenino</MenuItem>
                <MenuItem value={'M'}>Masculino</MenuItem>
              </Select>
              <FormHelperText sx={{ color: 'red' }}>{sexoValid}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              sx={stiloInput}
              label='Nombre'
              type='text'
              placeholder='juan carlos'
              fullWidth
              name='nombre'
              value={nombre}
              onChange={onInputChange}
              error={!!nombreValid && formSubmitted}
              helperText={nombreValid}
              FormHelperTextProps={{ sx: { color: 'red' } }}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              sx={{ ...stiloInput, mt: 2 }}
              label='Apellido'
              type='text'
              placeholder='Sanchez'
              fullWidth
              name='apellido'
              value={apellido}
              onChange={onInputChange}
              error={!!apellidoValid && formSubmitted}
              helperText={apellidoValid}
              FormHelperTextProps={{ sx: { color: 'red' } }}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              sx={stiloInput}
              label='Telefono'
              type='text'
              placeholder='5433355525'
              fullWidth
              name='telefono'
              value={telefono}
              onChange={onInputChange}
              error={!!telefonoValid && formSubmitted}
              helperText={telefonoValid}
              FormHelperTextProps={{ sx: { color: 'red' } }}
            />
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid display={!!errorMessage ? '' : 'none'} item xs={12} sm={12}>
              <Alert severity='error'>{errorMessage}</Alert>
            </Grid>
            <Grid display={!isFormValid ? '' : 'none'} item xs={12} sm={12}>
              <Alert severity='error'>{'verifique el formulario'}</Alert>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                disabled={!isSubmit || isCheckingAuthentication}
                type='submit'
                variant='contained'
                fullWidth
                endIcon={isCheckingAuthentication && <AiOutlineLoading className='spinner' />}
              >
                {isCheckingAuthentication ? 'Guardando' : edit ? 'Editar' : 'Crear'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Backdrop
        sx={{
          borderRadius: 5,
          color: 'primary.main',
          backgroundColor: (theme) => hexToRgba(theme.palette.secondary.main.toString(), 0.1),
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        open={status === statusClient.checking}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Box>
  );
};
