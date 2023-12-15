import { useSelector } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import type { RootState } from '../store';
import { darkTheme, lightTheme } from './';

interface Props {
  children?: React.ReactNode;
}

type Theme = 'dark' | 'light'; // Agregar un tipo para el tema

export const AppTheme: React.FC<Props> = ({ children }: Props) => {
  const theme: Theme = useSelector((state: RootState) => state.appState.theme); // Usar useSelector para obtener el estado y especificar el tipo de estado
  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
