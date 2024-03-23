import useUser from "./useUser"
import useAxiosIntercept from "./useAxiosIntercept";
import { AxiosError } from "axios";
import { IApiRes } from "../types/types";

const useChangePassword = () => {
  const { user } = useUser();
  const axiosIntercept = useAxiosIntercept();
  const changePassword = async (oldPw: string, newPw: string): Promise<IApiRes> => {
    try{
      const response = await axiosIntercept.post('/user/password', {
        userId: user?._id,
        oldPw: oldPw,
        newPw: newPw
      })
      return {success: true, message: ''};
    } catch(e) {
      if(e instanceof AxiosError) {
        const msg = e.response?.data?.error;
        return {success: false, message: msg || 'No API Information'};
      }
      console.log(e);
      return {success: false, message: 'Failed to change password'};
    }
  }

  return changePassword;
}

export default useChangePassword