import React, { useContext } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import Root from './components/Root';
import { AuthContext, iAuthContext } from './provider/AuthProvider';

function App() {
  const auth = useContext<iAuthContext>(AuthContext);

  const router = createBrowserRouter([
    {
      path: '/',
      element: auth.isAuthenticated() ? (
        <Root />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        {
          path: 'dashboard',
          element: <>dashboard placeholder</>,
        },
        {
          path: 'about',
          element: <>About placeholder</>,
        },
      ],
    },
    {
      path: '/login',
      element: <>login</>
    },
    {
      path: '/logout',
      element: <>logout</>
    },
    {
      path: '/register',
      element: <>logout</>
    }
  ]);

  return <RouterProvider router={router} fallbackElement={<>Loading</>} />;
}

export default App;
