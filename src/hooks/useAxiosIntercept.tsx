import { useEffect } from 'react';
import { axiosIntercept } from '../api/axios'
import useAuth from './useAuth'
import useRefresh from './useRefresh';
import useWipeContext from './useWipeContext';

const useAxiosIntercept = () => {
  const { auth } = useAuth();
  const refresh = useRefresh();
  const wipeContext = useWipeContext();

  useEffect(() => {
    const reqIntercept = axiosIntercept.interceptors.request.use(
      config => {
        if(!config.headers['Authorization']){
          config.headers['Authorization'] = `Bearer ${auth?.token}`;
        }
        return config;
      },
      error => { Promise.reject(error); }
    )

    const resIntercept = axiosIntercept.interceptors.response.use(
      response => response,
      async (err) => {
        const reqCfg = err?.config;
        if(err?.response?.status === 403 && !reqCfg.sent) { //.sent - custom flag to avoid infinite loop
          reqCfg.sent = true;
          const refreshedToken = await refresh();
          if(refreshedToken === null) {
            wipeContext();
            return;
          }
          reqCfg.headers['Authorization'] = `Bearer ${refreshedToken}`;
          return axiosIntercept(reqCfg);
        } else throw err;
      }
    )

    return(() => {
      axiosIntercept.interceptors.request.eject(reqIntercept);
      axiosIntercept.interceptors.response.eject(resIntercept);
    })
  }, [auth, refresh])

  return axiosIntercept;
}

export default useAxiosIntercept