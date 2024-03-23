import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import useAuth from '../hooks/useAuth'
import axios from '../api/axios'
import codes from 'country-calling-code'
import {phone} from 'phone'
import { AxiosError } from 'axios'

interface IForm {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  callingCode: string,
  phoneNumber: string
}

const Signup = () => {
  const navigate = useNavigate();
  const { register, control, handleSubmit, getValues, formState: { errors } } = useForm<IForm>();
  const { auth } = useAuth();

  const [error, setError] = useState<string>('');

  const onSubmit = async (data: IForm) => {
    const { email, password, firstName, lastName, callingCode, phoneNumber } = data;
    console.log("Form submitted: ", data);

    // przeniesc to do nowego hook-a 
    // zrobic tam setAuth i setUser zwracany przez serwer
    // tutaj po hooku idzie do home albo pojawia sie info o niepomyslnej rejestracji
    console.log('phoneNumber:' + phone(phoneNumber, {country: callingCode}).phoneNumber?.toString());
    await axios.post('/user/signup', {
      email,
      password,
      phone: phone(phoneNumber, {country: callingCode}).phoneNumber?.toString(),
      firstName,
      lastName
    }).then((res) => {
      console.log(res.data);
      navigate('/login', { replace: true });
    }).catch((err) => {
      if(err instanceof AxiosError) {
        const msg = err.response?.data?.error || 'Unknown';
        setError(msg);
      }
      console.log(err.response.data.error);
    });
  }
  
  useEffect(() => {
    if(auth) navigate('/', { replace: true });
  }, [])

  return (
    <>
      {error && 
      <>
        <p>Error: {error}</p>
        <button onClick={() => setError('')}>Hide</button>
      </>
      }
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="text" id="email" 
          {...register("email", {
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/m,
              message: "Invalid email format"
            },
            required: {
              value: true,
              message: "Field required"
            }
            })}
          placeholder='E-mail'/>
          <p>{ errors.email && errors.email.message }</p>

          <input type="password" id="password"
            {...register("password", {
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                message: "Password not strong enough (min. length of 8, at least: 1 lowercase letter, 1 uppercase letter, 1 special symbol"
              },
              required: {
                value: true,
                message: "Field required"
              }
            })}
          placeholder='Password'/>
          <p>{ errors.password && errors.password.message }</p>

          <input type="text" id="first-name"
            { ...register("firstName", {
              minLength: {
                value: 2,
                message: 'Value too short'
              },
              maxLength: {
                value: 50,
                message: 'Value too long'
              },
              pattern: {
                value: /^(\S+\s{0,1})*\S+$/,
                message: 'Invalid input format'
              }
            })}
          placeholder='First Name'/>
          <p>{ errors.firstName && errors.firstName.message }</p>

          <input type="text" id="last-name"
            { ...register("lastName", {
              minLength: {
                value: 2,
                message: 'Value too short'
              },
              maxLength: {
                value: 50,
                message: 'Value too long'
              },
              pattern: {
                value: /^(\S+\s{0,1})*\S+$/,
                message: 'Invalid input format'
              }
            })}
          placeholder='Last Name'/>
          <p>{ errors.lastName && errors.lastName.message }</p>

          <select id="calling-code" defaultValue="PL" {...register('callingCode')}>
            {codes.map((code) => (
              <option key={code.isoCode2} value={code.isoCode2}>{`(+${code.countryCodes[0]}) ${code.country}`}</option>
            ))}
          </select>
          <input type="text" inputMode='numeric' id="phone-number"
            {...register('phoneNumber', {
              required: {
                value: true,
                message: 'Field required'
              },
              validate: value => phone(value, {country: getValues('callingCode')}).isValid || "Invalid phone number"
            })}
          />
          <p>{ errors.phoneNumber && errors.phoneNumber.message }</p>

          <button>Sign Up</button>
      </form>
      <DevTool control={control}/>
    </>
  )
}

export default Signup