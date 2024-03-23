import useAuth from "./useAuth";
import useUser from "./useUser";

const useWipeContext = () => {
  const { setAuth } = useAuth();
  const { setUser } = useUser();

  const wipeContext = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    setAuth(null);
    setUser(null);
  }

  return wipeContext;
}

export default useWipeContext