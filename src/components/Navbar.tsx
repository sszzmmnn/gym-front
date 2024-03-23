import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import useLogout0 from '../hooks/useLogout0';
import { useEffect } from 'react';
import logo from '../assets/logo.svg'

export const Navbar = () => {
  const { auth } = useAuth();
  const logout0 = useLogout0();
  const navigate = useNavigate(); 

  useEffect(() => {
    console.log(auth);
  }, [auth])

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.setAttribute('disabled', '');
    await logout0();
    btn.removeAttribute('disabled');
    navigate('/', { replace: true });
  }

  return (
    <header>
        <nav>
          <Link to='/'><img src={logo} alt="FitTime" style={{objectFit: 'scale-down'}}/></Link>
          <NavLink to='coaches'>Coaches</NavLink>
          <NavLink to='classes'>Classes</NavLink>
          <NavLink to='passes'>Passes</NavLink>
          <NavLink to='private'>Private</NavLink>
        </nav>
        <div className="user">
          { auth ? (
            <>
              <Link to='user'>User Profile</Link>
              <button onClick={handleDelete}>Log out</button>
            </>
          ) : (
            <>
              <Link to='login'>Login</Link>
              <Link to='signup'>Sign Up</Link>
            </>
          )}
        </div>
    </header>
  )
}