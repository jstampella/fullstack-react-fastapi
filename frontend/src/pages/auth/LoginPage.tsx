import { AuthLayout } from '../../layout/AuthLayout';
import { Alert, Button, Grid, TextField } from '@mui/material';
import { useAppSelector, useAuthStore, useForm } from '../../hooks';
import { Link as LinkRouter } from 'react-router-dom';
import Link from '@mui/material/Link';
// import Google from '@mui/icons-material/Google';

const formdata = {
  email: '',
  password: '',
};

interface useFormState {
  [key: string]: string;
  email: string;
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

export const LoginPage = () => {
  const { errorMessage } = useAppSelector((state) => state.auth);
  const { isAuthenticating, startLogin } = useAuthStore();

  const { email, password, onInputChange } = useForm<useFormState>(formdata);

  const onSubmit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    startLogin({ email: email, password: password });
  };

  return (
    <AuthLayout title='Login'>
      <form
        aria-label='submit-form'
        className='animate__animated animate__fadeIn animate__faster'
        onSubmit={onSubmit}
      >
        <Grid container>
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
            />
            <TextField
              label='Contraseña'
              type='password'
              placeholder='Contraseña'
              fullWidth
              sx={{ ...stiloInput, mt: 2 }}
              name='password'
              inputProps={{
                'data-testid': 'password',
              }}
              value={password}
              onChange={onInputChange}
            />
            <Grid display={!!errorMessage ? '' : 'none'} sx={{ mt: 1 }} container>
              <Grid item xs={12} sm={12}>
                <Alert severity='error'>{errorMessage}</Alert>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={12} sm={12}>
                <Button disabled={isAuthenticating} type='submit' variant='contained' fullWidth>
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction='row' justifyContent={'end'}>
            <Link component={LinkRouter} color={'inherit'} to='/register'>
              Crear una cuenta
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};
