import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useDispatch } from 'react-redux';
import { setThemeState } from '../store/ui';
import Moonicon from '../assets/moon_icon.svg';
import Sunicon from '../assets/sun_icon.svg';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url(${Moonicon})`,
        backgroundSize: 'contain',
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: '\'\'',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url(${Sunicon})`,
      backgroundSize: 'contain',
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default function ButtonSwitch() {
  const dispatch = useDispatch();
  const onchange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch(setThemeState(checked ? 'dark' : 'light'));
  };
  return (
    <FormGroup>
      <FormControlLabel
        sx={{ pl: 1 }}
        control={<MaterialUISwitch sx={{ m: 1 }} onChange={onchange} />}
        label='Tema'
      />
    </FormGroup>
  );
}
