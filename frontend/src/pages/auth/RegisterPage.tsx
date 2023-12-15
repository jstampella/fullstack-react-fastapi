import { Link as LinkRouter } from 'react-router-dom';
import { Alert, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { useMemo, useState } from 'react';
import { useAppSelector, useAuthStore } from '../../hooks';
import { AuthLayout } from '../../layout/AuthLayout';

const formdata = {
  email: '',
  password: '',
  name: '',
};

interface useFormState {
  [key: string]: string;
  email: string;
  name: string;
  password: string;
}

const stiloInput = {
  color: 'primary.main',
  '& label': {
    color: 'primary.light', // Color del label siempre
  },
  input: {
    color: 'primary.main', // Color del label cuando está en foco
  },
};

export const RegisterPage = () => {
  const { startRegister } = useAuthStore();
  const { status, errorMessage } = useAppSelector((state) => state.auth);
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    name,
    email,
    password,
    nameValid,
    emailValid,
    passwordValid,
    isFormValid,
    onInputChange,
    formState,
  } = useForm<useFormState>(formdata);

  const onSubmit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    startRegister(formState);
  };

  return (
    <AuthLayout title='Crear cuenta'>
      <form className='animate__animated animate__fadeIn animate__faster' onSubmit={onSubmit}>
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              sx={stiloInput}
              label='Nombre usuario'
              type='text'
              placeholder='Nombre usuario'
              fullWidth
              name='name'
              value={name}
              onChange={onInputChange}
              error={!!nameValid && formSubmitted}
              helperText={nameValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              sx={stiloInput}
              label='Correo'
              type='email'
              placeholder='correo@google.com'
              fullWidth
              name='email'
              value={email}
              onChange={onInputChange}
              error={!!emailValid && formSubmitted}
              helperText={emailValid}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              sx={{ ...stiloInput, mt: 2 }}
              label='Contraseña'
              type='password'
              placeholder='Contraseña'
              fullWidth
              name='password'
              value={password}
              onChange={onInputChange}
              error={!!passwordValid && formSubmitted}
              helperText={passwordValid}
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
                disabled={isCheckingAuthentication}
                type='submit'
                variant='contained'
                fullWidth
              >
                Crear cuenta
              </Button>
            </Grid>
          </Grid>
          <Grid container direction='row' justifyContent={'end'}>
            <Typography sx={{ mr: 1 }}>Ya tienes una cuenta?</Typography>
            <Link component={LinkRouter} color={'inherit'} to='/login'>
              Ingresar
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};
