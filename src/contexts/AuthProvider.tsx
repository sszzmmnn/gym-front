import { createContext, useEffect, useState } from 'react'
import { IAuth } from '../types/types';

export type ContextProps = {
  auth: IAuth | null,
  setAuth: React.Dispatch<React.SetStateAction<IAuth | null>>
}

const initContextProps = {
  auth: null,
  setAuth: () => {}
}

const AuthContext = createContext<ContextProps>(initContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<IAuth | null>(() => {
    const localAuth = localStorage.getItem('auth');
    try{
      return localAuth ? JSON.parse(localAuth) : null;
    } catch (err) {
      return null;
    }
  });

  // is it really needed? i just do that twice now
  useEffect(() => {
    //JSON.parse for getting an object
    const localAuth = JSON.parse(localStorage.getItem('auth') || "{}");
    const newAuth = Object.keys(localAuth).length !== 0 ? localAuth : null;
    setAuth(newAuth);
  }, []);
  
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      { children }
    </AuthContext.Provider>
  )
}

export default AuthContext;