import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className='user-layout'>
      <h3>User Profile</h3>
      <Outlet />
    </div>

  )
}

export default UserLayout