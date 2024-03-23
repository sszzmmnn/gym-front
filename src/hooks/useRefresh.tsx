import { AxiosError } from "axios";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefresh = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    console.log(auth);
    try{
      const response = await axios.post('/refresh', {
        token: auth?.token
      });
      console.log(auth);
      setAuth(prev => {
        console.log('localStorage_auth: ' + JSON.stringify(localStorage.getItem('auth')));
        console.log('response.data: ' + JSON.stringify(response.data));
        localStorage.setItem('auth', JSON.stringify({ ...prev!, token: response.data.token }));
        return { ...prev!, token: response.data.token };
      })
      return response.data.token;
    } catch (err) {
      if(err instanceof AxiosError){
        if(err.response?.data.token === null || err.response?.data?.error === 'No token'){
          return null;
        }
      }
    }
    
  }

  return refresh;
}

export default useRefresh