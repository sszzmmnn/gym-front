import { AxiosError } from "axios";
import useAxiosIntercept from "./useAxiosIntercept";

interface IOrderResult {
  value: boolean,
  message: string
}

const useOrder = () => {
  const axiosIntercept = useAxiosIntercept();

  const order = async (userId: string, passId: string, passCount: number): Promise<IOrderResult> => {
    try{
      await axiosIntercept.post('/order', {
          userId,
          passId,
          passCount
        }
      )

      return {
        value: true,
        message: 'Thank you for buying the member pass! Access your pass through your user profile!'
      }
    } catch(e) {
      if (e instanceof AxiosError) {
        return {
          value: false,
          message: e.response?.data?.error || 'Something went wrong'
        }
      }
      return {
        value: false,
        message: 'Something went wrong'
      }
    }
  }

  return order;
}

export default useOrder