import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import { INotebookCreate } from '../interfaces';
import { convertToPrice } from '../utils/common';

interface IProps extends Partial<INotebookCreate> {
  url: string;
}

export default function CardNotebook({ marca,memoria,modelo, precio, url }: IProps) {
  return (
    <Card sx={{ minWidth: 200, maxWidth: 300, flex: 1, display: 'flex',flexDirection: 'column',
      justifyContent: 'space-between', position:'relative' }}>
      <CardContent sx={{ paddingBottom: 0, flex:1, display: 'flex',flexDirection: 'column',justifyContent: 'flex-start', zIndex:100 }}>
        <Typography sx={{ fontSize: 14 }} color='success.main' gutterBottom>
          Marca: {marca}
        </Typography>
        <Typography variant='h5' component='div'>
          Modelo: {modelo}
        </Typography>
        <Typography color='text.secondary'>Memoria: {memoria}</Typography>
        <Box sx={{flex:1, display:'flex', flexDirection: 'column',justifyContent: 'flex-end'}}>
        <Typography color='primary.light' variant='h2' component='p'>{convertToPrice(precio)}</Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', zIndex:100 }} color='background.default'>
        <Link component={RouterLink} color={'inherit'} to={url} sx={{ pr: 2 }}>
          VER
        </Link>
      </CardActions>
    </Card>
  );
}
