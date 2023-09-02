import React, { createContext, useContext, useEffect, useState} from 'react';
import { HttpClientContext, iHttpClient } from './HttpClientProvider';

export interface iAuthContext {
  authState: AuthState
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  getUserData: () => void;
}

export enum AuthState {
  loading,
  isAuthenticated,
  notAuthenticated,
  error
}

const GOOGLE_LOGIN_URL = process.env.REACT_APP_GOOGLE_LOGIN_URL;


const initialAuthContext: iAuthContext = {
  authState: AuthState.loading,
  login: () => {
    throw new Error('Login not yet initialised');
  },
  logout: () => {
    throw new Error('Logout not yet initialised');
  },
  isAuthenticated: () => {
    throw new Error('Function not yet initialised');
  },
  getUserData: () => {}
};

export const AuthContext = createContext<iAuthContext>(initialAuthContext);

const { Provider } = AuthContext;

export default function AuthProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const httpClient = useContext<iHttpClient>(HttpClientContext)
  const [authState, setAuthState] = useState<AuthState>(AuthState.loading)

  useEffect(() => {
    async function getAuthState(){
      const response = await httpClient.getData<any>("/isAuthenticated")
      if(response.isError === false){
        setAuthState(AuthState.isAuthenticated)
      } else {
        setAuthState(AuthState.notAuthenticated)
      }
    }
    getAuthState().catch(() => setAuthState(AuthState.error))
  }, [httpClient])

  async function login() {
    if(GOOGLE_LOGIN_URL){
      window.location.replace(GOOGLE_LOGIN_URL)
    } else {
      throw new Error("Login link unavailable")
    }
  }  

  async function logout() {}

  function isAuthenticated() {
    return authState === AuthState.isAuthenticated
  }

  async function getUserData(){
    const response = await httpClient.getData<any>("/userinfo")
    console.log(response)
  }
  return (
    <Provider value={{ authState, login, logout, isAuthenticated, getUserData }}>{children}</Provider>
  );
}
