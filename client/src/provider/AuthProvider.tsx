import React, { createContext } from 'react'

interface iAuthContext {
  login: () => Promise<void>
  logout: () =>  Promise<void>
}

const initialAuthContext: iAuthContext = {
  login: () => {throw new Error("Login not yet initialised")},
  logout: () => {throw new Error("Logout not yet initialised")}
}

const AuthContext = createContext<iAuthContext>(initialAuthContext)

const {Provider} = AuthContext

export default function AuthProvider({children}: {children: JSX.Element | JSX.Element[]}) {

  async function login(){

  }

  async function logout(){

  }
  return (
    <Provider value = {{login, logout}}>
      {children}
    </Provider>
  )
}
