import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from '../hooks/useAuth';
import useLogin from '../hooks/useLogin'

interface IForm {
  email: string,
  password: string
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IForm>();
  const { auth } = useAuth();
  const login = useLogin();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [error, setError] = useState<string>('');

  const onSubmit = async (/*e: React.FormEvent*/ data: IForm) => {
    // move this to a new folder (hooks) under the name 'useLogin'
    // also make other hooks like 'useSignup (useReducer for that?)' and 'useLogout'
    const { email, password } = data;
    const result = await login(email, password);
    if(result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  }

  useEffect(() => {
    if(auth) navigate('/', { replace: true });
  }, [])

  // const handleClear = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   localStorage.removeItem('user');
  //   console.log(localStorage.getItem('user'));
  // }

  return (
    <>
      {error &&
        <>
          <p>
            Error: {error}
          </p>
          <button onClick={() => setError('')}>Hide</button>
        </>
      }
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="text" id="email" 
          {...register("email", {
            required: {
              value: true,
              message: "Field required"
            }
          })}
        placeholder="E-Mail"/>
        <p>{errors?.email && errors.email.message}</p>

        <input type="password" id="password" 
          {...register("password", {
            required: {
              value: true,
              message: "Field required"
            }
          })}
        placeholder="Password"/>
        <p>{errors?.password && errors.password.message}</p>

        <button>Log In</button>
      </form>
    </>
  )
}

export default Login