import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Root from './components/Root';
import AuthProvider from './provider/AuthProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
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
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={<>Loading</>} />
    </AuthProvider>
  );
}

export default App;
