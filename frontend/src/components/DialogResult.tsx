import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState, memo } from 'react';

export interface SimpleDialogProps {
  open: boolean;
  message: string;
  title: string;
  onClose: (value: boolean) => void;
}

export const SimpleDialogResult = memo((props: SimpleDialogProps) => {
  const { onClose, message, title, open } = props;
  const [openDialog, setOpenDialog] = useState<boolean>(open);

  useEffect(() => {
    setOpenDialog(open);
  }, [open]);

  const handleListItemClick = (value: boolean) => {
    onClose(value);
    setOpenDialog(false);
  };

  return (
    <Dialog onClose={() => handleListItemClick(false)} open={openDialog}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description'>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            fontWeight: '800',
            fontFamily: 'inherit',
            ':hover': { color: 'background.default' },
          }}
          color='info'
          onClick={() => handleListItemClick(false)}
        >
          Cancelar
        </Button>
        <Button
          sx={{
            fontWeight: '800',
            fontFamily: 'inherit',
            ':hover': { color: 'background.default' },
          }}
          color='warning'
          onClick={() => handleListItemClick(true)}
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
});
SimpleDialogResult.displayName = 'SimpleDialogResult';
