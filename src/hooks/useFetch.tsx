// NOT IN USE
import { AxiosError, AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import useUser from './useUser';
import useAxiosIntercept from './useAxiosIntercept';

interface IClass {
    _id: string,
    name: string,
    date: Date,
    enrolled: number,
    isUserEnrolled: boolean,
    isCoachClaimed: boolean,
    claimedBy: string
  }

const useFetch = () => {
  const { auth } = useAuth();
  const { user } = useUser();
  const axiosIntercept = useAxiosIntercept();

  const [isLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<IClass[]>([] as IClass[]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    axiosIntercept.get(`/class${auth?.roles.includes(5000) ? '?perms=coach' : ''}`, {
      params: {
        perms: auth?.roles.includes(5000) ? 'coach' : '',
        user: user ? user._id : ''
      },
      signal
    }).then((res: AxiosResponse) => {
      if(!signal.aborted){
        setData(res.data);
      }
    }).catch((e) => {
      if(!signal.aborted) {
        setError(e instanceof AxiosError ? e.response?.data?.error : 'Error')
        if(e instanceof AxiosError) {
          console.log(e.response?.data?.error);
        } else console.log(e);
      }
    })

    return () => {
      controller.abort()
    }
  }, [])

  return {isLoading, error, data, setData};
}
export default useFetch;
