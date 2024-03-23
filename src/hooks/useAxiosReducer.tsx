import { State, Action } from "../types/types"

const useAxiosReducer = <T,>() => (state: State<T>, action: Action<T>): State<T> => {
  switch(action.type) {
    case 'AXIOS_FETCH':
      return {
        isLoading: true,
        data: [] as T,
        error: ''
      }
    case 'AXIOS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      }
    case 'AXIOS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'DATA_UPDATE':
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
}

export default useAxiosReducer
