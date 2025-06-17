import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import DesignSystems from '../pages/DesignSystems/DesignSystems';
import SystemDetail from '../pages/DesignSystems/SystemDetail';
import Components from '../pages/Components/Components';
import ComponentDetail from '../pages/Components/ComponentDetail';
import Foundations from '../pages/Foundations/Foundations';
import Documentation from '../pages/Documentation/Documentation';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound/NotFound';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'design-systems',
        element: (
          <ProtectedRoute>
            <DesignSystems />
          </ProtectedRoute>
        ),
      },      {
        path: 'design-systems/:id',
        element: (
          <ProtectedRoute>
            <SystemDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'system/:id',
        element: (
          <ProtectedRoute>
            <SystemDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'components',
        element: (
          <ProtectedRoute>
            <Components />
          </ProtectedRoute>
        ),
      },
      {
        path: 'components/:id',
        element: (
          <ProtectedRoute>
            <ComponentDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'foundations',
        element: (
          <ProtectedRoute>
            <Foundations />
          </ProtectedRoute>
        ),
      },
      {
        path: 'documentation',
        element: (
          <ProtectedRoute>
            <Documentation />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
