import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { LuLayoutDashboard } from 'react-icons/lu';
import { FaShopify } from 'react-icons/fa';
import { BsFillPeopleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to='/'>
      <ListItemIcon sx={{ color: 'inherit' }}>
        <LuLayoutDashboard />
      </ListItemIcon>
      <ListItemText primary='Principal' />
    </ListItemButton>
    <ListItemButton component={Link} to='/add-notebook'>
      <ListItemIcon sx={{ color: 'inherit' }}>
        <FaShopify />
      </ListItemIcon>
      <ListItemText primary='Alta Notebook' />
    </ListItemButton>
    <ListItemButton component={Link} to='/notebooks'>
      <ListItemIcon sx={{ color: 'inherit' }}>
        <BsFillPeopleFill />
      </ListItemIcon>
      <ListItemText primary='Buscar Notebook' />
    </ListItemButton>
  </React.Fragment>
);
