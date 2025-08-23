import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './router';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import './styles/index.css';
import { PersistGate } from 'redux-persist/integration/react';
import './redux/axios-interceptor';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
