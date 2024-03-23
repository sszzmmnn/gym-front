import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosIntercept from "../hooks/useAxiosIntercept";
import useUser from "../hooks/useUser";
import useOrder from "../hooks/useOrder";
import { AxiosError } from "axios";
import { IPass } from "../types/types";

interface ICheckout {
  pass: IPass
  count: number
}

interface IUserInfo {
  name: string,
  email: string,
  phone: string
}

const Checkout = () => {
  const { user } = useUser();
  const axiosIntercept = useAxiosIntercept();
  const order = useOrder();
  const navigate = useNavigate();
  const location = useLocation();
  const passId = new URLSearchParams(location.search).get('passId');

  const [checkout, setCheckout] = useState<ICheckout | null>(null);
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [passCount, setPassCount] = useState<number>(1);

  useEffect(() => {
    const controller: AbortController = new AbortController();
    const signal = controller.signal;
    // imlpement abortcontrollers
    setLoading(true);
    setError(false);
    if(!passId || !user) {
      setLoading(false);
      setError(true);
      return;
    }

    (async () => {
      try {
        await axiosIntercept.get(`/pass/${passId}`, {
          signal
        }).then((result) => {
          if(!signal.aborted){
            setCheckout({ pass: { ...result.data }, count: 1});
            setLoading(false);
          }
        });

        await axiosIntercept.get(`/user/info/${user!._id}`, {
          signal: controller.signal
        }).then((result) => {
          if(!signal.aborted) {
            setUserInfo(result.data);
          }
        })
      } catch (e) {
        if(!signal.aborted) {
          console.log(e);
          if(e instanceof AxiosError) {
            setLoading(false);
            setError(true);
            console.log(e.response?.data?.error);
          }
        }
      }
    })();
    
    return () => {
      controller.abort();
    }
  }, []);

  const handleBuy = async () => {
    if(!user || !checkout) return; // dodać info czemu nie można
    await order(user._id, checkout.pass._id, passCount)
      .then((res) => {
        navigate('/transaction', {
          replace: true,
          state: {
            order: res
          }
        })
      })
  }

  return (
    <>
      <h3>Checkout</h3>
      {loading && 'Loading...'}
      {error && 'An error occurred.'}
      {checkout && 
        <div className="checkout-summary">
          {checkout?.pass && 
            <p>
              <b>Pass Name</b>: {checkout.pass.name}<br/>
              <b>Pass Description</b>: {checkout.pass.description || 'No description provided'}
            </p>
          }
          <p>
            <button onClick={() => { passCount>1 ? setPassCount((prev) => prev - 1) : setPassCount(1) }}>-</button>
            &ensp;&ensp;&ensp;<b>Quantity: {passCount}</b>&ensp;&ensp;&ensp;
            <button onClick={() => { passCount<99 ? setPassCount((prev) => prev + 1) : setPassCount(99) }}>+</button>
          </p>
          <b>Price: { Math.floor((checkout.pass.price * passCount)/100) + ',' + ((checkout.pass.price * passCount)%100 < 10 ? `0${(checkout.pass.price * passCount)%100}` : (checkout.pass.price * passCount)%100) } PLN</b>
          {userInfo &&
            <div className="user-info">
            Data provided by you:
            <p>Full Name: {userInfo.name}</p>
            <p>E-Mail: {userInfo.email}</p>
            <p>Phone number: {userInfo.phone}</p>
            </div>
            }
          <p>Should any of this info be wrong, contact an administrator.</p>
          <button onClick={handleBuy}>Buy</button>
        </div>
      }
    </>
  )
}

export default Checkout;