import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

export const MAX_SNACKBAR_COUNT = 3;
type typeNotify = 'default' | 'error' | 'success' | 'warning' | 'info';

export const useNotify = (messageDefault = 'Ocurrio un error') => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [message, setMessage] = useState<string>(messageDefault);
  const [typeDef, setType] = useState<typeNotify>('error');

  const notify = (messageDefault = message, type?: typeNotify) => {
    const snackbars = document.querySelectorAll('.notistack-Snackbar');
    const totalSnackbars = snackbars.length;
    if (totalSnackbars >= MAX_SNACKBAR_COUNT) {
      const snackToRemove = snackbars[0];
      if (snackToRemove) {
        const snackbarKey = snackToRemove.getAttribute('data-key');
        if (typeof snackbarKey === 'string') closeSnackbar(snackbarKey);
      }
    }
    enqueueSnackbar(messageDefault, {
      variant: type ? type : typeDef,
      action: (key) => (
        <>
          <Button size='small' onClick={() => closeSnackbar(key)}>
            Cancelar
          </Button>
        </>
      ),
      persist: !typeDef && type === 'error' ? true : false,
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
    });
  };
  return { notify, setMessage, setType };
};
