import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './store';
import { router } from './router/index.jsx';
import { checkAuth } from './store/slices/authSlice';

function AuthChecker() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <AuthChecker />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
