import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Root from './components/Root';
import AuthProvider from './provider/AuthProvider';
import HttpClientProvider from './provider/HttpClientProvider';

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
    <HttpClientProvider>
      <AuthProvider>
        <RouterProvider router={router} fallbackElement={<>Loading</>} />
      </AuthProvider>
    </HttpClientProvider>
  );
}

export default App;
