import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import useAxiosIntercept from '../hooks/useAxiosIntercept';
import useUser from '../hooks/useUser';
import { AxiosError } from 'axios';

interface IMemberInfo {
  active: boolean,
  data: string
}

interface IUserInfo {
  name: string,
  member: IMemberInfo
}

const User = () => {
  // fetch profile info
  // edit user profile
  // display pass info
  // get a pass
  const { user } = useUser();
  const axiosIntercept = useAxiosIntercept();
  const location = useLocation();

  // make useRef for this one, looks like a good idea
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isQrDisplayed, setIsQrDisplayed] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    name: "",
    member: {
      active: false,
      data: ""
    }
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    setError(false);
    setLoading(true);
    const fetchUser = async () => {
      if(!user) {
        setError(true);
        setLoading(false);
        return;
      }

      try{
        const resUser = await axiosIntercept.get('/user', {
          signal,
          params: { _id: user._id }
        });

        if(!signal.aborted){
          console.log(resUser.data);
          setUserInfo(resUser.data);
          setLoading(false);
        }
      } catch(e) {
        if(!signal.aborted) {
          setLoading(false);
          setError(true);
          if (e instanceof AxiosError) {
            console.log(e.response?.data?.error)
          } else console.log(e);
        }
      }
    }

    fetchUser();
    if(location.state?.password) window.history.replaceState({}, document.title);
    return () => {
      controller.abort();
    }
  }, [])

  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {(!loading && !error) && 
        <p>Full Name: {userInfo.name}</p>
      }
      {error && <p>jest error</p>}
      {userInfo.member.active &&
        <button onClick={() => setIsQrDisplayed((prev) => !prev)}>{isQrDisplayed ? 'Hide Access Code' : 'Show Access Code'}</button>
        }
      {isQrDisplayed && <QRCode value={userInfo.member.data} />}
      <Link to='/user/password'>Change Password</Link>
      {location.state?.password && location.state.password.message}
    </div>
  )
}

export default User