import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

interface Props {
  dni: string;
  nombre: string;
  apellido: string;
  url: string;
}

export default function CardClient({ dni, nombre, apellido, url }: Props) {
  return (
    <Card sx={{ minWidth: 100, maxWidth: 300, flex: 1 }}>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          DNI: {dni}
        </Typography>
        <Typography variant='h5' component='div'>
          Apellido: {apellido}
        </Typography>
        <Typography color='text.secondary'>Nombre: {nombre}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }} color='background.default'>
        <Link component={RouterLink} color={'inherit'} to={url} sx={{ pr: 2 }}>
          VER
        </Link>
      </CardActions>
    </Card>
  );
}
