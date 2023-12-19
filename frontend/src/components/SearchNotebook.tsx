/* eslint-disable camelcase */
import {
  Alert,
  Button,
  Grid,
  TextField,
  Box,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import { useForm, useNotebookStore } from '../hooks';
import { formValidationsSearch } from '../helpers/validator.client';
import { useEffect, useMemo, useState } from 'react';
import { AiFillDelete, AiOutlineLoading } from 'react-icons/ai';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { compartirObjetos, objectToUrlParams } from '../utils/common';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { INotebookCreate } from '../interfaces';
import { onChangeStatus, statusNotebook } from '../store/notebook';
import NotebookExample from "../assets/Notebook-example.png";

export const formInit: INotebookCreate = {
  disco_rigido_id: 1,
  marca: '',
  memoria: '',
  modelo: '',
  placa_video: '',
  precio: 0,
  urlImage: NotebookExample
};

const stiloInput = {
  color: 'background.paper',
  '& label': {
    color: 'background.paper', // Color del label siempre
    '&.Mui-focused': {
      color: 'primary.light',
    },
  },
  input: {
    color: 'background.paper', // Color del label cuando está en foco
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'background.paper',
    },
    '&:hover fieldset': {
      borderColor: 'primary.main', // Cambiar color del borde cuando se hace hover
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.light', // Cambiar color del borde cuando se hace foco
    },
  },
};

interface Props {
  clientParams?: INotebookCreate;
}

export const SearchNotebook = ({ clientParams }: Props) => {
  const { status, errorMessage } = useNotebookStore();
  const [isEmpty, setisEmpty] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    marca,
    modelo,
    placa_video,
    marcaValid,
    modeloValid,
    placa_videoValid,
    isFormValid,
    onInputChange,
    formState,
    isModified,
    onResetForm,
  } = useForm<INotebookCreate>(clientParams || formInit, formValidationsSearch); // falta el formValidation
  const isSearching = useMemo(() => status === statusNotebook.saving, [status]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (marca !== '' || modelo !== '' || placa_video !== '') {
      setisEmpty(false);
    } else {
      setisEmpty(true);
    }
  }, [marca, modelo, placa_video]);
  

  useEffect(() => {
    if (compartirObjetos<INotebookCreate>(clientParams as INotebookCreate, formInit))
      setExpanded(false);
    else setExpanded(true);
  }, [clientParams]);

  const onSubmit = async (event: React.FormEvent<EventTarget>): Promise<void> => {
    event.preventDefault();
    setFormSubmitted(true);
    const formSearch: Partial<INotebookCreate> = {
      disco_rigido_id: formState.disco_rigido_id || undefined,
      marca: formState.marca || undefined,
      memoria: formState.memoria || undefined,
      modelo: formState.modelo || undefined,
      placa_video: formState.placa_video || undefined,
      precio: 0,
      limit: 5,
      page: 0,
    };
    if (!isFormValid) return;
    const urlParams = objectToUrlParams(formSearch);
    navigate(`?${urlParams}`, { replace: false });
    setFormSubmitted(false);
  };

  const onDelete = () => {
    dispatch(onChangeStatus(statusNotebook.clear));
    onResetForm();
    navigate('/notebooks');
  };
  return (
    <Box
      sx={{
        position: 'relative',
        m: 2,
      }}
    >
      <Accordion
        expanded={expanded}
        sx={{ backgroundColor: 'background.default' }}
        onChange={handleChange}
      >
        <AccordionSummary
          sx={{ backgroundColor: 'background.paper', color: 'background.default' }}
          expandIcon={<BsFillArrowDownCircleFill color='white' />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>Busqueda</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={onSubmit}>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ m: 1, flex: 1, minWidth: '200px' }}>
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
              </Box>
              <Box sx={{ m: 1, flex: 1, minWidth: '200px' }}>
                <TextField
                  sx={stiloInput}
                  label='Modelo'
                  type='text'
                  placeholder='Marca Note'
                  fullWidth
                  name='modelo'
                  value={modelo}
                  onChange={onInputChange}
                  error={!!modeloValid && formSubmitted}
                  helperText={modeloValid}
                  FormHelperTextProps={{ sx: { color: 'red' } }}
                />
              </Box>
              <Box sx={{ m: 1, flex: 1, minWidth: '200px' }}>
                <TextField
                  sx={stiloInput}
                  label='Placa video'
                  type='text'
                  placeholder='Placa video'
                  fullWidth
                  name='placa_video'
                  value={placa_video}
                  onChange={onInputChange}
                  error={!!placa_videoValid && formSubmitted}
                  helperText={placa_videoValid}
                  FormHelperTextProps={{ sx: { color: 'red' } }}
                />
              </Box>
              <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                <Grid display={!!errorMessage ? '' : 'none'} item xs={12} sm={12}>
                  <Alert severity='error'>{errorMessage}</Alert>
                </Grid>
                <Grid display={!isFormValid ? '' : 'none'} item xs={12} sm={12}>
                  <Alert severity='error'>{'verifique el formulario'}</Alert>
                </Grid>
                <Grid item xs={12} sm={12} sx={{ display: 'flex' }}>
                  <IconButton color='primary' onClick={onDelete} aria-label='delete'>
                    <AiFillDelete />
                  </IconButton>
                  <Button
                    disabled={!isFormValid || !isModified || isSearching || isEmpty}
                    type='submit'
                    variant='contained'
                    fullWidth
                    sx={{
                      flex: 1,
                      '&.Mui-disabled': {
                        color: 'secondary.main',
                        backgroundColor: 'text.primary',
                      },
                    }}
                    endIcon={isSearching && <AiOutlineLoading className='spinner' />}
                  >
                    {isSearching ? 'Buscando' : 'Buscar'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
