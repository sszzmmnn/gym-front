import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import useChangePassword from "../hooks/useChangePassword"; 

interface IForm {
  oldPw: string,
  newPw: string,
  repeatPw: string
}

const UserPassword = () => {
  const { register, handleSubmit, getValues, formState: { errors }} = useForm<IForm>();
  const changePassword = useChangePassword();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/user';

  const [error, setError] = useState<string>('');

  const onSubmit = async (data: IForm) => {
    console.log(location);

    const { oldPw, newPw } = data;
    const result = await changePassword(oldPw, newPw);
    if(result.success) {
      navigate(from, { 
        replace: true, 
        state: {
          password: {
            success: true,
            message: 'Password changed successfully'
          }
        }
      })
    } else {
      setError(result.message);
    }
  }

  return (
    <div>
      Change Password<br/>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="old-pw">Old Password</label>
        <input type="password" id="old-pw" { ...register("oldPw", {
          required: {
            value: true,
            message: "Field required"
          }
        })}
        />
        {errors?.oldPw && <p>{ errors.oldPw.message }</p>}
      <br/>
      <label htmlFor="new-pw">New Password</label>
      <input type="password" id="new-pw" { ...register("newPw", {
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/gm,
          message: "Password not strong enough (min. length of 8, at least: 1 lowercase letter, 1 uppercase letter, 1 special symbol)"
        },
        required: {
          value: true,
          message: "Field required"
        }
      })}/>
      {errors?.newPw && <p>{ errors.newPw.message }</p>}
      <br/>
      <label htmlFor="repeat-pw">Repeat New Password</label>
      <input type="password" id="repeat-pw" { ...register("repeatPw", {
        validate: value => value === getValues("newPw") || "Passwords not matching"
      })}/>
      {errors?.repeatPw && <p>{ errors.repeatPw.message }</p>}
      <br/>
      <button>Change Password</button>
      </form>

        {error &&
          <p>
            Error: {error}
            <button onClick={() => setError('')}>Hide</button>
          </p>
        }
    </div>
  )
}

export default UserPassword