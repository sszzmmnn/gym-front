import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom"

const Transaction = () => {
  const location = useLocation();
  const orderState = location.state?.order;
  
  return (
    <div className='transaction'>
      {orderState &&
        orderState.value ?
          <h3>Transaction completed successfully</h3> :
          <h3>Transaction failed</h3>
      }
      { orderState && <p>{ orderState.message }</p> }
      {!orderState && 
        <div className='result-unknown'>
          <h3>Transaction result unknown</h3>
          <p>We're unsure what happened. Are you even supposed to be here?</p>
        </div>
      }
      <Link to='/user'>Click here</Link> to go to your profile.
      </div>
  )
}

export default Transaction