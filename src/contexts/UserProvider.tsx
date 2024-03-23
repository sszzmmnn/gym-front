import { createContext, useEffect, useState } from 'react'
import { IUser } from '../types/types';

export type ContextProps = {
  user: IUser | null,
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const initContextProps = {
  user: null,
  setUser: () => {}
}

const UserContext = createContext<ContextProps>(initContextProps);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const localUser = localStorage.getItem('user');
    try{
      return localUser ? JSON.parse(localUser) : null;
    } catch (err) {
      return null;
    }
  });

  // is it really needed? i just do that twice now
  useEffect(() => {
    //JSON.parse for getting an object
    const localUser = JSON.parse(localStorage.getItem('user') || "{}");
    const newUser = Object.keys(localUser).length !== 0 ? localUser : null;
    setUser(newUser);
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      { children }
    </UserContext.Provider>
  )
}

export default UserContext;