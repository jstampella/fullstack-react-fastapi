import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { AppTheme } from './theme/AppTheme';
import { store } from './store';
import './styles/global';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppTheme>
        <BrowserRouter>
          <SnackbarProvider
            preventDuplicate={true}
            maxSnack={3}
            autoHideDuration={8000}
            transitionDuration={300}
          >
            <App />
          </SnackbarProvider>
        </BrowserRouter>
      </AppTheme>
    </Provider>
  </React.StrictMode>
);
