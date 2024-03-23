import { useEffect, useReducer } from "react";
import useAxiosIntercept from "../hooks/useAxiosIntercept"
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import useAxiosReducer from "../hooks/useAxiosReducer";
import { AxiosError, AxiosResponse } from "axios";

interface IClass {
  _id: string,
  name: string,
  date: number,
  enrolled: number,
  isUserEnrolled: boolean,
  isCoachClaimed: boolean,
  claimedBy: string
}

const Classes = () => {
  const { auth } = useAuth();
  const { user } = useUser();
  const axiosIntercept = useAxiosIntercept();
  const axiosReducer = useAxiosReducer<IClass[]>();
  
  const [state, dispatch] = useReducer(axiosReducer, {
    isLoading: true,
    data: null,
    error: ''
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    dispatch({type: 'AXIOS_FETCH'});

    axiosIntercept.get(`/class${auth?.roles.includes(5000) ? '?perms=coach' : ''}`, {
      params: {
        perms: auth?.roles.includes(5000) ? 'coach' : '',
        user: user ? user._id : ''
      },
      signal
    }).then((res) => {
      if(!signal.aborted){
        console.log(res.data);
        dispatch({
          type: 'AXIOS_SUCCESS',
          payload: res.data
        })
      }
    }).catch((e) => {
      if(!signal.aborted) {
        dispatch({
          type: 'AXIOS_ERROR',
          payload: e instanceof AxiosError ? e.response?.data?.error : 'Error'
        })
        if(e instanceof AxiosError) {
          console.log(e.response?.data?.error);
        } else console.log(e);
      }
    })

    return () => {
      controller.abort()
    }
  }, [])

  const handleClaim = async (e: React.MouseEvent<HTMLButtonElement>, _id: string) => {
    const btn = e.currentTarget;
    btn.setAttribute('disabled', '');

    try{
      await axiosIntercept.post('/class/claim', {
        userId: user?._id,
        classId: _id
      }).then((res: AxiosResponse) => {
        // console.log(res.data);
        if(!state.data) return;
        const classIndex = state.data.findIndex(x => x._id === res.data._id);
        if(!Number.isFinite(classIndex)) return;

        // Is this a shallow dopy or a deep copy then?
        const updatedState = state.data.map((item, i) => 
          i === classIndex
            ? { ...item, ...res.data }
            : { ...item }
        );

        dispatch({
          type: 'DATA_UPDATE',
          payload: updatedState
        })
      });
    } catch(e) {
      if(e instanceof AxiosError) {
        console.log(e.response?.data?.error);
      }
    }

    btn.removeAttribute('disabled');
  }

  const handleEnroll = async (e: React.MouseEvent<HTMLButtonElement>, _id: string) => {
    const btn = e.currentTarget;
    btn.setAttribute('disabled', '');

    try {
      await axiosIntercept.post('/class/enroll', {
        userId: user?._id,
        classId: _id
      }).then((res: AxiosResponse) => {
        // console.log(res.data);
        if(!state.data) return;
        const classIndex = state.data?.findIndex(x => x._id === res.data._id);
        if(!Number.isFinite(classIndex)) return;

        const updatedState = state.data.map((item, i) => 
          i === classIndex
            ? { ...item, ...res.data }
            : { ...item }
        );

        dispatch({
          type: 'DATA_UPDATE',
          payload: updatedState
        })
      });
    } catch (e) {
      if(e instanceof AxiosError) {
        console.log(e.response?.data?.error);
      }
    }

    btn.removeAttribute('disabled');
  }

  return (
    <>
    {state.isLoading && 'Loading...'}
    {state.error}
    {state.data &&
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Class Name</th>
            <th>Participants</th>
            <th>Run by</th>
            {auth && <th>Options</th>}
          </tr>
        </thead>
        <tbody>
          {state.data.length>0 &&
            state.data.map((oneClass, i) => (
              <tr key={i}>
                <td>{ new Date(oneClass.date).toLocaleString('pl-PL') }</td>
                <td>{ oneClass.name }</td>
                <td>{ oneClass.enrolled }</td>
                <td>{ oneClass.claimedBy }</td>
                {auth?.roles.includes(1001) && 
                  <td>
                    {auth?.roles.includes(5000) && 
                      <button style={{
                        backgroundColor: oneClass.isCoachClaimed ? 'red' : 'green'
                        }}
                        onClick={(e) => handleClaim(e, oneClass._id)}>{oneClass.isCoachClaimed ? 'Resign' : 'Claim'}
                      </button>
                    }
                    <button style={{
                      backgroundColor: oneClass.isUserEnrolled ? 'red' : 'green'
                      }}
                      onClick={(e) => handleEnroll(e, oneClass._id)}>{oneClass.isUserEnrolled ? 'Withdraw' : 'Enroll'}
                    </button>
                  </td>
                }
              </tr>
          ))}
        </tbody>
      </table>  
    }
    </>
  )
}

export default Classes