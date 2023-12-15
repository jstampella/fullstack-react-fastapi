import * as React from 'react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { IoMdNotifications } from 'react-icons/io';
import { AiOutlineDoubleLeft } from 'react-icons/ai';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { GiHamburgerMenu } from 'react-icons/gi';
import { mainListItems } from '../components/ListItems';
import { useAppSelector, useAuthStore, useNotify } from '../hooks';
import { Tooltip } from '@mui/material';
import ButtonSwitch from '../components/ButtonSwitch';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  })
);

interface Props {
  children: React.ReactNode;
}

export default function LayoutApp({ children }: Props) {
  const [open, setOpen] = React.useState(true);
  const { notify } = useNotify();
  const { startLogout } = useAuthStore();
  const { errorMessage, records } = useAppSelector((state) => state.client);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    if (errorMessage !== '' && errorMessage) notify(errorMessage);
  }, [errorMessage]);

  return (
    <Box aria-label='layout-app' sx={{ display: 'flex', position: 'relative' }}>
      <CssBaseline />
      <AppBar position='absolute' open={open} sx={{ backgroundColor: 'secondary.main' }}>
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <GiHamburgerMenu />
          </IconButton>
          <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
            ABM USUARIO
          </Typography>
          <Tooltip title='Ultimos registros'>
            <IconButton color='inherit'>
              <Badge badgeContent={records ? records.length : 0} color='secondary'>
                <IoMdNotifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title='Salir'>
            <IconButton onClick={startLogout} color='inherit'>
              <Badge color='secondary'>
                <RiLogoutBoxFill />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        open={open}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer} color='info'>
            <AiOutlineDoubleLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        <List
          component='nav'
          sx={{ color: 'background.default', a: { ':hover': { color: 'primary.light' } }, flex: 1 }}
        >
          {mainListItems}
        </List>
        <ButtonSwitch />
      </Drawer>
      <Box
        component='main'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          paddingTop: '64px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            margin: 0,
            padding: 0,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
          aria-label='layout-app-container'
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
