import { AxiosError } from 'axios';
import useAuth from './useAuth';
import useUser from './useUser';
import axios from '../api/axios';
import { IApiRes } from '../types/types';

const useLogin = () => {
  const { setAuth } = useAuth();
  const { setUser } = useUser();
  const login = async (email: string, password: string): Promise<IApiRes> => {
    try {
      console.log({email, password});
      const response = await axios.post('/user/login',
        {email, password}
      );

      console.log(response.data);
      localStorage.setItem('auth', JSON.stringify(response.data[0]));
      localStorage.setItem('user', JSON.stringify(response.data[1]));
      setAuth(() => {console.log(response.data[0]); return response.data[0]});
      setUser(() => {console.log(response.data[1]); return response.data[1]});
      return {success: true, message: ''};
    } catch(err) {
      if(err instanceof AxiosError) {
        const msg = err.response?.data?.error;
        return {success: false, message: msg || 'No API information'}
      }
      console.log(err);
      return {success: false, message: 'Failed to log in'};
    }
  }

  // return login and return { login } make a difference
  return login
  
  // useEffect only
  // return (() => {
  //   controller.abort();
  // })
}

export default useLogin
