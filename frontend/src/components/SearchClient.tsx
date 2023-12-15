import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import { useForm } from '../hooks';
import { IClientFormSearch, IClientSearch } from '../interfaces';
import { formValidationsSearch } from '../helpers/validator.client';
import { useEffect, useMemo, useState } from 'react';
import { AiFillDelete, AiOutlineLoading } from 'react-icons/ai';
import { onChangeStatus, statusClient } from '../store/client';
import { useClientStore } from '../hooks/useClientStore';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { compartirObjetos, objectToUrlParams } from '../utils/common';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const formInit = {
  dni: '',
  nombre: '',
  apellido: '',
  sexo: '',
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
  clientParams?: IClientFormSearch;
}

export const SearchClient = ({ clientParams }: Props) => {
  const { status, errorMessage } = useClientStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    dni,
    nombre,
    apellido,
    sexo,
    dniValid,
    nombreValid,
    apellidoValid,
    sexoValid,
    isFormValid,
    onInputChange,
    formState,
    isSubmit,
    onResetForm,
  } = useForm<IClientFormSearch>(clientParams || formInit, formValidationsSearch); // falta el formValidation
  const isSearching = useMemo(() => status === statusClient.saving, [status]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (compartirObjetos<IClientFormSearch>(clientParams as IClientFormSearch, formInit))
      setExpanded(false);
    else setExpanded(true);
  }, [clientParams]);

  const onSubmit = async (event: React.FormEvent<EventTarget>): Promise<void> => {
    event.preventDefault();
    setFormSubmitted(true);
    const formSearch: IClientSearch = {
      apellido: formState.apellido || undefined,
      dni: formState.dni || undefined,
      nombre: formState.nombre || undefined,
      sexo: formState.sexo || undefined,
      limit: 5,
      page: 0,
    };
    if (!isFormValid) return;
    const urlParams = objectToUrlParams(formSearch);
    navigate(`?${urlParams}`, { replace: false });
    setFormSubmitted(false);
  };

  const onDelete = () => {
    dispatch(onChangeStatus(statusClient.clear));
    onResetForm();
    navigate('/clients');
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
              </Box>
              <Box sx={{ m: 1, minWidth: '100px' }}>
                <FormControl sx={{ ...stiloInput, minWidth: '100px' }} size='small'>
                  <InputLabel sx={{ marginTop: '6px' }} id='demo-select-small-label'>
                    Sexo
                  </InputLabel>
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
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'F'}>Femenino</MenuItem>
                    <MenuItem value={'M'}>Masculino</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: 'red' }}>{sexoValid}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ m: 1, minWidth: '80px', flex: 1 }}>
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
              </Box>
              <Box sx={{ m: 1, minWidth: '100px', flex: 1 }}>
                <TextField
                  sx={{ ...stiloInput }}
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
                    disabled={!isFormValid || !isSubmit || isSearching}
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
