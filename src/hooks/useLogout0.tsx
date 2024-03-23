import { AxiosError } from "axios";
import useAuth from "./useAuth";
import useAxiosIntercept from "./useAxiosIntercept";
import useWipeContext from "./useWipeContext";

interface ILogout {
  logout: true,
  message: string
}

const useLogout0 = () => {
  const { auth } = useAuth();
  const wipeContext = useWipeContext();
  const axiosIntercept = useAxiosIntercept();

  const logout0 = async () => {
    if(!auth) return {
      result: false,
      message: "No auth data"
    }

    try {
      const result = await axiosIntercept.post('/user/logout', {
        token: auth.token
      });

      const logoutData: ILogout = result.data;
  
      if(logoutData.logout){
        wipeContext();
      }
    } catch(e) {
      if(e instanceof AxiosError) {
        const logoutErr: ILogout = e.response?.data;
        console.log(logoutErr.message);
      } else console.log(e);
    }
  }

  return logout0;
}

export default useLogout0