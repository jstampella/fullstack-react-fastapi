import { createTheme } from '@mui/material/styles';
import colorConfigs from '../configs/colorConfigs';
import { Typography } from '@mui/material/styles/createTypography';

const breakpoints = {
  values: {
    xs: 0, // Extra Small, para pantallas pequeñas
    sm: 600, // Small, para pantallas de tamaño mediano
    md: 960, // Medium, para pantallas de tamaño mediano
    lg: 1280, // Large, para pantallas grandes
    xl: 1920, // Extra Large, para pantallas extra grandes
  },
};

const typography: Partial<Typography> = {
  fontFamily: 'Arial', // Cambia la fuente por defecto a Nunito
  fontSize: 14,
  h1: {
    fontFamily: 'Roboto', // Cambia la fuente para los encabezados H1 a Montserrat
    fontSize: '3rem',
  },
  h2: {
    fontFamily: 'Roboto', // Cambia la fuente para los encabezados H1 a Montserrat
    fontSize: '2.2rem',
  },
  h3: {
    fontFamily: 'Montserrat', // Cambia la fuente para los encabezados H1 a Montserrat
    fontSize: '2rem',
  },
  body1: {
    fontFamily: 'Arial', // Cambia la fuente para el cuerpo de texto a Open Sans
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colorConfigs.color1, light: colorConfigs.color3 },
    secondary: { main: colorConfigs.color2 },
    background: { default: colorConfigs.color6, paper: colorConfigs.color1 },
    text: {
      disabled: colorConfigs.color4,
      primary: colorConfigs.color5,
      secondary: colorConfigs.color6,
    },
    success: { main: '#2d9b33' },
  },
  breakpoints: breakpoints,
  typography: typography,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colorConfigs.color3, light: colorConfigs.color2 },
    secondary: { main: colorConfigs.color1 },
    background: { default: colorConfigs.color6, paper: colorConfigs.color1 },
    text: {
      disabled: colorConfigs.color4,
      primary: colorConfigs.color4,
      secondary: colorConfigs.color4,
    },
    success: { main: '#2d9b33' },
  },
  breakpoints: breakpoints,
  typography: typography,
});
