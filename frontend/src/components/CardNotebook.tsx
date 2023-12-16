import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { INotebookCreate } from '../interfaces';

interface IProps extends Partial<INotebookCreate> {
  url: string;
}

export default function CardNotebook({ disco_rigido_id, marca,memoria,modelo,placa_video,precio, url }: IProps) {
  return (
    <Card sx={{ minWidth: 100, maxWidth: 300, flex: 1 }}>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          Marca: {marca}
        </Typography>
        <Typography variant='h5' component='div'>
          Modelo: {modelo}
        </Typography>
        <Typography color='text.secondary'>Memoria: {memoria}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }} color='background.default'>
        <Link component={RouterLink} color={'inherit'} to={url} sx={{ pr: 2 }}>
          VER
        </Link>
      </CardActions>
    </Card>
  );
}
