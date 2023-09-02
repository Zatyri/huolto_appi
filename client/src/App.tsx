import React, { useContext } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import Root from './components/Root';
import { AuthContext, AuthState, iAuthContext } from './provider/AuthProvider';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const auth = useContext<iAuthContext>(AuthContext);
  
  function protectedRoutes(authState: AuthState):JSX.Element{
    if(authState === AuthState.loading){
      return <>Loading</>
    } else if(authState === AuthState.isAuthenticated){
      return <Root />
    }else {
      return <Navigate to="/login" replace />
    }
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: protectedRoutes(auth.authState),
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
      element: <Login />
    },
    {
      path: '/logout',
      element: <>logout</>
    },
    {
      path: '/register',
      element: <Register />
    }
  ]);

  return <RouterProvider router={router} fallbackElement={<>Loading</>} />;
}

export default App;
