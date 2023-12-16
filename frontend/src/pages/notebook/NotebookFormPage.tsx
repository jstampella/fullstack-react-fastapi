/* eslint-disable camelcase */
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { useEffect, useMemo, useState } from 'react';
import { useNotebookStore, useNotify } from '../../hooks';
import { AiFillCloseCircle, AiOutlineLoading } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { formValidations } from '../../helpers/validator.client';
import { hexToRgba, removeUndefinedAndEmptyProperties } from '../../utils/common';
import { onChangeStatus, statusNotebook } from '../../store/notebook';
import { INotebook, INotebookCreate } from '../../interfaces';
import { formInit } from '../../components/SearchNotebook';

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
  const { createNotebook, updatenotebook, status, errorMessage, notebook, getNotebook } =
    useNotebookStore();
  const { notify } = useNotify();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setformData] = useState(formInit);
  const isCheckingAuthentication = useMemo(() => status === statusNotebook.saving, [status]);
  const edit = useMemo(() => status === statusNotebook.edit, [status]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    disco_rigido_id,
    marca,
    memoria,
    modelo,
    placa_video,
    precio,
    disco_rigido_idValid,
    marcaValid,
    memoriaValid,
    modeloValid,
    placa_videoValid,
    precioValid,
    isFormValid,
    onInputChange,
    formState,
    isSubmit,
    onResetForm,
  } = useForm<INotebookCreate>(formData, formValidations);

  const onSubmit = async (event: React.FormEvent<EventTarget>): Promise<void> => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    const validFormt = removeUndefinedAndEmptyProperties<INotebookCreate>(formState);
    if (edit) await updatenotebook(validFormt);
    else await createNotebook(validFormt);
    setFormSubmitted(false);
  };

  const formatNote = (note: INotebook) => {
    const editClient: INotebookCreate = {
      disco_rigido_id: note.disco_rigido_id || 1,
      marca: note.marca,
      memoria: note.memoria,
      modelo: note.modelo,
      placa_video: note.placa_video,
      precio: note.precio,
    };

    return editClient;
  };

  useEffect(() => {
    if (notebook) {
      const editClient = formatNote(notebook);
      setformData(editClient);
    }
  }, [notebook]);

  useEffect(() => {
    if (!edit) setformData(formInit);
  }, []);

  useEffect(() => {
    if (params.id && notebook?.id !== Number(params.id)) {
      getNotebook(Number(params.id));
    } else if (notebook && params.id) {
      const editNote = formatNote(notebook);
      setformData(editNote);
      dispatch(onChangeStatus(statusNotebook.edit));
    } else {
      setformData(formInit);
      dispatch(onChangeStatus(statusNotebook.ok));
    }
  }, [params]);

  useEffect(() => {
    if (status === statusNotebook.saved) {
      notify('Se guardo correctamente', 'success');
      dispatch(onChangeStatus(statusNotebook.ok));
      onResetForm();
      navigate('/clients');
    }
  }, [status]);

  const onClose = () => {
    setformData(formInit);
    dispatch(onChangeStatus(statusNotebook.ok));
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
        {edit ? 'Editar Notebook' : 'Nueva Notebook'}
      </Typography>
      <form onSubmit={onSubmit}>
        <Grid container sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={12} sm={7} sx={{ mt: 2 }}>
            <TextField
              sx={stiloInput}
              label='Marca'
              type='text'
              placeholder='Marca Note'
              fullWidth
              name='marca'
              value={marca}
              onChange={onInputChange}
              error={!!marcaValid && formSubmitted}
              helperText={marcaValid}
              FormHelperTextProps={{ sx: { color: 'red' } }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
            <TextField
              sx={stiloInput}
              label='Modelo'
              type='text'
              placeholder='modelo note'
              fullWidth
              name='modelo'
              value={modelo}
              onChange={onInputChange}
              error={!!modeloValid && formSubmitted}
              helperText={modeloValid}
              FormHelperTextProps={{ sx: { color: 'red' } }}
            />
          </Grid>
          <Grid container spacing={2} alignItems={'center'}>
          <Grid item xs={12} sm={4} sx={{ mt: !isFormValid && !disco_rigido_idValid ? 1: 4, minWidth: '130px', display: 'flex', flexDirection: 'column' }}>
            <FormControl sx={{ ...stiloInput, width: '100%' }} size='small'>
              <InputLabel id='demo-select-small-label'>Disco</InputLabel>
              <Select
                labelId='demo-select-small-label'
                id='demo-select-small'
                name='disco_rigido_id'
                value={disco_rigido_id}
                label='Disco'
                onChange={(event) => onInputChange({ target: event.target })}
                error={!!disco_rigido_idValid && formSubmitted}
                sx={{ height: '56px' }}
              >
                <MenuItem value={1}>SSD 120GB</MenuItem>
                <MenuItem value={2}>HHD 500GB</MenuItem>
              </Select>
              <FormHelperText sx={{ color: 'red' }}>{disco_rigido_idValid}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8} sx={{ mt: 2 }}>
            <TextField
              sx={{ ...stiloInput, mt: 2 }}
              label='Memoria'
              type='text'
              placeholder='16GB'
              fullWidth
              name='memoria'
              value={memoria}
              onChange={onInputChange}
              error={!!memoriaValid && formSubmitted}
              helperText={memoriaValid}
              InputProps={{
                style: {
                  marginBottom: '5px',
                },
              }}
              FormHelperTextProps={{ sx: { color: 'red' } }}
            />
          </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              sx={stiloInput}
              label='Placa Video'
              type='text'
              placeholder='placa de video'
              fullWidth
              name='placa_video'
              value={placa_video}
              onChange={onInputChange}
              error={!!placa_videoValid && formSubmitted}
              helperText={placa_videoValid}
              FormHelperTextProps={{ sx: { color: 'red' } }}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
            prefix='$'
              sx={{...stiloInput,'.MuiInputAdornment-root p':{color:'background.paper'}}}
              label='Precio'
              type='number'
              placeholder='precio'
              fullWidth
              
              name='precio'
              value={precio}
              onChange={onInputChange}
              error={!!precioValid && formSubmitted}
              helperText={precioValid}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                
              }}
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
                disabled={!isFormValid || !isSubmit || isCheckingAuthentication}
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
        open={status === statusNotebook.checking}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Box>
  );
};
