export interface IAuth {
  token: string,
  roles: number[]
}

export interface IPass {
  _id: string
  name: string,
  price: number,
  description: string,
  featured: boolean
}

export interface IUser {
  _id: string
}

export interface IApiRes {
  success: boolean,
  message: string
}

export interface State<T> {
  isLoading: boolean,
  data: T | null,
  error: string
}

export type Action<T> = 
    | {type: 'AXIOS_FETCH'}
    | {type: 'AXIOS_SUCCESS', payload: T}
    | {type: 'AXIOS_ERROR', payload: string}
    | {type: 'DATA_UPDATE', payload: T}