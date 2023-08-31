import React, { createContext} from 'react';

export interface iAuthContext {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const GOOGLE_LOGIN_URL = process.env.REACT_APP_GOOGLE_LOGIN_URL;


const initialAuthContext: iAuthContext = {
  login: () => {
    throw new Error('Login not yet initialised');
  },
  logout: () => {
    throw new Error('Logout not yet initialised');
  },
  isAuthenticated: () => {
    throw new Error('Function not yet initialised');
  }
};

export const AuthContext = createContext<iAuthContext>(initialAuthContext);

const { Provider } = AuthContext;

export default function AuthProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {



  async function login() {
    if(GOOGLE_LOGIN_URL){
      window.location.replace(GOOGLE_LOGIN_URL)
    } else {
      throw new Error("Login link unavailable")
    }
  }


  async function logout() {}

  function isAuthenticated() {
    
    return true;
  }
  return (
    <Provider value={{ login, logout, isAuthenticated }}>{children}</Provider>
  );
}
