import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HttpClientContext, iHttpClient } from '../provider/HttpClientProvider';
import { AuthContext, iAuthContext } from '../provider/AuthProvider';

export default function Login() {
  const auth = useContext<iAuthContext>(AuthContext)
  function handleOnLogin(){
    auth.login()
  }
  return (
    <>
    <button onClick={handleOnLogin}>Login</button>
    </>
  );
}
